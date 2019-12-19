import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import { BaseModel } from '@eagle/server-shared';

/**
 * Entity for the various instutions
 */
@Entity()
export class Institution extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    @IsDefined()
    @ApiModelPropertyOptional()
    id: string;

    /**
     * the authentication tracking ID
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelPropertyOptional()
    trackId: string;

    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelProperty({ description: `The name of the health institution` })
    name: string;

    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelProperty({ description: `Address of the health institution` })
    address: string;

    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelProperty()
    town: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false })
    lga: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false })
    state: string;

    @IsDefined()
    @ApiModelProperty({ description: `The type of the health institution either private or public` })
    @Column({ type: 'varchar', nullable: false })
    setting: string;

    @IsDefined()
    @ApiModelProperty({ description: `The classification i.e hospital, clinic or pharmacy` })
    @Column({ type: 'varchar', nullable: false })
    classification: string;

    @IsOptional()
    @ApiModelPropertyOptional()
    @Column('varchar')
    website: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false })
    customcare: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({ type: 'varchar', nullable: false })
    country: string;
}
