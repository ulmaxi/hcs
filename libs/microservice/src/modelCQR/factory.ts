import { createModelCQRHandler } from "./handler";
import { modelCQREventFactory } from "./cqr-factory";
import { modelCQRActions } from "./events";

/* dynamically creates actions, modelClass and Events  */
export function createModelCQR(namespace: string, model: string) {
    const Actions = modelCQRActions(namespace, model);
    return {
        Actions,
        ModelClass: createModelCQRHandler(Actions),
        Events: modelCQREventFactory(Actions) 
    }
}