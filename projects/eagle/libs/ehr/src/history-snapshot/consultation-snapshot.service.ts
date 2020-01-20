import { Injectable } from '@nestjs/common';
import { BaseModel } from '@ulmax/server-shared';
import { format } from 'date-fns';
import { Consultation } from '../data-layer/consultation/consultation.entity';
import { ConsultationService } from '../data-layer/consultation/consultation.service';
import { HistoryGraphSnapshot } from './graph/history-graph-snapshot';
import { filterOperator } from './subfields/field-operator';
import { FieldProcessorOperator } from './subfields/field-processor';
import { FieldSnaphotService } from './subfields/fields-snapshot.service';
import { PersonalDataSnaphotService } from './subfields/personal-data.service';
import { FilterOptions } from './util';

/**
 * get all the consultations first with the query
 * sort them from the most recent
 * TODO:// -process_1 = filter the consultations by consultationTrackId
 * select the amount paginated for using the consultationTrackId
 * collate all the Id for other Ehr records and retrieve a map of them sorted
 * attach every consultation to their child EHR records
 * TODO:// -process_2 group consutations with their ID to Map<consultationTrackId, Sorted(Consultation[])>
 * take the previously -process_1 sorted consultationTrackId mapped,
 * has key to retrive the values of the previous map to an object
 * the first child has main, the others as followup
 */

@Injectable()
export class ConsultationShapshotService {
  constructor(
    private fieldSnap: FieldSnaphotService,
    private personnalSnap: PersonalDataSnaphotService,
    private svc: ConsultationService,
  ) { }

  /**
   * retrieves a history graph with all the subfields
   * for the query
   */
  async retrieve(
    query: Partial<Consultation>,
    config: FilterOptions,
  ) {
    const consultations = await this.svc.find(query);
    const metadatas = filterOperator(config, this.sortModelToRecently(consultations));
    const subFieldMaps = await this.collateSubFieldDatas(metadatas);
    const historyShot = new HistoryGraphSnapshot(metadatas, subFieldMaps);
    return historyShot.graph;
  }

  /**
   * destructures the parallelized request.
   */
  private async collateSubFieldDatas(metadatas: FieldProcessorOperator) {
    const [
      institutions, consultants, prescriptions, labtests, admissions,
    ] = await this.parallelizeFieldSnapshot(metadatas);
    return { admissions, consultants, institutions, labtests, prescriptions };
  }

  /**
   * retrieves all the subfields in parallel
   */
  private async parallelizeFieldSnapshot(metadatas: FieldProcessorOperator) {
    const all = await Promise.all([
      this.fieldSnap.institutions(Array.from(metadatas.institutionIds)),
      this.personnalSnap.consultants(Array.from(metadatas.consultantIds)),
      this.fieldSnap.prescriptions(Array.from(metadatas.prescriptionIds)),
      this.fieldSnap.labtests(Array.from(metadatas.prescriptionIds)),
      this.fieldSnap.admissions(Array.from(metadatas.admissionIds)),
    ]);
    return all;
  }

  /**
   * sorts the models from the most recent
   */
  private sortModelToRecently<T extends BaseModel>(items: T[]) {
    return items.sort((a, b) => Number(format(b.createdAt, 'x')) - Number(format(a.createdAt, 'x')));
  }

}
