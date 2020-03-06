import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Authorization } from '../models/author.entity';
import { AuthorService } from '../services/author.service';
import { ApiUseTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Authorization,
  },
})
@ApiUseTags('auth')
@Controller('author')
export class AuthorController {
  constructor(public service: AuthorService) {}
}
