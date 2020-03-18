import { BaseCQREvent, ModelCQRActions } from './events';
import {
  FindOneOptions,
  DeepPartial,
  FindManyOptions,
  FindConditions,
} from 'typeorm';

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
 * type information for the CreateModelItem command
 */
export type CreateModelItem<T> = BaseCQREvent & { item: DeepPartial<T> };

/**
 * creates a custom class to update the model items
 */
const updateEventCommand = <T>(action: string) => {
  return class UpdateModelItem extends BaseCQREvent {
    constructor(public filter: string, public update: DeepPartial<T>) {
      super(action);
    }
  };
};

/**
 * type information for the update model command
 */
export type UpdateModelItem<T> = BaseCQREvent & {
  filter: string;
  update: DeepPartial<T>;
};

/**
 * creates a custom class to retrive single model items
 */
const retrieveEventQuery = <T>(action: string) => {
  return class RetriveEventQuery extends BaseCQREvent {
    constructor(public filter: FindOneOptions<T> | string) {
      super(action);
    }
  };
};

/**
 * type information for the retrieve model Query
 */
export type RetriveEventQuery<T> = BaseCQREvent & {
  filter: FindOneOptions<T> | string;
};

/**
 * creates a custom class to find various items with the filter
 */
const findEventQuery = <T>(action: string) => {
  return class FindEventQuery extends BaseCQREvent {
    constructor(
      public filter: FindConditions<T> | string[],
      public options: FindManyOptions<T> = {},
    ) {
      super(action);
    }
  };
};

/**
 * type information for the find query for models
 */
export type FindEventQuery<T> = BaseCQREvent & {
  filter: FindConditions<T> | string[];
  options: FindManyOptions<T>;
};

/**
 * creates a custom class delete item
 */
const removeEventCommand = <T>(action: string) => {
  return class DeleteEventQuery extends BaseCQREvent {
    constructor(public filter: Partial<T> | string) {
      super(action);
    }
  };
};

/**
 * type information to delete an item
 */
export type DeleteEventQuery<T> = BaseCQREvent & { filter: DeepPartial<T> };

/**
 * creates the command and queries for database Models
 */
export function modelCQREventFactory<T>({
  create,
  remove,
  retrieve,
  find,
  update,
}: ModelCQRActions) {
  return {
    CreateEventCommand: createEventCommand<T>(create),
    UpdateEventCommand: updateEventCommand<T>(update),
    RetriveEventQuery: retrieveEventQuery<T>(retrieve),
    FindEventQuery: findEventQuery<T>(find),
    DeleteEventQuery: removeEventCommand<T>(remove),
  };
}
