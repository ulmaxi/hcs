import * as Factory from 'factory.ts';
import * as Chance from 'chance';
import { format } from 'date-fns';
import { Emergency } from '@eagle/general-public';

const chance = new Chance();

export const emergencyFactory = Factory.Sync.makeFactory<Emergency>({
    address: Factory.each(() => chance.address()),
    assessment: Factory.each(() => chance.paragraph()),
    contact: Factory.each(() => chance.phone()),
    createdAt: Factory.each(() => chance.date()),
    hospital: Factory.each((id) => id.toString()),
    id: Factory.each(() => chance.address()),
    time: Factory.each(() => format(chance.timestamp())),
    updatedAt: Factory.each(() => chance.date()),
});

