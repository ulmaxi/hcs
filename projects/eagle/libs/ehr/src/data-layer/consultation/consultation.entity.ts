import { BaseModel, List } from '@eagle/server-shared';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

/**
 * the datastructure to represent patient cosultation
 */
@Entity()
export class Consultation extends BaseModel {
    /**
     * the unique id for each consutation which must be generated.
     */
    @IsDefined()
    @ApiModelPropertyOptional()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * a unique id create for the first consultation on an illness,
     * other consultations shares it and can track all consultaion
     * pertaning to that illness.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false, update: false })
    trackId: string;

    /**
     * the unique ID for the institutiton.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false, update: false })
    institutionId: string;

    /**
     * the unique ID for the attending consultant.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false, update: false })
    consultantId: string;

    /**
     * the unique Id to retrive the patients ID
     */
    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false, update: false })
    patientId: string;

    /**
     * The patients actual complains.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column('varchar')
    complain: string;

    /**
     * the consultant diagonis of the illness.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column('varchar')
    diagnosis: string;

    /**
     * the doctor's procedure for treatment.
     */
    @IsDefined()
    @ApiModelProperty()
    @Column('varchar' )
    planAndProcedure: string;

    /**
     * an array of unique ids for prescription for the consulation.
     * which is used for retrival
     */
    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', array: true })
    prescriptions: List<string>;

    /**
     * an array of unique ids for laboratory tests.
     * which is used for retrieval
     */
    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', array: true })
    labtests: List<string> = [];

    /**
     * a uniqueId used retrive the patient
     * admission in the health insitution
     * if it exist the patient is an in-patient
     */
    @IsDefined()
    @ApiModelPropertyOptional()
    @Column('varchar')
    admissionId: string;
}
