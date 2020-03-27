import { Repository } from 'typeorm';
import {
  DeleteEventQuery,
  CreateModelItem,
  UpdateModelItem,
  RetriveEventQuery,
  FindEventQuery,
} from './cqr-factory';
import { ModelCQRActions } from './events';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';

/**
 * base model CQRHandler for microservices crud
 */
export class BaseModelCQRHandler<T> {
  constructor(public repo: Repository<T>) {}

  /**
   * saves the item
   */
  create({ item }: CreateModelItem<T>) {
    return this.repo.save(item);
  }

  /**
   * updates the item
   */
  update({ filter, update }: UpdateModelItem<T>) {
    return this.repo.update(filter, update);
  }

  /**
   * retrieves the item
   */
  retrieve({ filter }: RetriveEventQuery<T>) {
    return typeof filter === 'string'
      ? this.repo.findOne(filter)
      : this.repo.findOne({ where: filter });
  }

  /**
   * finds the item
   */
  find({ filter, options }: FindEventQuery<T>) {
    if (Array.isArray(filter)) {
      return this.repo.findByIds(filter, options);
    }
    return this.repo.find({
      where: filter,
      ...options,
    });
  }

  /**
   * removes the item
   */
  async remove({ filter }: DeleteEventQuery<T>) {
    return this.repo.remove(
      await this.repo.find({
        where: filter,
      }),
    );
  }
}

/**
 * creates the CQR handler for all commands and queries
 * dynamically
 */
export function createModelCQRHandler<T>(
  model: string,
  actions: ModelCQRActions,
) {
  // tslint:disable-next-line: max-classes-per-file
  const ModelClass = class extends BaseModelCQRHandler<T> {
    public actions = actions;
    constructor(public repo: Repository<T>) {
      super(repo);
    }
  };
  /**
   * registers the decorator on the methods has it's loading
   */
  Object.entries(actions).forEach(baseMap => {
    const [method, action] = baseMap;
    Reflect.defineMetadata(
      PATTERN_METADATA,
      `${model}:${action}`,
      ModelClass.prototype,
      method,
    );
  });
  return ModelClass;
}
