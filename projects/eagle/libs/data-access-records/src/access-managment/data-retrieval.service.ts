import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization } from '@ulmax/authentication';
import { microServiceToken } from '@ulmax/server-shared';
import { PersonalBiodata } from '@ulmax/users-admininistration';

@Injectable()
export class DataRetrievalService {
  constructor(
    @Inject(microServiceToken) private readonly client: ClientProxy,
  ) {}

  retrieve<C, T>(command: C, query: Partial<T>) {
    return this.client.send<T, Partial<T>>(command, query).toPromise();
  }

  retrieveInstitution(institution: Partial<{ name: string; trackId: string }>) {
    return this.retrieve({ name }, institution);
  }

  retrieveAuth(author: Partial<Authorization>) {
    return this.retrieve({ name }, author);
  }

  retrievePersonalBiodata(biodata: Partial<PersonalBiodata>) {
    return this.retrieve({ name }, biodata);
  }
}
