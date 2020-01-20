import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization } from '@ulmax/frontend';
import { microServiceToken } from '@ulmax/server-shared';

@Injectable()
export class AuthorizedEventService {
  constructor(@Inject(microServiceToken) private client: ClientProxy) {}

  public trigger(authorized: Authorization, registering = false) {}

  private cardNode(authorized: Authorization, registering: boolean) {}
}
