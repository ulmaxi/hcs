import { FieldProcessorOperator } from '../subfields/field-processor';
import { Admission } from '../../data-layer/admission/admission.entity';
import { MiniConsultantDetails, ConsultationSnapshot, ConsulationGraphSnaphot } from '../util';
import { Institution } from '../../data-layer/institution/institution.entity';
import { LabTest } from '../../data-layer/labtest/labtest.entity';
import { Prescription } from '../../data-layer/prescription/prescription.entity';
import { Consultation } from '../../data-layer/consultation/consultation.entity';
import { pick } from 'lodash';
import { plainToClass } from 'class-transformer';

export interface SubFieldMap {
  admissions: Map<string, Admission>;
  consultants: Map<string, MiniConsultantDetails>;
  institutions: Map<string, Institution>;
  labtests: Map<string, LabTest>;
  prescriptions: Map<string, Prescription>;
}

/**
 * it takes a sorted list of consultations and
 * creates a graph displaying the consulations.
 * FEATURE:// to take new consultations without recreating the graph
 */
export class HistoryGraphSnapshot {
  /**
   * the intial trackingId's shot
   */
  SnapshotedStore: Map<string, ConsultationSnapshot[]>;
  /**
   * The already calculated graph
   */
  graph: ConsulationGraphSnaphot[];

  constructor(
    private metadatas: FieldProcessorOperator,
    private subFieldMaps: SubFieldMap) {
    this.SnapshotedStore = this.createdSnapShotGraphMap();
    this.graph = this.graphedShots(this.SnapshotedStore);
  }

  /**
   * creates a map<trackingId, consultations>
   * the consultations are recently sorted showing
   * the history of the consultations
   */
  private createdSnapShotGraphMap() {
    const SnapshotedStore = new Map<string, ConsultationSnapshot[]>();
    for (const consultation of this.metadatas.consultations) {
      const snapshot = this.formatToSnapshot(consultation);
      const newSnapshot = [...(SnapshotedStore.get(consultation.trackId) ?? []),
        snapshot];
      SnapshotedStore.set(consultation.trackId, newSnapshot);
    }
    return SnapshotedStore;
  }

  /**
   * creates ConsulationGraphSnaphot which displays
   * shows the initial consultation and the followups
   */
  private graphedShots(SnapshotedStore: Map<string, ConsultationSnapshot[]>) {
    const results: ConsulationGraphSnaphot[] = [];
    for (const [intital, ...followUps] of SnapshotedStore.values()) {
      results.push({ followUps, intital });
    }
    return results;
  }

  /**
   * composes a consultation snaphot class with the subfields
   */
  private formatToSnapshot(consultation: Consultation) {
    const remapped = pick(
      consultation, 'id', 'trackId', 'complain',
      'diagnosis', 'planAndProcedure', 'createdAt', 'updateAt',
    );
    const snapshot = {
      ...remapped,
      admission: this.subFieldMaps.admissions.get(consultation.admissionId),
      consultant: this.subFieldMaps.consultants.get(consultation.consultantId),
      institution: this.subFieldMaps.institutions.get(consultation.institutionId),
      labtests: (consultation.labtests ?? []).map(id => this.subFieldMaps.labtests.get(id)),
      prescriptions: (consultation.prescriptions ?? []).map(id => this.subFieldMaps.prescriptions.get(id)),
    };
    return plainToClass(ConsultationSnapshot, snapshot);
  }

}
