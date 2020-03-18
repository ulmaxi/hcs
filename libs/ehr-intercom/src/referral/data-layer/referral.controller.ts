import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Referral } from './referral.entity';
import { ReferralService } from './referral.service';

@Crud({
  model: {
    type: Referral,
  },
})
@Controller()
export class ReferralController {
  constructor(public service: ReferralService) {}
}
