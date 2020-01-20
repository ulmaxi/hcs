import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AccessLevel, Authorization } from '@ulmax/authentication';
import { microServiceToken } from '@ulmax/server-shared';
import { CommunalData, PersonalBiodata } from '@ulmax/users-admininistration';
import { combineLatest } from 'rxjs';
import { UlmaxCardLevel } from '../data-layer/card/card.entity';
import { UlmaxCardService } from '../data-layer/card/card.service';
import { CardMemberRequest, UlmaxFullCard } from '../typecast';

interface MemberRequest extends CardMemberRequest {
  cardNo: string;
  trackId?: string;
  level?: UlmaxCardLevel;
}

@Injectable()
export class CardCreatorService {
  constructor(
    private cardSvc: UlmaxCardService,
    @Inject(microServiceToken) private client: ClientProxy,
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
    return this.client.send<Authorization>('', {
      identification,
      accessLevel: AccessLevel.Users,
    } as Partial<Authorization>);
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
    const personal$ = this.client.send<PersonalBiodata>('', req.biodata);
    const communal$ = this.client.send<CommunalData>('', req.communaldata);
    return combineLatest(personal$, communal$);
  }
}
