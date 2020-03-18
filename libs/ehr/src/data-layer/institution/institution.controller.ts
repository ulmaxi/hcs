import { Controller } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { Crud } from '@nestjsx/crud';
import { Institution } from './institution.entity';

@Crud({
  model: {
    type: Institution,
  },
})
@Controller('internal/data-layer/institution')
export class InstitutionController {
  constructor(public service: InstitutionService) {}
}
