import { ControllerConfig, EntityTestController, EntityTestProvider } from '@ulmax/testing';
import { ReferralController } from './referral.controller';
import { Referral } from './referral.entity';
import { ReferralService } from './referral.service';

const configs: ControllerConfig = { controller: ReferralController, provider: ReferralService };
describe('Referral Data-layer', () => {

  describe('ReferralService', () => {
    new EntityTestProvider({ provider: ReferralService, entity: Referral }).test();
  });

  describe('ReferralController', () => {
    new EntityTestController(configs).test();
  });
});
