import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel, List, Nullable } from '@eagle/server-shared';
import { IsDefined, IsOptional } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

/**
 * The lab test datastructure
 */
@Entity()
export class LabTest extends BaseModel {
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
    @Column('varchar')
    type: string;

    /**
     * the results of the test requested.
     */
    @IsOptional()
    @ApiModelPropertyOptional()
    @Column('varchar')
    results: string;

    /**
     * an array of images incase the lab tests requires images.
     */
    @IsOptional()
    @ApiModelPropertyOptional()
    @Column({ type: 'varchar', array: true })
    images: Nullable<List<string>>;
}
