import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { microServiceToken } from '@ulmax/server-shared';
import { Authorization } from '../../data-layer/author/author.entity';

@Injectable()
export class AuthorizedEventService {
  constructor(@Inject(microServiceToken) private client: ClientProxy) {}

  public trigger(authorized: Authorization, registering = false) {}

  private cardNode(authorized: Authorization, registering: boolean) {}
}
