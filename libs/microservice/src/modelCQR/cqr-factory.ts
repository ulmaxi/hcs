import { UnsavedModel } from '@ulmax/server-shared';
import { BaseCQREvent, modelCQRActions, ModelCQRActions } from './events';
import { FindOneOptions, DeepPartial, FindManyOptions } from 'typeorm';

/**
 * creates a custom class to create the model items
 */
const createEventCommand = (action: string) => {
    return class CreateModelItem<T> extends BaseCQREvent {
         constructor(public item: DeepPartial<T>) {
             super(action);
        }
    }
}

/**
 * type information for the CreateModelItem command
 */
export type CreateModelItem<T> = BaseCQREvent & { item: DeepPartial<T> };

const a: CreateModelItem<{name: string}> = {
    action: '',
    id: '',
    item: {}
}

/**
 * creates a custom class to update the model items
 */
const updateEventCommand = (action: string) => {
    return class UpdateModelItem<T> extends BaseCQREvent {
        constructor(public filter: string, public update: DeepPartial<T>) {
            super(action);
        }
    }
}

/**
 * type information for the update model command
 */
export type UpdateModelItem<T> =  BaseCQREvent & {filter: string, update: DeepPartial<T>}

/**
 * creates a custom class to retrive single model items
 */
const retrieveEventQuery = (action: string) => {
    return class RetriveEventQuery<T> extends BaseCQREvent {
        constructor(public filter: FindOneOptions<T> | string) {
            super(action);
        }
    }
}

/**
 * type information for the retrieve model Query
 */
export type RetriveEventQuery<T> = BaseCQREvent & { filter: FindOneOptions<T> | string };

/**
 * creates a custom class to find various items with the filter
 */
const findEventQuery = (action: string) => {
    return class FindEventQuery<T> extends BaseCQREvent {
        constructor(public filter: Partial<T>, public options: FindManyOptions<T>) {
            super(action);
        }
    }
}

/**
 * type information for the find query for models
 */
export type FindEventQuery<T> = BaseCQREvent & { filter: Partial<T>, options: FindManyOptions<T>};

/**
 * creates a custom class delete item
 */
const removeEventCommand = (action: string) => {
    return class DeleteEventQuery<T> extends BaseCQREvent {
        constructor(public filter: Partial<T> | string) {
            super(action);
        }
    }
}

/**
 * type information to delete an item
 */
export type DeleteEventQuery<T> = BaseCQREvent & { filter: DeepPartial<T> };

/**
 * creates the command and queries for database Models
 */
export function modelCQREventFactory({  create, remove, retrieve, find, update }: ModelCQRActions) {
    return {
        CreateEventCommand: createEventCommand(create),
        UpdateEventCommand: updateEventCommand(update),
        RetriveEventQuery: retrieveEventQuery(retrieve),
        FindEventQuery: findEventQuery(find),
        DeleteEventQuery: removeEventCommand(remove)
    }
}