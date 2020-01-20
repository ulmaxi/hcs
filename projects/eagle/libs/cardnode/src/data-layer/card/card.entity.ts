import { BaseModel } from '@ulmax/frontend';
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

  @Column()
  @IsString()
  cardNo: string;

  @Column()
  @IsString()
  level: UlmaxCardLevel;

  @Column({ nullable: true })
  @IsOptional()
  trackId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

}
