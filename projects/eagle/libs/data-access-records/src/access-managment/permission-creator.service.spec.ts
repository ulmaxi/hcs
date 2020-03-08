import { Test, TestingModule } from '@nestjs/testing';
import { AccessLevel, Authorization } from '@ulmax/authentication';
import { microServiceToken } from '@ulmax/server-shared';
import { RepoMock } from '@ulmax/testing';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';
import { PermissionCreatorService } from './permission-creator.service';

const today = new Date();

const authorBase: Authorization = {
  accessLevel: AccessLevel.Institution,
  apiKey: 'random-apikey',
  identification: 'institution@mail.com',
  trackId: 'institution-trackId',
  institutionId: 'instution-id',
};

const institutionBase: { trackId: string; name: string } = {
  trackId: 'institution-trackId',
  name: 'institution',
};

const mockPermSvc = {
  find: jest.fn,
  findOne: jest.fn,
  repository: new RepoMock(),
};

const clientMock = {
  emit: jest.fn(),
  send: jest.fn(),
};

xdescribe('PermissionCreatorService', () => {
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [
        PermissionCreatorService,
        { provide: PermissionRecordService, useValue: mockPermSvc },
        { provide: microServiceToken, useValue: clientMock },
      ],
    }).compile();
  });

});

// TODO: i rewrite the test due to changing of the implementation
// and but not now  due to dependency on Microservice events
function createTest(app: TestingModule) {
  // describe('create', () => {
  //   it('should throw permission Request Detail Error for invalid datas', async () => {
  //     try {
  //       jest
  //         .spyOn(transportSvc, 'retrieveInstitution')
  //         .mockResolvedValue(institutionBase);
  //       jest.spyOn(transportSvc, 'retrieveAuth').mockResolvedValue(null);
  //       jest.spyOn(svc, 'retrieveBiodata').mockResolvedValue(null);
  //       await svc.create(institutionBase.trackId, authorBase.identification);
  //     } catch (error) {
  //       expect(error).toEqual(permissionRequestDetailError);
  //     }
  //   });

  //   it('should call saveAndAlertRequest with the argument ', async () => {
  //     const otpAddr: OTPAddress = {
  //       clientName: `${clientBase.firstname} ${clientBase.lastname}`,
  //       clientPhoneNo: authorBase.identification,
  //       institutionId: institutionBase.trackId,
  //       institutionName: institutionBase.name,
  //     };
  //     jest
  //       .spyOn(transportSvc, 'retrieveInstitution')
  //       .mockResolvedValue(institutionBase);
  //     jest.spyOn(transportSvc, 'retrieveAuth').mockResolvedValue(authorBase);
  //     jest.spyOn(svc, 'retrieveBiodata').mockResolvedValue(clientBase);
  //     const retrieveSpy = jest.spyOn(svc as any, 'saveAndAlertRequest');
  //     await svc.create(institutionBase.trackId, authorBase.identification);
  //     expect(retrieveSpy).toHaveBeenCalledWith(otpAddr);
  //   });
  // });
}
