import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Institution } from '@ulmax/ehr';
import { plainToClass } from 'class-transformer';
import { omit } from 'lodash';
import { Emergency } from '../models/emergency.entity';
import { EmergencyService } from './emergency.service';
import { EmergencyResponse } from './typecast';
import { MicroService } from '@ulmax/microservice/shared';
import { InstitutionCQREvents } from '@ulmax/ehr/data-layer/institution/institution.cqr';

@Injectable()
export class PublicDataService {
  constructor(
    @Inject(MicroService.EHR) private readonly ehr: ClientProxy,
    private emergency: EmergencyService,
  ) {}

  /**
   * retrives institution of any category
   */
  institutions(query: Partial<Institution>) {
    if (!query.classification) {
      throw InstitutionClassificationError;
    }
    const req = new InstitutionCQREvents.RetriveEventQuery({ where: query });
    return this.ehr.send<Institution[]>(req.action, req);
  }

  /**
   * gets the institution's details by searching with it's name
   */
  institutionDetailsFromName(name: string) {
    const req = new InstitutionCQREvents.RetriveEventQuery({ where: { name } });
    return this.ehr.send<Institution>(req.action, req);
  }

  /**
   * saves and send an emergency dispatch to the instituion to be informed
   */
  async alertEmergency(incomingEmergency: Emergency) {
    const emergency = plainToClass(Emergency, incomingEmergency);
    const institution = await this.institutionDetailsFromName(
      emergency.hospital,
    ).toPromise();
    const savedEmergency = await this.emergency.repository.save({
      ...emergency,
      hospital: institution.id,
    });
    this.dispatchEmergency(institution, savedEmergency);
    return {
      emergency,
      institution: omit(institution, ['id', 'trackId', 'zipcode', 'country']),
    } as EmergencyResponse;
  }

  /**
   * through any channel i.e email, push notification
   * emits an event to notify the target istituitons
   */
  dispatchEmergency(institution: Institution, emergency: Emergency) {
    // this.client.emit('', emergency);
  }
}

/**
 * Error thrown when the institution classification is not provided
 */
export const InstitutionClassificationError = new Error(
  `Institution classification is required i.e hospital, clinic`,
);
