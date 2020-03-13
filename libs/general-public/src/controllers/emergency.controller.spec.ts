import { EntityTestController } from '@ulmax/testing';
import { EmergencyService } from '../services/emergency.service';
import { EmergencyController } from './emergency.controller';

describe('EmergencyController', () => {
  const testModule = new EntityTestController({
    controller: EmergencyController,
    provider: EmergencyService });
  testModule.test();
});
