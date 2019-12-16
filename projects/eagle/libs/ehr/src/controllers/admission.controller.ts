import { Controller } from '@nestjs/common';
import { AdmissionService } from '../services/admission.service';
import { Crud } from '@nestjsx/crud';
import { Admission } from '../models/admission.entity';

@Crud({
  model: {
    type: Admission,
  },
})
@Controller('admission')
export class AdmissionController {
  constructor(public service: AdmissionService) {}
}
