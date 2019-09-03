import {
  Controller,
  Get,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { SipService } from '../services/sip.service';
import {
  FindQueryParams,
  SearchQueryParams,
  Authorized,
  AuthorizedPipe,
} from '@eagle/server-shared';
import { Authorization } from '@eagle/generated';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

@Controller('stream')
export class SipController {
  constructor(private sipSvc: SipService) {}

  @ApiOkResponse({
    description: `returns a list of personalized post for the user`,
  })
  @ApiUseTags('sip', 'stream', 'feed', 'personal')
  @Get('feed')
  personalFeed(
    @Authorized(AuthorizedPipe) authorized: Authorization,
    @Query() query: FindQueryParams,
  ) {
    return this.sipSvc.personalFeed(
      authorized.trackId,
      FindQueryParams.fromJson(query),
    );
  }

  @ApiOkResponse({ description: `return's a post with the id param` })
  @ApiUseTags('sip', 'stream', 'feed', 'post')
  @Get('feed/:id')
  getPost(@Param('id') postId: string) {
    return this.sipSvc.fetchPost(postId);
  }

  @ApiOkResponse({
    description: `Searches all the post that matches the query`,
  })
  @ApiUseTags('sip', 'stream', 'feed', 'search')
  @Get('search')
  search(@Query() { search, ...params }: SearchQueryParams) {
    if (!search) {
      throw feedSearchQueryError;
    }
    return this.sipSvc.search(search, FindQueryParams.fromJson(params));
  }

  @ApiOkResponse({ description: `retrieves comments posted under the post` })
  @ApiUseTags('sip', 'stream', 'comments', 'post')
  @Get('comments/:postId')
  comments(@Param('postId') postId: string, @Query() query: FindQueryParams) {
    return this.sipSvc.comments(postId, query);
  }
}

/**
 * error thrown when search query is missing
 */
export const feedSearchQueryError = new BadRequestException(
  `search field is expected in the query parameters`,
);
