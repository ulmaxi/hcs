import { Consultation } from '../../data-layer/consultation/consultation.entity';
import { FilterOptions, FieldProcessorOperator } from './field-processor';

/**
 * Filters and select TrackedId for consultations
 * automatically called which filters the consultations
 */
export function filterOperator(
  config: FilterOptions,
  unProcessedConsultation: Consultation[],
) {
  const operator = new FieldProcessorOperator(config);
  for (const consultation of unProcessedConsultation) {
    operator.process(consultation);
    if (operator.trackIds.size === config.depth) {
      break;
    }
    operator.trackIds.add(consultation.trackId);
  }
  return operator;
}
