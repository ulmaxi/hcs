import { UlmaxCard, UlmaxCardLevel } from '@ulmax/cardnode';
import * as Chance from 'chance';
import * as Factory from 'factory.ts';

const chance = new Chance();
const { Admin, Minor } = UlmaxCardLevel;

export const cardNodeFactory = Factory.Sync.makeFactory<UlmaxCard>({
  cardNo: Factory.each(() => chance.address()),
  level: Factory.each(() => chance.pickone([Admin, Minor])),
  createdAt: Factory.each(() => chance.date()),
  trackId: Factory.each(id => id.toString()),
  id: Factory.each(() => chance.address()),
  updatedAt: Factory.each(() => chance.date()),
});
