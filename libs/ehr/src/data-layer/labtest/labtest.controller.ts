import { Controller } from '@nestjs/common';
import { LabTestService } from './labtest.service';
import { Crud } from '@nestjsx/crud';
import { LabTest } from './labtest.entity';

@Crud({
  model: {
    type: LabTest,
  },
})
@Controller('internal/data-layer/labtest')
export class LabTestController {
  constructor(public service: LabTestService) {}
}
