import { BaseModel } from '@eagle/server-shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * the data structure for patient admission
 */
@Entity()
export class Admission extends BaseModel {
    /**
     * the uniqueID for each admission
     */
    @IsDefined()
    @PrimaryGeneratedColumn('uuid')
    @ApiModelPropertyOptional()
    id: string;

    /**
     * the uniqueId for the patientId
     */
    @IsDefined()
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    patientId: string;

    /**
     * the name of the ward which the patient is admitted
     */
    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty()
    ward: string;

    /**
     * the uniueId to track consultations
     */
    @IsDefined()
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    consulationTrackId: string;

    /**
     * checks if the patient is discharged
     */
    @IsBoolean()
    @Column('boolean')
    @ApiModelProperty()
    isDischarged: boolean;
}
