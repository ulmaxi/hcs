import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FindQueryParams } from '@ulmax/server-shared';
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
    @Param('category') classification: string,
    @Query() filter: FindQueryParams,
  ) {
    return this.publicSvc.institutions({ classification }, filter);
  }

  /**
   * creates an emergeny alert
   */
  @Post('/emergencyalert')
  emergencyAlert(@Body() emergency: Emergency) {
    return this.publicSvc.alertEmergency(emergency);
  }
}
