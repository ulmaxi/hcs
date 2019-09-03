import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization, KeyVerification } from '@eagle/generated';
import { AuthenticationMessage } from '../events';
import { microServiceToken } from '../util';

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
