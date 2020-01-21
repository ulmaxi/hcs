import { Repository } from 'typeorm';

/**
 * the keys availabe for operation for models through microservice
 */
export type ModelEventActionAllowed<T> = keyof Pick<
  Repository<T> | any,
  'find | findOne | count | save | findAndCount | remove |save'
>;

export interface ModelEventActionStructure {
  model: string;
  method: string;
  args: any[];
}

export interface RPCModel {
  name: string;
  toString(): string;
}

/**
 * creates an action-model RPC for microservices crud
 */
export function ModelEventAction<T>(model: RPCModel) {
  return (method: ModelEventActionAllowed<T>, ...args) => {
    return {
      model: model.toString(),
      method,
      args,
    } as ModelEventActionStructure;
  };
}
