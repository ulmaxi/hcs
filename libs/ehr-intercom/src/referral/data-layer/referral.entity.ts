import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '@ulmax/server-shared';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Referral implements BaseModel {
  @PrimaryGeneratedColumn('uuid')
  @ApiModelProperty()
  id: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
