import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { PersonalBiodata } from '../models/personal-biodata.entity';
import { PersonalBiodataService } from '../services/person-biodata.service';

@Crud({
  model: {
    type: PersonalBiodata,
  },
})
@Controller('personal')
export class PersonalBiodataController {
  constructor(private service: PersonalBiodataService) {}
}
