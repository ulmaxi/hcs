import * as uuid from 'uuid/v4';

/**
 * The base interface and class that
 * all CQREvent must adhere to.
 */
export class BaseCQREvent {
  public readonly id: string;
  constructor(public readonly action: string) {
    this.id = uuid();
  }
}

/**
 * various unqiue action names for the modelCQRS
 */
export type ModelCQRActions = {
  create: string;
  update: string;
  remove: string;
  retrieve: string;
  find: string;
  batch: string;
};

/**
 * generates a set of action names for the model
 */
export const modelCQRActions = (namespace: string, model: string) =>
  ({
    create: `${namespace}.${model}-create-CQRAction`,
    update: `${namespace}.${model}-update-CQRAction`,
    retrieve: `${namespace}.${model}-retrive-CQRAction`,
    find: `${namespace}.${model}-find-CQRAction`,
    remove: `${namespace}.${model}-remove-CQRAction`,
    batch: `${namespace}.${model}-batch-CQRAction`,
  } as ModelCQRActions);
