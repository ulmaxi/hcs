import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AccessLevel,
  Authorization,
  AuthorizationCQREvents,
} from '@ulmax/authentication';
import { MicroService } from '@ulmax/microservice/shared';
import { UlmaxCard } from '../data-layer/card/card.entity';
import { UlmaxCardService } from '../data-layer/card/card.service';
import { UlmaxCardLevel } from '../data-layer/card/constants';
import { BiodataManagerService } from './biodata-manager.service';
import {
  CardMemberRequest,
  UlmaxFullCard,
} from './typecast';

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
    private bioSvc: BiodataManagerService,
    @Inject(MicroService.Authorization) private auth: ClientProxy,
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
    this.validateCardRequest(req);
    const card = await this.cardSvc.repository.save({
      cardNo: req.cardNo,
      trackId: req.trackId,
      level: (req.identification) ? req.level : UlmaxCardLevel.Minor,
    });
    req.biodata.cardnode = card.id;
    req.communaldata.cardnode = card.id;
    return this.saveReqorError(card, req);
  }

  /**
   * updates the members details
   */
  public async updateMemberDetails(cardId: string, req: CardMemberRequest) {
    this.validateCardRequest(req);
    req.biodata.cardnode = cardId;
    req.communaldata.cardnode = cardId;
    const card = await this.cardSvc.findOne(cardId);
    return this.saveReqorError(card, req);
  }

  /**
   * saves the biodatas or remove the created
   * card due to errors
   */
  private async saveReqorError(
    card: UlmaxCard,
    req: CardMemberRequest,
  ): Promise<UlmaxFullCard> {
    const {
      communaldata,
      communalError,
      biodata,
      biodataError,
    } = await this.bioSvc.save(req);
    if (communalError || biodataError) {
      await this.deleteCard(card.id);
      throw new BadRequestException({ biodataError, communalError });
    }
    return { biodata, communaldata, card };
  }

  /**
   * deletes the saved card already
   */
  private async deleteCard(cardId: string) {
    const card = await this.cardSvc.findOne(cardId);
    return this.cardSvc.repository.remove(card);
  }

  /**
   * throws error is req is not well structured
   */
  private validateCardRequest({ biodata, communaldata }: CardMemberRequest) {
    if (!biodata && !communaldata) {
      throw BadCardRequestError;
    }
  }
}

/**
 * error thrown when the card requset information
 * isn't complete
 */
export const BadCardRequestError = new UnprocessableEntityException(
  `biodata and communal details are missing in the request`,
);
