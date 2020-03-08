// tslint:disable: ban-types
import { Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelEventActionStructure } from './util';

/**
 * abstraction over crud activties to send the
 * queries through RPC without much bloated code
 */
@Injectable()
export class ModelMicroService {
  constructor() {}
  private store = new Map<string, Repository<any>>();

  /**
   * registers the model on the actions
   */
  register(model: Function, repo: Repository<any>) {
    this.store.set(model.toString(), repo);
  }

  /**
   * executes the actions remotely
   */
  execute({ args, method, model }: ModelEventActionStructure) {
    const repo = this.store.get(getRepositoryToken(model));
    return (repo[method] as FunctionConstructor).call(repo, args);
  }
}
