import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ModelMicroService } from './crud.service';
import { ModelEventActionStructure } from './util';

@Controller()
export class CrudMicroSerivceController {
  constructor(private svc: ModelMicroService) {}

  @MessagePattern()
  execute(query: ModelEventActionStructure) {
    return this.svc.execute(query);
  }
}
