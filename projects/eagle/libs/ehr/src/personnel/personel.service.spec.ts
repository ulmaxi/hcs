import { Test, TestingModule } from '@nestjs/testing';
import { microServiceToken } from '@eagle/server-shared';
import { ClientProxy } from '@nestjs/microservices';
import { PersonnelService, noStaffWithPhoneNoError, noPersonnelError } from './personel.service';
import { StaffService } from '../data-layer/staff/staff.service';
import { staffFactory, serviceFactoryMock } from '@eagle/testing';
import { of } from 'rxjs';

describe('PersonnelService', () => {
    let svc: PersonnelService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                PersonnelService,
                { provide: StaffService, useValue: serviceFactoryMock({ factory: staffFactory, preload: 5 }) },
                { provide: microServiceToken, useValue: { send: jest.fn, emit: jest.fn } },
            ],
        }).compile();

        svc = module.get<PersonnelService>(PersonnelService);
    });


    describe('retriveStaffID', () => {
        const institutions = 'institutions';
        const staffPhoneNo = '0908384394';
        it('should throw noStaffWithPhoneNoError', async () => {
            try {
                jest.spyOn(svc, 'retriveTrackIdWithPhoneNo').mockResolvedValueOnce('track-id');
                const _ = await svc.retriveStaffID(institutions, staffPhoneNo);
            } catch (error) {
                expect(error.message.message)
                    .toMatch(noStaffWithPhoneNoError(staffPhoneNo).message.message);
            }
        });

        it('should return the staff id', async () => {
            const staffSvc = module.get<StaffService>(StaffService);
            const staff = staffFactory.build();
            jest.spyOn(svc, 'retriveTrackIdWithPhoneNo').mockResolvedValueOnce('track-id');
            jest.spyOn(staffSvc, 'findOne').mockResolvedValueOnce(staff);
            expect(await svc.retriveStaffID(institutions, staffPhoneNo)).toMatch(staff.id);

        });
    });

    describe('retriveTrackIdWithPhoneNo', () => {
        it('should throw formated noPersonnelError', async () => {
            const microSvc = module.get<ClientProxy>(microServiceToken);
            const phoneNo = '08123334478';
            try {
                jest.spyOn(microSvc, 'send').mockImplementationOnce(() => of(null));
                await svc.retriveTrackIdWithPhoneNo(phoneNo);
            } catch (error) {
                expect(error.toString()).toStrictEqual(noPersonnelError(phoneNo).toString());
            }
        });

        it('should return the trackId of the personnel', async () => {
            const microSvc = module.get<ClientProxy>(microServiceToken);
            const phoneNo = '08123334478';
            const trackId = 'random-tracker';
            jest.spyOn(microSvc, 'send').mockImplementationOnce(() => of({ trackId }));
            expect(await svc.retriveTrackIdWithPhoneNo(phoneNo)).toMatch(trackId);

        });
    });

});

describe('Error factories', () => {
    describe('noStaffWithPhoneNoError', () => {
        it('should contain the phoneNo sent', () => {
            const phone = '13831031';
            expect(noStaffWithPhoneNoError(phone).toString()).toMatch(phone);
        });
    });

    describe('noPersonnelError', () => {
        it('should contain the phoneNo sent', () => {
            const phone = '13831031';
            expect(noStaffWithPhoneNoError(phone).toString()).toMatch(phone);
        });
    });
});
