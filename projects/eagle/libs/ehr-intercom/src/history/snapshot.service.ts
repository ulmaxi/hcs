import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConsulationGraphSnaphot, Consultation, FilterOptions } from '@ulmax/ehr';
import { microServiceToken } from '@ulmax/server-shared';

@Injectable()
export class HistorySnaphotService {
  constructor(
    @Inject(microServiceToken) private client: ClientProxy,
  ) { }

  /**
   * retrieves the consultation through microservices
   */
  graph(
    query: Partial<Consultation>,
    config: Partial<FilterOptions>,
    ) {
    return this.client.send<ConsulationGraphSnaphot[]>('', {
      query, config,
    })
      .toPromise();
  }
}
