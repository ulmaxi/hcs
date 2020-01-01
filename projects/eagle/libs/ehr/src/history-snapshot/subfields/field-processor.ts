import { Consultation } from '../../data-layer/consultation/consultation.entity';

export interface FilterOptions {
  depth: number;
  skip: number;
}

/**
 * Filters and select TrackedId for consultations
 */
export class FieldProcessorOperator {
  // set advantage is that it doesn't allow duplicate datas
  trackIds = new Set<string>();
  consultantIds = new Set<string>();
  institutionIds = new Set<string>();
  // set is not really needed for the ones below
  labtestIds = new Set<string>();
  admissionIds = new Set<string>();
  prescriptionIds = new Set<string>();
  consultations = new Set<Consultation>();

  constructor(
    public config: FilterOptions,
  ) {}

  /**
   * checks if the consultation should be processed
   * for the consultation with a new trackedId or
   * paginate
   */
  private isUpdateAllowed(consultation: Consultation) {
    return this.config.skip
      && this.trackIds.size === (this.config.skip - 1)
      && !this.trackIds.has(consultation.trackId);
  }

  /**
   * updates if update is allowed and handles pagination issues
   */
  process(consultation: Consultation) {
    if (this.isUpdateAllowed(consultation)) {
      delete this.config.skip;
      this.trackIds.clear();
    } else {
      this.update(consultation);
      this.trackIds.add(consultation.trackId);
    }
  }

  /**
   * maps the consultation to the appropiate Sets.
   */
  private update(consultation: Consultation) {
    this.consultations.add(consultation);
    this.consultantIds.add(consultation.consultantId);
    this.institutionIds.add(consultation.institutionId);
    this.admissionIds.add(consultation.admissionId);
    (consultation.labtests ?? []).forEach((v) => this.labtestIds.add(v));
    (consultation.prescriptions ?? []).forEach((v) => this.prescriptionIds.add(v));
  }
}
