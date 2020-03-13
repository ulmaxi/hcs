import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization, KeyVerification } from '@ulmax/authentication';
import { AuthenticationMessage, microServiceToken } from '@ulmax/server-shared';

@Injectable()
export class AuthorizedPipe
  implements PipeTransform<KeyVerification, Promise<Authorization>> {
  constructor(@Inject(microServiceToken) private client: ClientProxy) {}
  async transform(value: KeyVerification, { metatype }: ArgumentMetadata) {
    const user = await this.client
      .send<Authorization>(AuthenticationMessage.validate, value)
      .toPromise();
    return user;
  }
}
