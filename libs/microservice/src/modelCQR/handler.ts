import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { modelCQREventFactory, DeleteEventQuery, CreateModelItem, UpdateModelItem, RetriveEventQuery, FindEventQuery } from "./cqr-factory";
import { MessagePattern } from "@nestjs/microservices";
import { modelCQRActions, ModelCQRActions } from "./events";

/**
 * base model CQRHandler for microservices crud 
 */
@Injectable()
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
        return (typeof filter === 'string') ?
        this.repo.findOne(filter) :
        this.repo.findOne({ where: filter });
    }

    /**
     * finds the item
     */
    find({ filter, options }: FindEventQuery<T>) {
        return this.repo.find({
            where: filter,
            take: 1,
            ...options
        });
    }

    /**
     * removes the item
     */
    async remove({filter }: DeleteEventQuery<T>) {
        return this.repo.remove(await this.repo.find({
            where: filter
        }));
    }
}

/**
 * creates the CQR handler for all commands and queries
 * dynamically
 */
export function createModelCQRHandler<T>(actions: ModelCQRActions) {
    const ModelClass = class extends BaseModelCQRHandler<T> {}
    Object.entries(([method, action]) => {
        [method]
        const decorator = MessagePattern(action);
        decorator(ModelClass.prototype, method, null);
    })
    return ModelClass;
}