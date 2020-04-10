import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { BaseCQREvent, ModelCQRActions } from './events';

/**
 * type information for the CreateModelItem command
 */
export type CreateModelItem<T> = BaseCQREvent & { item: DeepPartial<T> };

/**
 * creates a custom class to create the model items
 */
const createEventCommand = <T>(action: string) => {
  return class CreateModelItem extends BaseCQREvent {
    constructor(public item: DeepPartial<T>) {
      super(action);
    }
  };
};

/**
 * type information for the update model command
 */
export type UpdateModelItem<T> = BaseCQREvent & {
  filter: string | object;
  update: DeepPartial<T>;
  statement?: string;
};

/**
 * creates a custom class to update the model items
 */
const updateEventCommand = <T>(action: string) => {
  return class UpdateModelItem extends BaseCQREvent {
    constructor(
      public filter: string | object,
      public update: DeepPartial<T>,
      public statement?: string,
    ) {
      super(action);
    }
  };
};

/**
 * type information for the retrieve model Query
 */
export type RetriveEventQuery<T> = BaseCQREvent & {
  filter: FindOneOptions<T> | string | object;
  statement?: string;
};

/**
 * creates a custom class to retrive single model items
 */
const retrieveEventQuery = <T>(action: string) => {
  return class RetriveEventQuery extends BaseCQREvent {
    constructor(
      public filter: FindOneOptions<T> | string | object,
      public statement?: string,
    ) {
      super(action);
    }
  };
};

/**
 * type information for the find query for models
 */
export type FindEventQuery<T> = BaseCQREvent & {
  filter: FindConditions<T> | string[] | object;
  options: FindManyOptions<T>;
  statement?: string;
};

/**
 * creates a custom class to find various items with the filter
 */
const findEventQuery = <T>(action: string) => {
  return class FindEventQuery extends BaseCQREvent {
    constructor(
      public filter: FindConditions<T> | string[] | object,
      public options: FindManyOptions<T> = {},
      public statement?: string,
    ) {
      super(action);
    }
  };
};

/**
 * type information to delete an item
 */
export type DeleteEventQuery<T> = BaseCQREvent & {
  filter: string | DeepPartial<T> | object;
  statement?: string;
};

/**
 * creates a custom class delete item
 */
const removeEventCommand = <T>(action: string) => {
  return class DeleteEventQuery extends BaseCQREvent {
    constructor(public filter: Partial<T> | string | object, public statement?: string) {
      super(action);
    }
  };
};

/**
 * all crudCQR Event Type
 */
export type CRQCrudEvent<T> =
  | CreateModelItem<T>
  | UpdateModelItem<T>
  | RetriveEventQuery<T>
  | FindEventQuery<T>
  | DeleteEventQuery<T>;

/**
 * Retrival Mapping from a crud batch action
 */
export type RetrieveFromBatch<T> = {
  action: CRQCrudEvent<T>;
  storeKey: string;
};

/**
 * type information for batch information
 */
export type BatchEventQuery<T> = BaseCQREvent & {
  events: RetrieveFromBatch<T>[];
};

export type BatchEventResult<T> = Record<string, T | T[] | UpdateResult>;

/**
 * creates a custom class to find various items with the filter
 */
const batchEventCommand = <T>(action: string) => {
  return class BatchEventQuery extends BaseCQREvent {
    constructor(public events: RetrieveFromBatch<T>[]) {
      super(action);
    }
  };
};

/**
 * creates the command and queries for database Models
 */
export function modelCQREventFactory<T>({
  create,
  remove,
  retrieve,
  find,
  update,
  batch,
}: ModelCQRActions) {
  return {
    CreateEventCommand: createEventCommand<T>(create),
    UpdateEventCommand: updateEventCommand<T>(update),
    RetriveEventQuery: retrieveEventQuery<T>(retrieve),
    FindEventQuery: findEventQuery<T>(find),
    DeleteEventQuery: removeEventCommand<T>(remove),
    BatchEventQuery: batchEventCommand<T>(batch),
  };
}
