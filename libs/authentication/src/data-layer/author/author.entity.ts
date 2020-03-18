import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from '@ulmax/server-shared';
import { IsDefined, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessLevel } from './constants';
import { hcsIdentifer } from './indentier.decorator';

/**
 * Entity for the storage of Authorization Logins
 */
@Entity()
export class Authorization implements BaseModel {
  @IsDefined()
  // @Column({ type: 'integer', enum: AccessLevel })
  @Column({ type: 'int' })
  @ApiModelProperty()
  accessLevel: AccessLevel;

  @IsOptional()
  @ApiModelPropertyOptional()
  @Column({ unique: true, length: 244, nullable: true })
  apiKey: string;

  @IsOptional()
  @ApiModelPropertyOptional()
  @Column({ unique: true, length: 244, nullable: true })
  institutionId: string;

  @hcsIdentifer()
  @ApiModelProperty()
  @Column({ unique: true, update: false, length: 244, nullable: false })
  identification: string;

  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  trackId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
