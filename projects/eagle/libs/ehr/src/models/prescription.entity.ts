import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from '@eagle/server-shared';
import { IsDefined } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

/**
 * the prescription structural representation
 */
@Entity()
export class Prescription extends BaseModel {
    /**
     * the unique id store for each prescription
     * which is stored in the consulations prescriptions list.
     */
    @ApiModelPropertyOptional()
    @PrimaryGeneratedColumn()
    id: string;

    /**
     * the name of the prescription itself.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column('varchar')
    name: string;

    /**
     * the dosage of the prescription.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column('varchar')
    dosage: string;

    /**
     * the timing of the prescription.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column('varchar')
    time: string;
}
