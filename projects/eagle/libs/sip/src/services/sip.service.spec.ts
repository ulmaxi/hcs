import { Test, TestingModule } from '@nestjs/testing';
import { FindQueryParams, FindResponse } from '@ulmax/server-shared';
import { classToPlain } from 'class-transformer';
import { Post } from '../models/posts.entity';
import { CommentService } from './comment.service';
import { PostService } from './posts.service';
import { MinimalFeedProps, SipService } from './sip.service';

describe('SipService', () => {
  let service: SipService;
  let postSvc: PostService;
  let commentSvc: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SipService,
        {
          provide: PostService,
          useValue: {
            findOne: jest.fn,
            repository: {
              findAndCount: jest.fn,
              create: jest.fn,
            },
          },
        },
        {
          provide: CommentService,
          useValue: {
            find: jest.fn,
          },
        },
      ],
    }).compile();

    service = module.get<SipService>(SipService);
    postSvc = module.get<PostService>(PostService);
    commentSvc = module.get<CommentService>(CommentService);
  });

  describe('personalFeed', () => {
    it('should format query params and override default params with custom params', async () => {
      const params: FindQueryParams = { limit: 15, skip: 10 };
      jest
        .spyOn(postSvc.repository, 'findAndCount')
        .mockResolvedValueOnce([[], 1]);
      const fieldSpy = jest.spyOn(service, 'fieldProps');
      const resp = await service.personalFeed('', params);
      expect(fieldSpy).toHaveBeenCalled();
      expect(classToPlain(resp)).toEqual({
        data: [],
        ...params,
        total: 1,
      } as FindResponse<Post>);
    });
  });

  describe('search', () => {
    it('should search with query with formated parameters', async () => {
      const params: FindQueryParams = { limit: 15, skip: 10 };
      const query = 'head-ache';
      jest
        .spyOn(postSvc.repository, 'findAndCount')
        .mockImplementationOnce(async conditions => {
          expect((conditions as any).where.text).toEqual(`%${query}%`);
          return [[], 1];
        });
      const fieldSpy = jest.spyOn(service, 'fieldProps');
      const resp = await service.search(query, params);
      expect(fieldSpy).toHaveBeenCalled();
      expect(classToPlain(resp)).toEqual({
        data: [],
        ...params,
        total: 1,
      } as FindResponse<Post>);
    });
  });

  describe('fieldProps', () => {
    it('should format the query and select the right elements', () => {
      const params: FindQueryParams = { limit: 15, skip: 10 };
      expect(service.fieldProps<any>(params)).toEqual({
        take: params.limit,
        skip: params.skip,
        select: MinimalFeedProps,
      });
    });
  });

  describe('fetchPost', () => {
    it('should ', async () => {
      const postId = 'random-post-id';
      const spy = jest.spyOn(postSvc, 'findOne').mockResolvedValue(null);
      expect(await service.fetchPost(postId)).toEqual(null);
      expect(spy).toBeCalledWith({ where: { id: postId } });
    });
  });
});
