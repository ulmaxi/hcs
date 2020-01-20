import { BaseModel } from '@ulmax/server-shared';
import { IsOptional, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * The level on the ulmax card
 */
export enum UlmaxCardLevel {
  Admin = 'principal',
  Minor = 'Minor',
}

@Entity()
export class UlmaxCard implements BaseModel {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * the cardNo to retrive the record
   */
  @Column()
  @IsString()
  cardNo: string;

  /**
   * privelegde over the cardNo
   */
  @Column()
  @IsString()
  level: UlmaxCardLevel;

  /**
   * TrackingId for principal users
   */
  @Column({ nullable: true })
  @IsOptional()
  trackId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

}
