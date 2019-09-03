import { Controller } from '@nestjs/common';
import { LoginService } from '../services/login.service';
import { Crud } from '@nestjsx/crud';
import { Login } from '../models/login.entity';

@Crud({
  model: {
    type: Login,
  },
})
@Controller('login')
export class LoginController {
  constructor(public service: LoginService) {}
}
