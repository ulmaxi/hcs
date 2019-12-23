import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MedicalClaimService } from './medical-claim.service';
import { Authorized } from '@eagle/server-shared';
import { MedicalCarePlan } from '../util';
import { Authorization } from '@eagle/generated';

@Controller('medicalclaims')
export class MedicalClaimController {
    constructor(private claim: MedicalClaimService) { }

    /**
     * creates a new medicareplan
     */
    @Post('create')
    create(
        @Authorized() { identification }: Authorization,
        @Body() careplan: MedicalCarePlan,
    ) {
        return this.claim.createMedicarePlan(identification, careplan);
    }

    /**
     * continue by creating a new consultation
     * tracked by the ID
     */
    @Post('continue/:trackId')
    continue(
        @Authorized() { identification }: Authorization,
        @Param('trackId') trackId: string,
        @Body() careplan: MedicalCarePlan,
    ) {
        return this.claim.continueMedicarePlan(identification, trackId, careplan);
    }

}
