import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { 
  BatchEventQuery, CreateModelItem, 
  CRQCrudEvent, DeleteEventQuery, 
  FindEventQuery, RetriveEventQuery, 
  UpdateModelItem 
} from './cqr-factory';
import { ModelCQRActions } from './events';

/**
 * base model CQRHandler for microservices crud
 */
export class BaseModelCQRHandler<T> {
  constructor(public actions: ModelCQRActions, public repo: Repository<T>) {}

  /**
   * saves the item
   */
  create({ item }: CreateModelItem<T>) {
    return this.repo.save(item);
  }

  /**
   * updates the item
   */
  update({ filter, update, statement }: UpdateModelItem<T>) {
    if (!statement) {
      return this.repo.update(filter as string, update);
    }
    return this.repo.createQueryBuilder()
      .update()
      .where(statement, filter as object)
      .set(update)
      .execute();
  }

  /**
   * retrieves the item
   */
  retrieve({ filter, statement }: RetriveEventQuery<T>) {
    if (!statement) {
      console.log(filter);
      return typeof filter === 'string'
        ? this.repo.findOne(filter)
        : this.repo.findOne({ where: filter, cache: false });
    }
    return this.repo.createQueryBuilder()
      .where(statement, filter as object)
      .getOne();
  }

  /**
   * finds the item
   */
  find({ filter, options, statement }: FindEventQuery<T>) {
    if (!statement) {
      if (Array.isArray(filter)) {
        return this.repo.findByIds(filter, options);
      }
      return this.repo.find({
        where: filter,
        ...options,
      });
    }
    return this.repo.createQueryBuilder()
      .where(statement, filter as object)
      .take(options.take)
      .skip(options.skip)
      .printSql()
      .getMany();
  }

  /**
   * removes the item
   */
  async remove({ filter, statement }: DeleteEventQuery<T>) {
    if (!statement) {
      return this.repo.remove(
        await this.repo.find({
          where: filter,
        }),
      );
    }
    return this.repo.createQueryBuilder()
      .delete()
      .where(statement, filter as object)
      .execute();
  }

  async batch({ events }: BatchEventQuery<T>) {
    const results = await Promise.all(
      events.map(({ action }) => this.executeAction(action) as any),
    );
    return results.reduce((prev, res, i) => {
      prev[events[i].storeKey] = res;
      return prev;
    }, {});
  }

  public executeAction(action: CRQCrudEvent<T>) {
    const { create, update, retrieve, remove } = this.actions;
    switch (action.action) {
      case create:
        return this.create(action as any);
      case update:
        return this.update(update as any);
      case retrieve:
        return this.retrieve(action as any);
      case remove:
        return this.remove(action as any);
      default:
        throw new BadRequestException(`${action.action} Bad ModelCQREvent`);
    }
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
    constructor(public repo: Repository<T>) {
      super(actions, repo);
    }
  };
  return ModelClass;
}
