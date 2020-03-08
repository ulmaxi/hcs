import { Test } from '@nestjs/testing';
import { AuthorizedEventService } from './authorized-events.service';

xdescribe('AuthorizedEventService', () => {
  let svc: AuthorizedEventService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthorizedEventService],
    }).compile();

    svc = module.get<AuthorizedEventService>(AuthorizedEventService);
  });
});
