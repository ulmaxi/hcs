import { microServiceToken } from '@eagle/server-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReferralService } from '../data-layer/referral.service';
import { ReferralAlertService } from './referral-alert.service';

@Injectable()
export class PatientReferralService {
  constructor(
    @Inject(microServiceToken) private client: ClientProxy,
    private alert: ReferralAlertService,
    private referal: ReferralService,
  ) {}

}
