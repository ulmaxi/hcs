import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AccessLevel,
  Authorization,
  AuthorizationCQREvents,
} from '@ulmax/authentication';
import {
  CommunalData,
  PersonalBiodata,
  PersonalBiodataCQREvents,
  CommunalDataCQREvents,
} from '@ulmax/users-admininistration';
import { combineLatest } from 'rxjs';
import { UlmaxCardService } from '../data-layer/card/card.service';
import { UlmaxCardLevel } from '../data-layer/card/constants';
import { CardMemberRequest, UlmaxFullCard } from './typecast';
import { MicroService } from '@ulmax/microservice/shared';

/**
 * inteface map for datas required for
 * parallel retrivals of the card member data
 */
interface MemberRequest extends CardMemberRequest {
  cardNo: string;
  trackId?: string;
  level?: UlmaxCardLevel;
}

@Injectable()
export class CardCreatorService {
  constructor(
    private cardSvc: UlmaxCardService,
    @Inject(MicroService.Authorization) private auth: ClientProxy,
    @Inject(MicroService.CardNode) private users: ClientProxy,
  ) {}

  /**
   * adds a new principal member to a card
   */
  public async addPrincipal(cardNo: string, req: CardMemberRequest) {
    const auth = await this.createAuthorization(req.identification).toPromise();
    return this.saveMember({
      cardNo,
      ...req,
      identification: auth.identification,
      level: UlmaxCardLevel.Admin,
    });
  }

  /**
   * sends an event to create the authorization
   */
  private createAuthorization(identification: string) {
    const authReq = new AuthorizationCQREvents.RetriveEventQuery({
      where: {
        identification,
        accessLevel: AccessLevel.Users,
      },
    });
    return this.auth.send<Authorization>(authReq.action, authReq);
  }

  /**
   * saves a new member's card
   */
  public async saveMember(req: MemberRequest) {
    const card = await this.cardSvc.repository.save({
      cardNo: req.cardNo,
      level: req.level || UlmaxCardLevel.Minor,
    });
    req.biodata.cardnode = card.id;
    req.communaldata.cardnode = card.id;
    const [biodata, communal] = await this.saveBiodataInParallel(
      req,
    ).toPromise();
    return { biodata, communaldata: communal, card } as UlmaxFullCard;
  }

  /**
   * saves both the communal and personal
   */
  private saveBiodataInParallel(req: MemberRequest) {
    const personal = new PersonalBiodataCQREvents.CreateEventCommand(
      req.biodata,
    );
    const communal = new CommunalDataCQREvents.CreateEventCommand(
      req.communaldata,
    );
    const personal$ = this.users.send<PersonalBiodata>(
      personal.action,
      personal,
    );
    const communal$ = this.users.send<CommunalData>(communal.action, communal);
    return combineLatest(personal$, communal$);
  }
}
