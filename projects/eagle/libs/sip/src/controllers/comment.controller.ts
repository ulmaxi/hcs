import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Comment } from '../models/comment.entity';
import { CommentService } from '../services/comment.service';

@Crud({
  model: {
    type: Comment,
  },
})
@Controller('comments')
export class CommentController {
  constructor(private service: CommentService) {}
}
