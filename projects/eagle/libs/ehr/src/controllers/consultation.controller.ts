import { Controller } from '@nestjs/common';
import { ConsultationService } from '../services/consultation.service';
import { Crud } from '@nestjsx/crud';
import { Consultation } from '../models/consultation.entity';

@Crud({
  model: {
    type: Consultation,
  },
})
@Controller('consultation')
export class ConsultationController {
  constructor(public service: ConsultationService) {}
}
