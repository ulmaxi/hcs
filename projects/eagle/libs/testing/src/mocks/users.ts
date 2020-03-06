import * as Factory from 'factory.ts';
import * as Chance from 'chance';
import { format } from 'date-fns';
import { PersonalBiodata, CommunalData } from '@eagle/users-admininistration';

const chance = new Chance();

export const personalBiodataFactory = Factory.Sync.makeFactory<PersonalBiodata>({
  id: Factory.each((i) => i.toString()),
  updatedAt: Factory.each(() => chance.date()),
  createdAt: Factory.each(() => chance.date()),
  address: Factory.each(() => chance.address()),
  dob: Factory.each(() => Number(format(chance.date(), 'x'))),
  email: Factory.each(() => chance.email()),
  firstname: Factory.each(() => chance.name()),
  gender: Factory.each(() => chance.gender()),
  lastname: Factory.each(() => chance.name()),
  town: Factory.each(() => chance.city()),
  trackId: Factory.each((i) => i.toString()),
});

export const communalBiodataFactory = Factory.Sync.makeFactory<CommunalData>({
  id: Factory.each((i) => i.toString()),
  updatedAt: Factory.each(() => chance.date()),
  createdAt: Factory.each(() => chance.date()),
  employerAddress: Factory.each(() => chance.address()),
  employerphoneNo: Factory.each(() => chance.phone()),
  lgaorigin: Factory.each(() => chance.state()),
  maritalstatus: Factory.each(() => chance.word({ length: 5 })),
  nextofkin: Factory.each(() => chance.name()),
  nextofkinphoneNo: Factory.each(() => chance.phone()),
  religion: Factory.each(() => chance.name()),
  stateoforigin: Factory.each(() => chance.state()),
  trackId: Factory.each((i) => i.toString()),
});
