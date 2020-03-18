import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Authorization } from './author.entity';
import { AuthorService } from './author.service';

@Crud({
  model: {
    type: Authorization,
  },
})
@ApiUseTags('auth')
@Controller('internal/data-layer/author')
export class AuthorController {
  constructor(public service: AuthorService) {}
}
