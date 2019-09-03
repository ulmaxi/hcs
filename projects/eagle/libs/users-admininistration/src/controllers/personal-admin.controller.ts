import { Controller, Get, Body, Post } from '@nestjs/common';
import { PersonalAdminstrationService } from '../services/personal-administration.service';
import { PersonalBiodata } from '../models/personal-biodata.entity';
import { CommunalData } from '../models/comunal-data.entity';

@Controller('biodata')
export class PersonalAdminController {
  constructor(private pas: PersonalAdminstrationService) {}

  @Get('personal')
  retrievePersonal() {
    return this.pas.PersonalDataRetrival(null);
  }

  @Post('personal')
  updatePersonal(@Body() data: Partial<PersonalBiodata>) {
    return this.pas.PersonalDataUpdate(null, PersonalBiodata.fromJSON(data));
  }

  @Get('communal')
  retrieveCommunal() {
    return this.pas.communalDataRetrival(null);
  }

  @Post('communal')
  updateCommunal(@Body() data: Partial<CommunalData>) {
    return this.pas.communalDataUpdate(null, CommunalData.fromJSON(data));
  }
}
