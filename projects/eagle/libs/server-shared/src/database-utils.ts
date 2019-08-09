import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNumber } from 'class-validator';

/**
 * the base model which all model must extend and be derived from
 */
@Entity()
export class BaseModel {
  /**
   * time which the model was created originally
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * the last time it was updated by
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
