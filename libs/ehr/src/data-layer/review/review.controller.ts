import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Crud } from '@nestjsx/crud';
import { Review } from './review.entity';

@Crud({
  model: {
    type: Review,
  },
})
@Controller('review')
export class ReviewController {
  constructor(public service: ReviewService) {}
}
