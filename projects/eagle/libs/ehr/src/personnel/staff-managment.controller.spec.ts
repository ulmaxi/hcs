import { Test } from '@nestjs/testing';
import { PersonelController } from './staff-managment.controller';
import { StaffManagmentService } from './staff-management.service';
import { Authorization } from '@eagle/generated';
import { RegisterStaffDetails } from './register-staff';

describe('PersonelController', () => {
    const auth = { trackId: 'trackId' } as any;
    const staffDetails = { staffPhoneNo: 'phoneNo' } as any;
    let ctrl: PersonelController;
    let svc: StaffManagmentService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [PersonelController],
            providers: [
                {
                    provide: StaffManagmentService, useValue: {
                        register: jest.fn().mockReturnValue(null),
                        revoke: jest.fn().mockReturnValue(null),
                    },
                },
            ],
        }).compile();

        svc = module.get<StaffManagmentService>(StaffManagmentService);
        ctrl = module.get<PersonelController>(PersonelController);
    });

    describe('register', () => {
        it('should call StaffManagmentService register', () => {
            ctrl.register(auth, staffDetails);
            expect(svc.register).toHaveBeenCalledWith(auth.trackId, staffDetails);
        });
    });

    describe('revoke', () => {
        it('should call StaffManagmentService revoke', () => {
            ctrl.revoke(auth, staffDetails);
            expect(svc.revoke).toHaveBeenCalledWith(auth.trackId, staffDetails.staffPhoneNo);
        });
    });

});
