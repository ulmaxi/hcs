import { Consultation } from './consultation.entity';

describe('Consultation Model', () => {
  it('should intialize default fields', () => {
    const consultation = new Consultation();
    expect(consultation.prescriptions).toStrictEqual([]);
    expect(consultation.labtests).toStrictEqual([]);
  });
});
