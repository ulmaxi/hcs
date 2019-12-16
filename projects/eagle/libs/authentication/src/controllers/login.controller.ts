import { Controller } from '@nestjs/common';
import { LoginService } from '../services/login.service';
import { Crud } from '@nestjsx/crud';
import { Login } from '../models/login.entity';
import { ApiUseTags } from '@nestjs/swagger';

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
