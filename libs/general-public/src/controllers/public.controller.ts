import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Institution } from '@ulmax/ehr';
import { Emergency } from '../models/emergency.entity';
import { PublicDataService } from '../services/data.service';

@Controller('')
export class PublicAccessController {
  constructor(private publicSvc: PublicDataService) {}

  /**
   * returns various institutions by classification
   */
  @Get('institutions/:category')
  institutions(
    @Param('category') category: string,
    @Query() filter: Partial<Institution> = {},
  ) {
    return this.publicSvc.institutions({ ...filter, classification: category });
  }

  /**
   * creates an emergeny alert
   */
  @Post('/emergencyalert')
  emergencyAlert(@Body() emergency: Emergency) {
    return this.publicSvc.alertEmergency(emergency);
  }
}
