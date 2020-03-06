import { BaseModel } from '@eagle/server-shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff extends BaseModel {

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
}
