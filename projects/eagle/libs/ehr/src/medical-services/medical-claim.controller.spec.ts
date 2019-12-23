import { Test } from '@nestjs/testing';
import { MedicalClaimController } from './medical-claim.controller';
import { MedicalClaimService } from './medical-claim.service';
import { Authorization } from '@eagle/generated';

describe('MedicalClaimController', () => {
    let ctrl: MedicalClaimController;
    let svc: MedicalClaimService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [MedicalClaimController],
            providers: [
                {
                    provide: MedicalClaimService, useValue: {
                        createMedicarePlan: jest.fn().mockReturnValueOnce({}),
                        continueMedicarePlan: jest.fn().mockReturnValueOnce({}),
                    },
                },
            ],
        }).compile();

        svc = module.get<MedicalClaimService>(MedicalClaimService);
        ctrl = module.get<MedicalClaimController>(MedicalClaimController);
    });

    describe('create', () => {
        it('should have called MedicalClaimController create ', () => {
            const auth: Partial<Authorization> = {
                institutionId: 'random-id',
            };
            ctrl.create(auth as any, {} as any);
            expect(svc.createMedicarePlan)
                .toHaveBeenCalledWith(auth.identification, {});
        });
    });

    describe('continue', () => {
        it('should have called MedicalClaimController continue', () => {
            const auth: Partial<Authorization> = {
                institutionId: 'random-id',
            };
            const trackId = 'tracking-id';
            ctrl.continue(auth as any, trackId, {} as any);
            expect(svc.continueMedicarePlan)
                .toHaveBeenCalledWith(auth.identification, trackId, {});
        });
    });

});
