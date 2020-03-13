import { Injectable } from '@nestjs/common';
import { AdmissionService } from '../../data-layer/admission/admission.service';
import { InstitutionService } from '../../data-layer/institution/institution.service';
import { LabTestService } from '../../data-layer/labtest/labtest.service';
import { PrescriptionService } from '../../data-layer/prescription/prescription.service';

@Injectable()
export class FieldSnaphotService {
  constructor(
      private institutionSvc: InstitutionService,
      private admissionSvc: AdmissionService,
      private prescriptionSvc: PrescriptionService,
      private labTestSvc: LabTestService,
  ) { }

  async institutions(ids: string[]) {
    const res = await this.institutionSvc.repository.findByIds(ids);
    return this.collectionsToMap(res);
  }

  async prescriptions(ids: string[]) {
    const res = await this.prescriptionSvc.repository.findByIds(ids);
    return this.collectionsToMap(res);
  }

  async labtests(ids: string[]) {
    const res = await this.labTestSvc.repository.findByIds(ids);
    return this.collectionsToMap(res);
  }

  async admissions(ids: string[]) {
    const res = await this.admissionSvc.repository.findByIds(ids);
    return this.collectionsToMap(res);
  }

  private collectionsToMap<T extends { id: string }>(items: T[]) {
    const map = new Map<string, T>();
    for (const item of items) {
      map.set((item).id, item);
    }
    return map;
  }
}
