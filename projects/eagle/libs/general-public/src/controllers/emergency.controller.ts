import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Emergency } from '../models/emergency.entity';
import { EmergencyService } from '../services/emergency.service';

@Crud({
  model: {
    type: Emergency,
  },
})
@Controller('emergency')
export class EmergencyController {
  constructor(public service: EmergencyService) {}
}
