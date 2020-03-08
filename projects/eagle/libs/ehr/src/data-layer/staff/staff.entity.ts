import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from '@ulmax/server-shared';
import { Exclude } from 'class-transformer';
import { IsDefined } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Staff implements BaseModel {

  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  @ApiModelPropertyOptional()
  id: string;

  /**
   * the authenticaton tracking id
   */
  @IsDefined()
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  @ApiModelPropertyOptional()
  trackID: string;

  @IsDefined()
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'bool', nullable: false })
  @ApiModelPropertyOptional()
  revoked: boolean;

  @IsDefined()
  @ApiModelProperty({ description: `The field of the staff` })
  @Column({ nullable: false })
  field: string;

  @IsDefined()
  @ApiModelPropertyOptional({ description: `The department of the staff in the institution` })
  @Column({ nullable: false })
  department: string;

  @IsDefined()
  @ApiModelProperty({ description: `The unique id for the institution` })
  @Column({ nullable: false })
  institution: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
