import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization, AuthorizationCQREvents } from '@ulmax/authentication';
import {
  PersonalBiodata,
  PersonalBiodataCQREvents,
} from '@ulmax/users-admininistration';
import { StaffService } from '../../data-layer/staff/staff.service';
import { MiniConsultantDetails } from '../util';
import { MicroService } from '@ulmax/microservice/shared';

@Injectable()
export class PersonalDataSnaphotService {
  constructor(
    @Inject(MicroService.Authorization) private auth: ClientProxy,
    @Inject(MicroService.CardNode) private cardnode: ClientProxy,
    private staffSvc: StaffService,
  ) {}

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
    const authReq = new AuthorizationCQREvents.FindEventQuery(cardNodes);
    const res = await this.auth
      .send<Authorization[]>(authReq.action, authReq)
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
    const personalReq = new PersonalBiodataCQREvents.FindEventQuery(cardNodes);
    const res = await this.cardnode
      .send<Array<PersonalBiodata & { id: string }>>(
        personalReq.action,
        personalReq,
      )
      .toPromise();
    const map = new Map<string, PersonalBiodata>();
    for (const person of res) {
      map.set(person.cardnode, person);
    }
    return map;
  }
}
