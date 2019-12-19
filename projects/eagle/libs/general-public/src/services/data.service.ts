import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmergencyService } from './emergency.service';
import { Emergency } from '../models/emergency.entity';
import { plainToClass } from 'class-transformer';
import * as assert from 'assert';
import { omit } from 'lodash';
import { microServiceToken } from '@eagle/server-shared';
import { Institution } from '@eagle/ehr';

/**
 * The response for emergency request by the public
 */
export interface EmergencyResponse {
    /**
     * saved emergency information
     */
    emergency: Emergency;
    /**
     * pit information about the instituion
     */
    institution: Omit<Institution, 'id' | 'trackId' | 'zipcode'>;
}

@Injectable()
export class PublicDataService {
    constructor(
        @Inject(microServiceToken) private readonly client: ClientProxy,
        private emergency: EmergencyService,
    ) { }

    /**
     * retrives institution of any category
     */
    institutions(query: Partial<Institution> ) {
        if (!query.classification) {
            throw InstitutionClassificationError;
        }
        return this.client.send<Institution[], Partial<Institution>>('', { ...query });
    }

    /**
     * gets the institution's details by searching with it's name
     */
    institutionDetailsFromName(name: string) {
        return this.client.send<Institution, Partial<Institution>>('', { name });
    }

    /**
     * saves and send an emergency dispatch to the instituion to be informed
     */
    async alertEmergency(incomingEmergency: Emergency) {
        const emergency = plainToClass(Emergency, incomingEmergency);
        const institution = await this.institutionDetailsFromName(emergency.hospital).toPromise();
        const savedEmergency = await this.emergency.repository.save({ ...emergency, hospital: institution.id });
        this.dispatchEmergency(institution, savedEmergency);
        return { emergency, institution: omit(institution, ['id', 'trackId', 'zipcode', 'country']) } as EmergencyResponse;
    }

    /**
     * through any channel i.e email, push notification
     * emits an event to notify the target istituitons
     */
    dispatchEmergency(institution: Institution, emergency: Emergency) {
        this.client.emit('', emergency);
    }
}

/**
 * Error thrown when the institution classification is not provided
 */
export const InstitutionClassificationError = new Error(`Institution classification is required i.e hospital, clinic`);