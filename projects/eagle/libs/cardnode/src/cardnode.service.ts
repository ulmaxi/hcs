import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UlmaxCardLevel } from './data-layer/card/card.entity';
import { UlmaxCardService } from './data-layer/card/card.service';
import { CardCreatorService } from './management/card-creator.service';
import { CardFieldRetrivalService } from './management/card-field-retrival.service';
import { CardMemberRequest } from './typecast';

@Injectable()
export class CardMemberService {
  constructor(
    private cardSvc: UlmaxCardService,
    private creator: CardCreatorService,
    private retrival: CardFieldRetrivalService,
  ) {}
  public addMember(cardNo: string, req: CardMemberRequest) {
    return req.identification
      ? this.creator.addPrincipal(cardNo, req)
      : this.creator.saveMember({
          ...req,
          cardNo,
        });
  }

  /**
   * retrieves a list of people who belong to the same card
   */
  public members(cardNo: string) {
    return this.cardSvc.find({ cardNo });
  }

  /**
   * removes the cardId
   */
  public async removeMember(trackId: string, cardIdToRemove: string) {
    const card = await this.cardSvc.findOne({
      trackId,
      level: UlmaxCardLevel.Admin,
    });
    const cardToDelete = await this.cardSvc.findOne(cardIdToRemove);
    if (card && cardToDelete) {
      if (card.cardNo === cardToDelete.cardNo) {
        return this.cardSvc.repository.remove(cardToDelete).then(d => true);
      }
      throw cardOperationUnAuthorized;
    }
    throw cardNotFoundError;
  }

  /**
   * gets the card with the trackId available for principal
   */
  public async cardFromTrackId(trackId: string) {
    const card = await this.cardSvc.findOne({ trackId });
    if (card) {
      return this.retrival.detailed(card);
    }
    throw cardNotFoundError;
  }
}

/**
 * error throw when card is not found
 */
export const cardNotFoundError = new BadRequestException(
  `card requested not found [cardnode]`,
);

export const cardOperationUnAuthorized = new UnauthorizedException(
  `you can't process on the card requested  [cardnode]`,
);