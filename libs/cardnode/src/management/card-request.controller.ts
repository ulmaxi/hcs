import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import {
  Authorization,
  Authorized,
  AuthorizedPipe,
} from '@ulmax/authentication';
import { CardRequestService } from './card-request.service';
import { CardMemberRequest } from './typecast';
import { CardMemberService } from './cardnode.service';

/**
 * controller for admin functions over any
 * particular route
 */
@Controller('admin')
export class CardAdminController {
  constructor(
    private cardReq: CardRequestService,
    private memberSvc: CardMemberService,
  ) {}

  @Post('request/primarycard')
  createPrimaryCard(
    @Authorized(AuthorizedPipe) auth: Authorization,
    @Body() memberReq: CardMemberRequest,
  ) {
    return this.cardReq.createNewCard(auth, memberReq);
  }

  /**
   * returns the ulmax card for the authorized user
   */
  @Get('mycard')
  retrieveAuthorizedCard(@Authorized(AuthorizedPipe) auth: Authorization) {
    return this.memberSvc.cardFromTrackId(auth.trackId);
  }

  /**
   * returns details of a particular card
   */
  @Get('internal/fromTrackId/:trackId')
  retrieveCard(@Param('trackId') trackId: string) {
    return this.memberSvc.cardFromTrackId(trackId);
  }
}
