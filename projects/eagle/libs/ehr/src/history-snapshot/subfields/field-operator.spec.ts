import { filterOperator } from './field-operator';
import { consultationFactory } from '@eagle/testing';

describe('filterOperator', () => {
  it('should process all the consulations', () => {
    const operator = filterOperator({ depth: 5, skip: 0 },
      consultationFactory.buildList(4));
    expect(operator.consultations.size).toEqual(4);
  });

  it('should break if the out of the loop', () => {
    const operator = filterOperator({ depth: 5, skip: 0 },
      consultationFactory.buildList(8));
    expect(operator.consultations.size).toEqual(5);
  });
});
