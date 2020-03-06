import { Controller } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Crud } from '@nestjsx/crud';
import { Staff } from './staff.entity';

@Crud({
  model: {
    type: Staff,
  },
})
@Controller('staff')
export class StaffController {
  constructor(public service: StaffService) {}
}
