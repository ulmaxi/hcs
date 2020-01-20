import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModel, List, Nullable } from '@ulmax/server-shared';
import { IsDefined, IsOptional } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * The lab test datastructure
 */
@Entity()
export class LabTest implements BaseModel {
  /**
   * the unique id store for each lab tests
   * which is stored in the consulations labtest list.
   */
  @PrimaryGeneratedColumn('uuid')
  @IsDefined()
  @ApiModelPropertyOptional()
  id: string;

  /**
   * the type of tests requested itself.
   */
  @IsDefined()
  @ApiModelProperty()
  @Column()
  type: string;

  /**
   * the results of the test requested.
   */
  @IsOptional()
  @ApiModelPropertyOptional()
  @Column()
  results: string;

  /**
   * an array of images incase the lab tests requires images.
   */
  @IsOptional()
  @ApiModelPropertyOptional()
  @Column('simple-array')
  images: Nullable<List<string>>;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
