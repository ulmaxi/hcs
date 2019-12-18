import * as Factory from 'factory.ts';
import * as Chance from 'chance';
import { Institution, Staff, Admission, Consultation, LabTest, Prescription, Review } from '@eagle/ehr';

const chance = new Chance();

export const admissionFactory = Factory.Sync.makeFactory<Admission>({
    consulationTrackId: Factory.each(() => chance.address()),
    createdAt: Factory.each(() => chance.date()),
    id: Factory.each((i) => i.toString()),
    updatedAt: Factory.each(() => chance.date()),
    isDischarged: Factory.each(() => chance.bool()),
    patientId: Factory.each((i) => i.toString()),
    ward: Factory.each((i) => i.toString())
});

export const consultationFactory = Factory.Sync.makeFactory<Consultation>({
    id: Factory.each(() => chance.address()),
    updatedAt: Factory.each(() => chance.date()),
    createdAt: Factory.each(() => chance.date()),
    trackId: Factory.each((i) => i.toString()),
    patientId: Factory.each((i) => i.toString()),
    admissionId: Factory.each((i) => i.toString()),
    complain: Factory.each(() => chance.paragraph()),
    consultantId: Factory.each((i) => i.toString()), diagnosis: Factory.each(() => chance.paragraph()),
    institutionId: Factory.each((i) => i.toString()), labtests: Factory.each((i) => [i.toString(), (i + 1).toString()]),
    planAndProcedure: Factory.each(() => chance.paragraph()),
    prescriptions: Factory.each((i) => [i.toString(), (i + 1).toString()]),
});

export const institutionFactory = Factory.Sync.makeFactory<Institution>({
    id: Factory.each((i) => i.toString()),
    updatedAt: Factory.each(() => chance.date()),
    createdAt: Factory.each(() => chance.date()),
    trackId: Factory.each((i) => i.toString()),
    name: Factory.each((i) => chance.name()),
    address: Factory.each((i) => chance.address()),
    classification: Factory.each((i) => chance.shuffle(['hospital', 'pharmarcy'])[0]),
    country: Factory.each((i) => chance.country()),
    customcare: Factory.each((i) => chance.phone()),
    lga: Factory.each((i) => chance.province()),
    setting: Factory.each((i) => chance.shuffle(['private', 'public'])[0]),
    state: Factory.each((i) => chance.state()),
    town: Factory.each((i) => chance.city()),
    website: Factory.each((i) => chance.domain()),
});

export const labTestFactory = Factory.Sync.makeFactory<LabTest>({
    id: Factory.each((i) => i.toString()),
    updatedAt: Factory.each(() => chance.date()),
    createdAt: Factory.each(() => chance.date()),
    type: Factory.each(() => chance.sentence()),
    results: Factory.each(() => chance.paragraph()),
    images: []
});

export const prescriptionFactory = Factory.Sync.makeFactory<Prescription>({
    id: Factory.each((i) => i.toString()),
    updatedAt: Factory.each(() => chance.date()),
    createdAt: Factory.each(() => chance.date()),
    dosage: Factory.each(() => `${chance.integer()} ${chance.word()}`),
    time: Factory.each(() => chance.date().toISOString()),
    name: Factory.each(() => chance.name()),
});

export const reviewFactory = Factory.Sync.makeFactory<Review>({
    id: Factory.each((i) => i.toString()),
    updatedAt: Factory.each(() => chance.date()),
    createdAt: Factory.each(() => chance.date()),
    consulationTrackId: Factory.each((i) => i.toString()),
    consultantionId: Factory.each((i) => i.toString()),
    department: Factory.each((i) => chance.profession()),
    note: Factory.each((i) => chance.paragraph()),

});

export const staffFactory = Factory.Sync.makeFactory<Staff>({
    id: Factory.each((i) => i.toString()),
    updatedAt: Factory.each(() => chance.date()),
    createdAt: Factory.each(() => chance.date()),
    Institution: Factory.each((i) => i.toString()),
    department: Factory.each((i) => chance.profession()),
    trackID: Factory.each((i) => i.toString()),
    field: Factory.each((i) => chance.profession()),
});

