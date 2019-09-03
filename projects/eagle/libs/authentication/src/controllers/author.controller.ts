import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Authorization } from '../models/author.entity';
import { AuthorService } from '../services/author.service';

@Crud({
  model: {
    type: Authorization,
  },
})
@Controller('author')
export class AuthorController {
  constructor(public service: AuthorService) {}
}
