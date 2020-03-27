import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Authorization, Authorized } from '@ulmax/authentication';
import { CardMemberService } from './cardnode.service';
import { CardMemberRequest } from './typecast';

@Controller('cards/:cardNo')
export class CardNodeController {
  constructor(private memberSvc: CardMemberService) {}

  /**
   * retrieves the list of card members
   */
  @Get('members')
  members(@Param('cardNo') cardNo: string) {
    return this.memberSvc.members(cardNo);
  }

  /**
   * route to add new member to the card
   */
  @Post('members')
  addMember(
    @Param('cardNo') cardNo: string,
    @Body() memberDetails: CardMemberRequest,
  ) {
    return this.memberSvc.addMember(cardNo, memberDetails);
  }

  /**
   * route to add update member information to the card
   */
  @Put('members/:cardId')
  updateMember(
    @Param('cardId') cardId: string,
    @Body() memberDetails: CardMemberRequest,
  ) {
    return this.memberSvc.updateMember(cardId, memberDetails);
  }

  /**
   * deletes a particular member from a card
   */
  @Delete('members/:cardIdToRemove')
  removeMember(@Authorized() auth: Authorization, cardIdToRemove: string) {
    return this.memberSvc.removeMember(auth.trackId, cardIdToRemove);
  }

}
