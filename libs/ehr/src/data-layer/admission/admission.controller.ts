import { Controller } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { Crud } from '@nestjsx/crud';
import { Admission } from './admission.entity';

@Crud({
  model: {
    type: Admission,
  },
})
@Controller('admission')
export class AdmissionController {
  constructor(public service: AdmissionService) {}
}
