import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Authorization } from '@ulmax/authentication';
import * as Chance from 'chance';
import { UlmaxCardService } from '../data-layer/card/card.service';
import { UlmaxCardLevel } from '../data-layer/card/constants';
import { CardCreatorService } from './card-creator.service';
import { CardMemberRequest } from './typecast';

/**
 * Responds to requests apart from management of card members
 */
@Injectable()
export class CardRequestService {
  constructor(
    private creator: CardCreatorService,
    private card: UlmaxCardService,
  ) {}

  /**
   * create a new card of an authorized person with his or her
   * personal and communal details
   */
  async createNewCard(
    authorization: Authorization,
    details: CardMemberRequest,
  ) {
    if (await this.alreadyRegistered(authorization.trackId)) {
      throw MatchedEstablishedIdentity;
    }
    details.identification = authorization.identification;
    return this.saveCardDetails(authorization.trackId, details);
  }

  /**
   * checks if the ulmax card had already being created for the user
   */
  private async alreadyRegistered(trackId?: string) {
    if (trackId) {
      return Boolean(await this.card.findOne({ trackId }));
    }
    return false;
  }

  /**
   * creates the card details
   */
  private saveCardDetails(
    trackId: string,
    { biodata, communaldata, identification }: CardMemberRequest,
  ) {
    return this.creator.saveMember({
      biodata,
      communaldata,
      identification,
      trackId,
      cardNo: this.generatedCardNo(),
      level: UlmaxCardLevel.Admin,
    });
  }

  /**
   * generates random codes for patient card
   */
  private generatedCardNo() {
    const code = new Chance().integer({
      min: 10000000000,
      max: 99999999999,
    });
    return `${code}`;
  }
}

/** Error thrown for established identity during request */
export const MatchedEstablishedIdentity = new UnauthorizedException(
  `Identity Matched an Establish Identity, can't process request [card-node]`,
);
