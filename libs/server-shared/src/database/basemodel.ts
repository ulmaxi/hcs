import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

/**
 * the base model which all model must extend and be derived from
 */
@Entity()
export class BaseModel {
  /**
   * time which the model was created originally
   */
  @CreateDateColumn()
  createdAt?: Date;

  /**
   * the last time it was updated by
   */
  @UpdateDateColumn()
  updatedAt?: Date;
}

/**
 * filtered database generated fields from models
 */
export type UnsavedModel<T extends BaseModel> = Omit<T, 'createdAt' | 'updatedAt' | 'id'>;
