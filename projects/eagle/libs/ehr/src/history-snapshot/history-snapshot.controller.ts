import { Body, Controller, Post, Query } from '@nestjs/common';
import { Consultation } from '../data-layer/consultation/consultation.entity';
import { ConsultationShapshotService } from './consultation-snapshot.service';
import { FilterOptions, ReqMicroHistorySnapshot } from './util';

export const defaultFilterOptions: FilterOptions = {
  depth: 1,
  skip: 0,
};

@Controller('medicalhistory')
export class HistorySnapshotController {
  constructor(private snapshot: ConsultationShapshotService) { }

  /**
   * returns the consultation history for clients
   */
  @Post()
  query(
    @Body() query: Partial<Consultation>,
    @Query() options: Partial<FilterOptions>,
  ) {
    return this.snapshot.retrieve(
      query,
      { ...defaultFilterOptions, ...options },
    );
  }

  /**
   * returns the consultation history for consultant
   * through microservices
   */

  microQuery(
    req: ReqMicroHistorySnapshot,
  ) {
    return this.snapshot.retrieve(
      req.query,
      { ...defaultFilterOptions, ...req.config },
    );
  }

}
