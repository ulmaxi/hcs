import { microServiceToken } from '@eagle/server-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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
