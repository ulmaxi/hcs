import { Body, Controller, Get, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CommunalData } from '../models/comunal-data.entity';
import { PersonalBiodata } from '../models/personal-biodata.entity';
import { PersonalAdminstrationService } from '../services/personal-administration.service';

@Controller('internal/data-layer/biodata')
export class PersonalAdminController {
  constructor(private pas: PersonalAdminstrationService) {}

  @Get('personal')
  retrievePersonal() {
    return this.pas.PersonalDataRetrival(null);
  }

  @Post('personal')
  updatePersonal(@Body() data: Partial<PersonalBiodata>) {
    return this.pas.PersonalDataUpdate(
      null,
      plainToClass(PersonalBiodata, data),
    );
  }

  @Get('communal')
  retrieveCommunal() {
    return this.pas.communalDataRetrival(null);
  }

  @Post('communal')
  updateCommunal(@Body() data: Partial<CommunalData>) {
    return this.pas.communalDataUpdate(null, plainToClass(CommunalData, data));
  }
}
