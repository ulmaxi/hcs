import { Entity, Column, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { IAuthorization, AccessLevel } from '../../../generated';
import { BaseModel } from '@eagle/server-shared';
import { IsPhoneNumber, IsEmail, IsDefined, IsOptional } from 'class-validator';
import { hcsIdentifer } from './indentier.decorator';

/**
 * Entity for the storage of Authorization Logins
 */
@Entity()
export class Authorization extends BaseModel implements IAuthorization {
  @IsDefined()
  @Column({ type: 'integer', enum: AccessLevel })
  accessLevel: AccessLevel;

  @IsOptional()
  @Column({ type: 'varchar', unique: true, length: 244, nullable: true })
  apiKey: string;

  @hcsIdentifer()
  @Column({ type: 'varchar', unique: true, update: false, length: 244, nullable: false })
  identification: string;

  @PrimaryGeneratedColumn('uuid')
  trackId: string;
}
