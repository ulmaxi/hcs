import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { UlmaxCard } from './card.entity';
import { UlmaxCardService } from './card.service';

@Crud({
  model: {
    type: UlmaxCard,
  },
})
@Controller('internal/data-layer/ulmaxcard')
export class UlmaxCardController {
  constructor(public service: UlmaxCardService) {}
}
