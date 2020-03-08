import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Authorization, Authorized } from '@ulmax/authentication';
import { CardMemberService } from './cardnode.service';
import { CardMemberRequest } from './typecast';

@Controller(':cardNo/members')
export class CardNodeController {
  constructor(private memberSvc: CardMemberService) {}

  /**
   * retrieves the list of card members
   */
  @Get()
  members(@Param('cardNo') cardNo: string) {
    return this.memberSvc.members(cardNo);
  }

  /**
   * returns details of a particular card
   */
  @Get(':trackId')
  retrieveCard(@Param('trackId') trackId: string) {
    return this.memberSvc.cardFromTrackId(trackId);
  }

  /**
   * route to add new member to the card
   */
  @Post()
  addMember(
    @Param('cardNo') cardNo: string,
    @Body() memberDetails: CardMemberRequest,
  ) {
    return this.memberSvc.addMember(cardNo, memberDetails);
  }

  /**
   * deletes a particular member from a card
   */
  @Delete('member/:cardIdToRemove')
  removeMember(@Authorized() auth: Authorization, cardIdToRemove: string) {
    return this.memberSvc.removeMember(auth.trackId, cardIdToRemove);
  }
}
