import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindQueryParams } from '@ulmax/server-shared';
import { CardPrescriptionService } from './prescription.service';

@Controller(':cardNo/prescription')
export class MemberPrescriptionController {
  constructor(private prescription: CardPrescriptionService) {}

  /**
   * retrieves the patient prescriptions
   * given by consultants
   */
  @Get(':cardId')
  retrievePrescription(
    @Param('cardId') cardId: string,
    @Query() query: FindQueryParams,
  ) {
    return this.prescription.find(cardId, query);
  }
}
