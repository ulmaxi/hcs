import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from '@ulmax/server-shared';
import { IsDefined, IsOptional } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entity for the various instutions
 */
@Entity()
export class Institution implements BaseModel {
    @PrimaryGeneratedColumn('uuid')
    @IsDefined()
    @ApiModelPropertyOptional()
    id: string;

    /**
     * the authentication tracking ID
     */
    @IsDefined()
    @Column({  nullable: false })
    @ApiModelPropertyOptional()
    trackId: string;

    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty({ description: `The name of the health institution` })
    name: string;

    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty({ description: `Address of the health institution` })
    address: string;

    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty()
    town: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({  nullable: false })
    lga: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({  nullable: false })
    state: string;

    @IsDefined()
    @ApiModelProperty({ description: `The type of the health institution either private or public` })
    @Column({  nullable: false })
    setting: string;

    @IsDefined()
    @ApiModelProperty({ description: `The classification i.e hospital, clinic or pharmacy` })
    @Column({  nullable: false })
    classification: string;

    @IsOptional()
    @ApiModelPropertyOptional()
    @Column()
    website: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({  nullable: false })
    customcare: string;

    @IsDefined()
    @ApiModelProperty()
    @Column({  nullable: false })
    country: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
