import { Controller } from '@nestjs/common';
import { PrescriptionService } from '../services/prescription.service';
import { Crud } from '@nestjsx/crud';
import { Prescription } from '../models/prescription.entity';

@Crud({
  model: {
    type: Prescription,
  },
})
@Controller('prescription')
export class PrescriptionController {
  constructor(public service: PrescriptionService) {}
}
