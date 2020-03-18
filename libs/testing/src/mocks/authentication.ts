import { AccessLevel, Authorization, Login } from '@ulmax/authentication';
import * as Chance from 'chance';
import * as Factory from 'factory.ts';
import * as uuid from 'uuid/v4';

const chance = new Chance();

export const authorizationFactory = Factory.Sync.makeFactory<Authorization>({
  accessLevel: Factory.each(() => AccessLevel.Institution),
  apiKey: Factory.each(() => uuid()),
  updatedAt: Factory.each(() => chance.date()),
  identification: Factory.each(() => chance.phone()),
  institutionId: Factory.each(i => i.toString()),
  trackId: Factory.each(i => i.toString()),
});

export const loginFactory = Factory.Sync.makeFactory<Login>({
  expires: Factory.each(() => AccessLevel.Institution),
  otp: Factory.each(() => chance.integer({ min: 10000, max: 90000 })),
  trackingId: Factory.each(i => i.toString()),
  id: Factory.each(i => i.toString()),
});
