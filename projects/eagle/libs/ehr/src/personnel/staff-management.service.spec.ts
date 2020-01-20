import { UnprocessableEntityException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { serviceFactoryMock, staffFactory } from '@ulmax/testing';
import { StaffService } from '../data-layer/staff/staff.service';
import { noStaffWithPhoneNoError, PersonnelService } from './personel.service';
import { staffAlreadyRegisteredError, StaffManagmentService, staffNeverRegisteredError } from './staff-management.service';

describe('StaffManagmentService', () => {
    let svc: StaffManagmentService;
    let personel: PersonnelService;
    let staff: StaffService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StaffManagmentService,
                {
                    provide: PersonnelService,
                    useValue: { retriveStaffID: jest.fn, retriveTrackIdWithPhoneNo: jest.fn },
                },
                {
                    provide: StaffService,
                    useValue: serviceFactoryMock({ factory: staffFactory }),
                },
            ],
        }).compile();

        svc = module.get<StaffManagmentService>(StaffManagmentService);
        personel = module.get<PersonnelService>(PersonnelService);
        staff = module.get<StaffService>(StaffService);
    });

    describe('register', () => {
        const staffDetails = {
            staffPhoneNo: '444234324', department: 'department',
            field: 'field', institution: 'institution',
        };
        it('should throw error that the Staff has already Registered', async () => {
            const mockStaff = staffFactory.build();
            jest.spyOn(personel, 'retriveTrackIdWithPhoneNo')
                .mockResolvedValueOnce('random-tracking-id');
            mockStaff.revoked = false;
            jest.spyOn(staff, 'findOne').mockResolvedValue(mockStaff);
            try {
                await svc.register('institution', staffDetails);
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntityException);
            }
        });

        it('should register the staff the staff successfully', async () => {
            const { staffPhoneNo, ...details } = staffDetails;
            const mockStaff = staffFactory.build();
            jest.spyOn(personel, 'retriveTrackIdWithPhoneNo')
                .mockResolvedValueOnce('random-tracking-id');
            jest.spyOn(staff.repository, 'save').mockResolvedValue({ ...mockStaff, ...details });
            expect(await svc.register('institution', staffDetails)).toStrictEqual({ ...mockStaff, ...details });
        });
    });

    describe('revoke', () => {
        const staffDetails = {
            staffPhoneNo: '444234324',
            department: 'department',
            field: 'field',
            institution: 'institution',
        };
        it('should throw noStaffWithPhoneNoError', async () => {
            const { staffPhoneNo } = staffDetails;
            try {
                jest.spyOn(personel, 'retriveTrackIdWithPhoneNo')
                    .mockResolvedValueOnce('random-tracking-id');
                jest.spyOn(staff, 'findOne').mockResolvedValue(null);
                await svc.revoke('insititution', staffPhoneNo);
                fail(new Error('staff was successfuly revoked instead of failing'));
            } catch (error) {
                expect(error.message.message).toMatch(noStaffWithPhoneNoError(staffPhoneNo).message.message);
            }
        });

        it('should revoke the staff successfully', async () => {
            const mockStaff = staffFactory.build();
            jest.spyOn(personel, 'retriveTrackIdWithPhoneNo')
                .mockResolvedValueOnce('random-tracking-id');
            jest.spyOn(staff, 'findOne').mockResolvedValue(mockStaff);
            expect(await svc.revoke('insititution', staffDetails.staffPhoneNo))
                .toStrictEqual({ ...mockStaff, revoked: true });
        });
    });

});

describe('Error factories', () => {
    describe('staffAlreadyRegisteredError', () => {
        it('should contain the phoneNo sent', () => {
            const phone = '13831031';
            expect(staffAlreadyRegisteredError(phone).message.message).toContain(phone);
        });
    });

    describe('staffNeverRegisteredError', () => {
        it('should contain the phoneNo sent', () => {
            const phone = '13831031';
            expect(staffNeverRegisteredError(phone).message.message).toContain(phone);
        });
    });
});
