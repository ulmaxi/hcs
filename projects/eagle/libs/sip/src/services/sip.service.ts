import { Injectable } from '@nestjs/common';
import { FindQueryParams, FindResponse } from '@ulmax/server-shared';
import { FindManyOptions } from 'typeorm';
import { Comment } from '../models/comment.entity';
import { Post } from '../models/posts.entity';
import { CommentService } from './comment.service';
import { PostService } from './posts.service';

const DefaultQueryParams = FindQueryParams.fromJson({
  limit: 10,
  skip: 0,
});

/**
 * The fields returned for post diplayed by the feed
 */
export const MinimalFeedProps = [
  'createdAt',
  'id',
  'image',
  'title',
  'subtitle',
];

@Injectable()
export class SipService {
  constructor(private postSvc: PostService, private cmSvc: CommentService) {}

  /**
   * loads a dynamic feed for the user
   */
  async personalFeed(personalId: string, parms?: FindQueryParams) {
    const { limit, skip } = { ...DefaultQueryParams, ...parms };
    const [data, total] = await this.postSvc.repository.findAndCount(
      this.fieldProps(parms),
    );
    return FindResponse.fromJson<Post>({ data, total, limit, skip });
  }

  /**`
   * The defualt params used for querying
   */
  fieldProps<T>({ limit, skip }: FindQueryParams) {
    return {
      take: limit,
      skip,
      select: MinimalFeedProps,
    } as FindManyOptions<T>;
  }

  /**
   * returend a paginated search for tne query
   */
  async search(query: string, parms?: FindQueryParams) {
    const formatedParams = this.fieldProps(parms);
    const [data, total] = await this.postSvc.repository.findAndCount({
      ...formatedParams,
      where: {
        text: `%${query}%`,
      },
    });
    return FindResponse.fromJson({ data, total, ...parms });
  }

  /**
   * retreves a unique fpost requested
   */
  async fetchPost(postId: string) {
    const post = await this.postSvc.findOne({ where: { id: postId } });
    return post;
  }

  /**
   * loads comments for a particular post
   */
  async comments(postId: string, queryParams: FindQueryParams) {
    const { limit, skip } = { ...DefaultQueryParams, ...queryParams };
    const [data, total] = await this.cmSvc.repository.findAndCount({
      skip,
      take: limit,
      where: {
        postId,
      },
    });
    return FindResponse.fromJson({ data, total, limit, skip });
  }

  /**
   * creates a new post
   */
  async createComment(authorId: string, unSavedcomment: Comment) {
    unSavedcomment.authorId = authorId;
    return this.cmSvc.repository.create(unSavedcomment);
  }
}
