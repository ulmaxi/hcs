import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '@eagle/server-shared';
import { IsDefined, IsOptional } from 'class-validator';
import { hcsIdentifer } from './indentier.decorator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

/** Access level for operations across the whole system */
export enum AccessLevel {
  Users = 0,
  Staff = 1,
  Institution = 2,
  SuperAdmin = 3,
}

/**
 * Entity for the storage of Authorization Logins
 */
@Entity()
export class Authorization extends BaseModel {
  @IsDefined()
  @Column({ type: 'integer', enum: AccessLevel })
  @ApiModelProperty()
  accessLevel: AccessLevel;

  @IsOptional()
  @ApiModelPropertyOptional()
  @Column({ type: 'varchar', unique: true, length: 244, nullable: true })
  apiKey: string;

  @IsOptional()
  @ApiModelPropertyOptional()
  @Column({ type: 'varchar', unique: true, length: 244, nullable: true })
  institutionId: string;

  @hcsIdentifer()
  @ApiModelProperty()
  @Column({ type: 'varchar', unique: true, update: false, length: 244, nullable: false })
  identification: string;

  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  trackId: string;
}
