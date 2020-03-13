import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { microServiceToken } from '@ulmax/server-shared';

@Injectable()
export class ReferralAlertService {
  constructor(
    @Inject(microServiceToken) private client: ClientProxy,
  ) { }

  sent() {

  }

  private sms() {

  }

  private email() {

  }

}
