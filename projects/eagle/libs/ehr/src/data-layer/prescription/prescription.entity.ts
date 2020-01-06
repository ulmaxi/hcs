import { BaseModel } from '@eagle/server-shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    @Column()
    name: string;

    /**
     * the dosage of the prescription.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column()
    dosage: string;

    /**
     * the timing of the prescription.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column()
    time: string;
}
