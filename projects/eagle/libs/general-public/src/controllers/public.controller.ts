import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { PublicDataService } from '../services/data.service';
import { Emergency } from '../models/emergency.entity';
import { Institution } from '@eagle/ehr';

@Controller('public')
export class PublicAccessController {
    constructor(private publicSvc: PublicDataService) { }

    /**
     * returns various institutions by classification
     */
    @Get('/:category')
    institutions(@Param('category') category: string,  @Query() filter: Partial<Institution> = {}) {
        return this.publicSvc.institutions({...filter, classification: category});
    }

    /**
     * creates an emergeny alert
     */
    @Post('/emergencyalert')
    emergencyAlert(@Body() emergency: Emergency) {
        return this.publicSvc.alertEmergency(emergency);
    }

}
