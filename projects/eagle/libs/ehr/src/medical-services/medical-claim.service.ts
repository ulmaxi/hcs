import { Injectable } from '@nestjs/common';
import { MedicalCarePlan, TrackedMedicalCarePlan } from '../util';
import { UploadMedicalCareService } from './upload-medicare.service';
import { ClaimUploadStore } from './claim-upload-store';
import { awaitTo } from '@eagle/server-shared';
import * as uuid from 'uuid/v4';
import { RevokeMedicalCarePlanService } from './revoke-medical-care.service';
import { PersonnelService } from '../personnel/personel.service';

/**
 * Medical claim service responsible for saving complex
 * ehr record from other EHRs and can revoke other
 * actions already performed on the database.
 */
@Injectable()
export class MedicalClaimService {
    constructor(
        private uploader: UploadMedicalCareService,
        private recaller: RevokeMedicalCarePlanService,
        private personel: PersonnelService,
    ) { }

    /**
     * creates a new TrackedMedicarePlan record
     */
    createMedicarePlan(institution: string, plan: MedicalCarePlan) {
        const trackId = uuid();
        return this.continueMedicarePlan(institution, trackId, plan);

    }

    /**
     * Uploads the medicare by saving to the corresponding
     * database column
     */
    async continueMedicarePlan(institution: string, consulationTrackId: string, plan: MedicalCarePlan) {
        let error: Error;
        const state = new ClaimUploadStore(this.rollback);
        const care = new TrackedMedicalCarePlan();
        [care.staffId, error] = await awaitTo(this.personel.retriveStaffID(institution, plan.staffPhoneNo));
        state.update('staff', { error, trackerId: care.staffId });
        [care.patientId, error] = await awaitTo(this.personel.retriveTrackIdWithPhoneNo(plan.patientPhoneNo));
        state.update('patient', { error, trackerId: care.patientId });
        [care.admission, error] = await awaitTo(this.uploader.createAdmission({
            consulationTrackId,
            admissionClaim: plan.admission,
            patientId: care.patientId,
        }));
        state.update('admission', { error, trackerId: care.admission?.id });
        [care.labTests, error] = await awaitTo(this.uploader.createLabtest(plan.labTests));
        state.update('labTests', { error, trackerId: care.labTests.map(l => l.id) });
        [care.prescriptions, error] = await awaitTo(this.uploader.createPrescriptions(plan.prescriptions));
        state.update('prescriptions', { error, trackerId: care.prescriptions.map(p => p.id) });
        [care.review, error] = await awaitTo(this.uploader
            .createReview({
                consulationTrackId,
                review: plan.review,
                admissionId: care.admission.id,
                staffId: care.staffId,
            }));
        state.update('review', { error, trackerId: care.review?.id });
        [care.consultation, error] = await awaitTo(this.uploader.createConsultation({
            consultation: plan.consultation,
            institutionId: institution,
            plan: care,
            trackId: consulationTrackId,
        }));
        state.update('consultation', { error, trackerId: care.consultation?.id });
        return care;
    }

    /**
     * deletes previously saved data about the medicare plan
     */
    async rollback({ modelIdDB }: ClaimUploadStore) {
        const rollback = await Promise.all([
            this.recaller.deleteAdmission(modelIdDB.get('admission') as string),
            this.recaller.deleteConsultation(modelIdDB.get('consultation') as string),
            this.recaller.deleteLabtests(modelIdDB.get('labTests') as string[]),
            this.recaller.deletePrescriptions(modelIdDB.get('prescriptions') as string[]),
            this.recaller.deleteReview(modelIdDB.get('review') as string),
        ]);
    }

}
