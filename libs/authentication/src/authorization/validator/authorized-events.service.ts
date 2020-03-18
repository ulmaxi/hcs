import { Inject, Injectable } from '@nestjs/common';
import { Authorization } from '../../data-layer/author/author.entity';

@Injectable()
export class AuthorizedEventService {
  // constructor(@Inject(microServiceToken) private client: ClientProxy) {}
  constructor() {}

  public trigger(authorized: Authorization, registering = false) {}

  private cardNode(authorized: Authorization, registering: boolean) {}
}
