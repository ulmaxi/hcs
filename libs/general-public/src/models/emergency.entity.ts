import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '@ulmax/server-shared';
import { IsDefined } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Emergency implements BaseModel {
  /**
   * primary uniqueId for each emergency case
   */
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  id?: string;

  /**
   * what's happening on ground and how bad
   */
  @Column()
  @IsDefined()
  @ApiModelProperty()
  assessment: string;

  /**
   * The time the accident occurred
   */
  @Column('date')
  @IsDefined()
  @ApiModelProperty()
  time: string;

  /**
   * location of where the emergency is
   */
  @Column()
  @IsDefined()
  @ApiModelProperty()
  address: string;

  /**
   * the phone No to contact someone at the emergency scene
   */
  @Column()
  @IsDefined()
  @ApiModelProperty()
  contact: string;

  /**
   * the hospital to respond to the emergency
   */
  @Column('varchar', {
    nullable: true,
})
  @IsDefined()
  @ApiModelProperty()
  hospital: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
