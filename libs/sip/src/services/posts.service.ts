import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Post } from '../models/posts.entity';

@Injectable()
export class PostService extends TypeOrmCrudService<Post> {
  constructor(
    @InjectRepository(Post)
    public repository: Repository<Post>,
  ) {
    super(repository);
  }
}
