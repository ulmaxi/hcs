import { Injectable } from '@nestjs/common';
import { PermissionRecord } from '@eagle/data-access-records';
import { PersonalBiodataService } from './person-biodata.service';
import { CommunalDataService } from './communal-data.service';
import { PersonalBiodata } from '../models/personal-biodata.entity';
import { CommunalData } from '../models/comunal-data.entity';

/**
 * service responsible for retrieval and update of user information by health institutions.
 */
@Injectable()
export class InstitutionUserAdminstrationService {
  constructor(
    private personalSvc: PersonalBiodataService,
    private communalSvc: CommunalDataService,
  ) {}

  async retrievePermission() {
    return {} as PermissionRecord;
  }

  /**`
   * Retrieves a person personal details.
   */
  PersonalDataRetrival(userTrackingId: string) {
    return this.personalSvc.findOne({ where: { trackId: userTrackingId } });
  }

  /**
   * updates a person's personal details.
   */
  async PersonalDataUpdate(
    userTrackingId: string,
    data: Partial<PersonalBiodata>,
  ) {
    const person = await this.PersonalDataRetrival(userTrackingId);
    return this.personalSvc.repository.save({
      ...person,
      ...data,
      trackId: userTrackingId,
    });
  }

  /**
   * retrieves a persons communal details.
   */
  communalDataRetrival(userTrackingId: string) {
    return this.communalSvc.findOne({ where: { trackId: userTrackingId } });
  }

  /**
   * updates a personal communal details.
   */
  async communalDataUpdate(
    userTrackingId: string,
    data: Partial<CommunalData>,
  ) {
    const communalData = await this.communalDataRetrival(userTrackingId);
    return this.communalSvc.repository.save({
      ...communalData,
      ...data,
      trackId: userTrackingId,
    });
  }
}