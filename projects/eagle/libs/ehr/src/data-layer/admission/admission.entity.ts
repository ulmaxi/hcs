import { BaseModel } from '@eagle/server-shared';
import { IsDefined, IsBoolean  } from 'class-validator';
import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';

/**
 * the data structure for patient admission
 */
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
    @Column({ type: 'varchar', nullable: false, update: false })
    @ApiModelProperty()
    patientId: string;

    /**
     * the name of the ward which the patient is admitted
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelProperty()
    ward: string;

    /**
     * the uniueId to track consultations
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false, update: false })
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
