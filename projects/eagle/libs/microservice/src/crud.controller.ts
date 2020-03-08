import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ModelMicroService } from './crud.service';
import { ModelEventActionStructure } from './util';

/**
 * Microservices RPC
 */
export const ModelRPC = `[MicroService]-Model-RPC`;

/**
 * Event dispatched by the RPC
 */
export type ModelRPCEvent = ModelEventActionStructure & {
  model: any;
};

@Controller()
export class CrudMicroSerivceController {
  constructor(private svc: ModelMicroService) {}

  @MessagePattern(ModelRPC)
  execute(query: ModelRPCEvent) {
    query.model = query.model.toString();
    return this.svc.execute(query);
  }
}
