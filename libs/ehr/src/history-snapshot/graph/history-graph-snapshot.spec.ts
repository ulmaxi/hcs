import { ehr_data_preload } from '@ulmax/testing';
import { FieldProcessorOperator } from '../subfields/field-processor';
import { FilterOptions, MiniConsultantDetails } from '../util';
import { HistoryGraphSnapshot, SubFieldMap } from './history-graph-snapshot';

function field2Map<T>(items: T[]) {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set((item as any).id, item);
  }
  return map;
}

describe('HistoryGraphSnapshot', () => {
  const db = ehr_data_preload(5);

  const fieldMaps: SubFieldMap = {
    admissions: field2Map(db.admissions),
    consultants: field2Map(db.consultants.map(c => ({ name: c.firstname, phoneNo: c.email, id: c.id } as MiniConsultantDetails))),
    institutions: field2Map(db.institutions),
    labtests: field2Map(db.labtests),
    prescriptions: field2Map(db.prescriptions),
  };

  const config: FilterOptions = { depth: 3, skip: 0 };
  it('should create an empty graph and a storesnapshot', () => {
    const operator = new FieldProcessorOperator(config);
    const historyGraph = new HistoryGraphSnapshot(operator, fieldMaps);
    expect(historyGraph.SnapshotedStore).toBeInstanceOf(Map);
    expect(historyGraph.graph).toHaveLength(0);
  });

  it('should create a graph which contains a trackingId', () => {
    const operator = new FieldProcessorOperator(config);
    db.consultantions.forEach((c) => operator.process(c));
    const historyGraph = new HistoryGraphSnapshot(operator, fieldMaps);
    // since the first consultation will set the trackId.
    const trackId = db.consultantions[0].trackId;
    const storedConsultations = db.consultantions.filter((c) => c.trackId === trackId);
    expect(historyGraph.SnapshotedStore.get(trackId).length).toEqual(storedConsultations.length);
  });
});
