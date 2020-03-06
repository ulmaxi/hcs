import { Authorization, KeyVerification } from '@eagle/authentication';
import { AuthenticationMessage, microServiceToken } from '@eagle/server-shared';
import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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
