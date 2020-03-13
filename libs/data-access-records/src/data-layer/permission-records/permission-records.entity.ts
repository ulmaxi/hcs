import { BaseModel } from '@ulmax/server-shared';
import { IsBoolean, IsDefined, IsNumber } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PermissionRecord implements BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column()
  institution: string;

  @IsDefined()
  @Column('date')
  expires: Date;

  @IsDefined()
  @IsNumber()
  @Column('int')
  code: number;

  @IsBoolean()
  @Column('boolean')
  authorized: boolean = false;

  @IsDefined()
  @Column()
  clientId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
