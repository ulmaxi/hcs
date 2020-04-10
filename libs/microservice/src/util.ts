import { Repository } from 'typeorm';
import { map } from 'rxjs/operators';
import { BatchEventQuery, BatchEventResult, CRQCrudEvent } from './modelCQR';

/**
 * actions for microservices module
 */
export enum MicroServiceAction {
  CrudRPC,
}

/**
 * the keys availabe for operation for models through microservice
 */
export type ModelEventActionAllowed<T> = keyof Pick<
  Repository<T> | any,
  'find | findOne | count | save | findAndCount | remove |save'
>;

export interface ModelEventActionStructure {
  // tslint:disable-next-line: ban-types
  model: Function;
  method: string;
  args: any[];
}

// tslint:disable-next-line: ban-types
export type RPCModel = Function;

/**
 * creates an action-model RPC for microservices crud
 */
export default function ModelEventAction<T>(model: RPCModel) {
  return (method: ModelEventActionAllowed<T>, ...args) => {
    return {
      model,
      method,
      args,
    } as ModelEventActionStructure;
  };
}
