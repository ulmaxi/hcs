// tslint:disable: max-classes-per-file
import { FindManyOptions, FindConditions, ObjectLiteral } from 'typeorm';
import { omit } from 'lodash';
import { isArray } from 'util';
import * as Factory from 'factory.ts';
import * as uuid from 'uuid/v4';

export class RepoMock<Entity> {
    private db = new Map<string, Entity>();

    private checkConditions(query: ObjectLiteral, data: ObjectLiteral) {
        let matched = true;
        for (const [key, value] of Object.entries(query)) {
            if (value !== data[key]) {
                matched = false;
                break;
            }
        }
        return matched;
    }

    cleanFindManyOptions(query: FindManyOptions<Entity>) {
        return omit(query, [
            'skip', 'take',
            'select', 'where',
            'relations', 'join',
            'order', 'cache',
            'lock', 'loadRelationIds',
            'loadEagerRelations',
        ]) as FindConditions<Entity>;
    }

    async clear() {
        this.db.clear();
    }

    async count(conditions?: FindConditions<Entity>) {
        const [, count] = await this.findAndCount(conditions);
        return count;
    }

    async find(conditions?: FindConditions<Entity>) {
        const matched: Entity[] = [];
        for (const entity of this.db.values()) {
            if (this.checkConditions(conditions, entity)) {
                matched.push(entity);
            }
        }
        return matched;
    }

    async findAndCount(conditions?: FindConditions<Entity> | FindManyOptions<Entity>) {
        const found = await this.find(this.cleanFindManyOptions(conditions));
        return [found, found.length];
    }

    async findOne(id?: string | number | Entity): Promise<Entity | undefined> {
        const query = (typeof id === 'object') ? id : { id } as any;
        const result = await this.find(query);
        return result[0];

    }

    async remove(entity: Entity | Entity[]) {
        if (isArray(entity)) {
            const entities = await Promise.all(entity.map(async (e) => this.findOne(e)));
            for (const value of entities) {
                this.db.delete((value as any).id);
            }
            return entities;
        }
        const e = await this.findOne(entity);
        this.db.delete((e as any).id);
        return [e];
    }

    async save(entity: Entity) {
        const id = (entity as any)?.id ?? uuid();
        const saved = { ...entity, id};
        this.db.set(id, saved);
        return saved;
    }

}

export class TypeService<Entity> {
    public repository = new RepoMock<Entity>();

    find(conditions?: FindConditions<Entity>) {
        return this.repository.find(conditions);
    }

    findOne(id?: string | number | Entity) {
        return this.repository.findOne(id);
    }
}

export interface ServiceFactoryMock<T> {
    preload?: number;
    factory: Factory.Sync.Factory<T, keyof T>;
}

export function serviceFactoryMock<T>(config: ServiceFactoryMock<T>) {
    const mock =  new TypeService<T>();
    if (typeof config.preload === 'number') {
        config.factory.buildList(config.preload, { } as any)
            .forEach(async (b) => await mock.repository.save(b));
    }
    return  mock;
}
