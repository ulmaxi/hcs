import { CommunalData, PersonalBiodata } from '@ulmax/users-admininistration';
import * as Chance from 'chance';
import * as Factory from 'factory.ts';

const chance = new Chance();

export const personalBiodataFactory = Factory.Sync.makeFactory<PersonalBiodata>(
  {
    id: Factory.each(i => i.toString()),
    updatedAt: Factory.each(() => chance.date()),
    createdAt: Factory.each(() => chance.date()),
    address: Factory.each(() => chance.address()),
    dob: Factory.each(() => chance.date()),
    email: Factory.each(() => chance.email()),
    firstname: Factory.each(() => chance.name()),
    gender: Factory.each(() => chance.gender()),
    lastname: Factory.each(() => chance.name()),
    town: Factory.each(() => chance.city()),
    cardnode: Factory.each(i => i.toString()),
  },
);

export const communalBiodataFactory = Factory.Sync.makeFactory<CommunalData>({
  id: Factory.each(i => i.toString()),
  updatedAt: Factory.each(() => chance.date()),
  createdAt: Factory.each(() => chance.date()),
  employer: Factory.each(() => chance.company()),
  employerphoneNo: Factory.each(() => chance.phone()),
  lga: Factory.each(() => chance.state()),
  maritalstatus: Factory.each(() => chance.word({ length: 5 })),
  nextofkin: Factory.each(() => chance.name()),
  nextofkinphoneNo: Factory.each(() => chance.phone()),
  religion: Factory.each(() => chance.name()),
  state: Factory.each(() => chance.state()),
  cardnode: Factory.each(i => i.toString()),
});
