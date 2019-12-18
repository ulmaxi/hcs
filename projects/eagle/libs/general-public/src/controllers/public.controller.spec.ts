import { Test } from '@nestjs/testing';
import { PublicAccessController } from './public.controller';
import { PublicDataService } from '../services/data.service';
import { empty } from 'rxjs';
import { emergencyFactory } from '@eagle/testing';
import { Institution } from '@eagle/ehr';

describe('PublicAccessController', () => {
    let controller: PublicAccessController;
    let pubDataSvc: PublicDataService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [PublicAccessController],
            providers: [{
                provide: PublicDataService, useValue: {
                    alertEmergency: jest.fn,
                    institutions: jest.fn,
                },
            }],
        }).compile();

        pubDataSvc = module.get<PublicDataService>(PublicDataService);
        controller = module.get<PublicAccessController>(PublicAccessController);
    });

    describe('institutions', () => {
        it('should call the institution method on PublicDataService', () => {
            const category = 'hospital';
            const institutionsSpy = spyOn(pubDataSvc, 'institutions')
                .and.returnValue(empty());
            controller.institutions(category);
            expect(institutionsSpy)
                .toHaveBeenCalledWith({ classification: category } as Partial<Institution>);
        });
    });

    describe('emergency alert', () => {
        it('should call the alertEmergency method on PublicDataService', () => {
            const emergency = emergencyFactory.build();
            const alertSpy = jest.spyOn(pubDataSvc, 'alertEmergency')
                .mockResolvedValueOnce(emergency as any);
            controller.emergencyAlert({ ...emergency, id: undefined });
            expect(alertSpy).toHaveBeenCalledWith({ ...emergency, id: undefined });
        });
    });

});
