import { microServiceToken } from '@eagle/server-shared';
import { authorizationFactory } from '@eagle/testing';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { AuthorizedPipe } from './auth.pipe';

describe('AuthorizedPipe', () => {
  let svc: AuthorizedPipe;
  const authorization = authorizationFactory.build();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthorizedPipe,
        {
          provide: microServiceToken,
          useValue: {
            send: jest.fn().mockReturnValue(of(authorization)),
          },
        },
      ],
    }).compile();

    svc = module.get<AuthorizedPipe>(AuthorizedPipe);
  });

  it('should return the authorization', async () => {
    expect(await svc.transform({} as any, {} as any))
      .toStrictEqual(authorization);
  });

});
