import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Login } from './login.entity';
import { LoginService } from './login.service';

@Crud({
  model: {
    type: Login,
  },
})
@ApiUseTags('auth')
@Controller('login')
export class LoginController {
  constructor(public service: LoginService) {}
}
