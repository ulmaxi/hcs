import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from '@ulmax/server-shared';
import { IsDefined } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * datastructure for review, which doctors do on
 * admitted patients
 */
@Entity()
export class Review implements BaseModel {
    /**
     * the uniqueId for each ward review
     */
    @IsDefined()
    @PrimaryGeneratedColumn('uuid')
    @ApiModelPropertyOptional()
    id: string;

    /**
     * the consulation TrackId for continuation
     */
    @IsDefined()
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    consulationTrackId: string;

    /**
     * the id of the staff who did the consultation
     */
    @IsDefined()
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    staffId: string;

    /**
     * the Id for the admission since the review is done inside the ward
     */
    @IsDefined()
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    admissionId: string;

    /**
     * the department which the consultaion was done
     */
    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty()
    department: string;

    /**
     * a note on the patient apart from the consultation.
     */
    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty()
    note: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
