import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization } from '@ulmax/authentication';
import { microServiceToken } from '@ulmax/server-shared';
import { PersonalBiodata } from '@ulmax/users-admininistration';
import { StaffService } from '../../data-layer/staff/staff.service';
import { MiniConsultantDetails } from '../util';

@Injectable()
export class PersonalDataSnaphotService {
  constructor(
      @Inject(microServiceToken) private client: ClientProxy,
      private staffSvc: StaffService,
  ) { }

  /**
   * retrieves a maps of consultant and their IDS
   */
  async consultants(ids: string[]) {
    const map = new Map<string, MiniConsultantDetails>();
    const consultants = await this.staffSvc.repository.findByIds(ids);
    const trackers = await consultants.map(s => s.trackID);
    const [authMap, biodataMap] = await Promise.all([
      this.authorization(trackers),
      this.personalBiodata(trackers),
    ]);
    for (const consultant of consultants) {
      const auth = authMap.get(consultant.trackID);
      const person = biodataMap.get(consultant.trackID);
      map.set(consultant.id, {
        id: consultant.id,
        phoneNo: auth,
        name: `${person.firstname} ${person.lastname}`,
        department: consultant.department,
        field: consultant.field,
      });
    }
    return map;
  }

  /**
   * retrieves the phoneNo of the person from their trackingId
   */
  private async authorization(cardNodes: string[]) {
    const map = new Map<string, string>();
    const res = await this.client
      .send<Authorization[]>('authorization', cardNodes)
      .toPromise();
    for (const author of res) {
      map.set(author.trackId, author.identification);
    }
    return map;
  }

  /**
   * retrieves personal biodatas with the cardNodes.
   */
  private async personalBiodata(cardNodes: string[]) {
    const res = await this.client
      .send<Array<PersonalBiodata & { id: string }>>('personal', cardNodes)
      .toPromise();
    const map = new Map<string, PersonalBiodata>();
    for (const person of res) {
      map.set(person.cardnode, person);
    }
    return map;
  }

}
