import { FilterOptions } from '@eagle/ehr';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HistorySnaphotService } from './snapshot.service';

export const defaultFilterOptions: FilterOptions = {
  depth: 1,
  skip: 0,
};

@Controller('medicalhistory')
export class HistoryController {
  constructor(private snapshot: HistorySnaphotService) { }

  /**
   * returns the consultation history for clients
   */
  @Post('client/:clientId')
  client(
    @Param('clientId') patientId: string,
    @Query() query: Partial<FilterOptions>,
  ) {
    return this.snapshot.graph(
      { patientId },
      { ...defaultFilterOptions, ...query },
    );
  }

  /**
   * returns the consultation history for consultant
   */
  @Get('consultant/:consultantId')
  consultant(
    @Param('consultantId') consultantId: string,
    @Query() query: Partial<FilterOptions>,
  ) {
    return this.snapshot.graph(
      { consultantId },
      { ...defaultFilterOptions, ...query },
    );
  }

}
