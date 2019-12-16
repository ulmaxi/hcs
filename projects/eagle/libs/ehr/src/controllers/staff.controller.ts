import { Controller } from '@nestjs/common';
import { StaffService } from '../services/staff.service';
import { Crud } from '@nestjsx/crud';
import { Staff } from '../models/staff.entity';

@Crud({
  model: {
    type: Staff,
  },
})
@Controller('staff')
export class StaffController {
  constructor(public service: StaffService) {}
}
