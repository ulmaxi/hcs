import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { CommunalData } from '../models/comunal-data.entity';
import { CommunalDataService } from '../services/communal-data.service';

@Crud({
  model: {
    type: CommunalData,
  },
})
@Controller('communal')
export class CommunalDataController {
  constructor(private service: CommunalDataService) {}
}
