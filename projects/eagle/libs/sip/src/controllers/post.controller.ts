import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Post } from '../models/posts.entity';
import { PostService } from '../services/posts.service';

@Crud({
  model: {
    type: Post,
  },
})
@Controller('posts')
export class PostContoller {
  constructor(private service: PostService) {}
}
