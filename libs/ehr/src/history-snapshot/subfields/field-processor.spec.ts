import { consultationFactory } from '@ulmax/testing';
import { FieldProcessorOperator } from './field-processor';

describe('FieldProcessorOperator', () => {
  it('should process and update the required fields', () => {
    const processor = new FieldProcessorOperator({ depth: 2, skip: 0 });
    const consultation = consultationFactory.build();
    processor.process(consultation);
    expect(processor.trackIds.has(consultation.trackId)).toEqual(true);
    expect(processor.consultations.has(consultation)).toEqual(true);
  });

  it('should skip 8 and only process and update two', () => {
    const processor = new FieldProcessorOperator({ depth: 100, skip: 8 });
    const consultations = consultationFactory.buildList(10);
    for (const consultation of consultations) {
      processor.process(consultation);
    }
    expect(processor.trackIds.size).toEqual(2);
  });
});
