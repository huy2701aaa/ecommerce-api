import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ForgetPassDto, LoginAuthDto } from './auth.dto';
import { BASE_API_URL } from 'src/common/constants';

@Controller(`${BASE_API_URL}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() payload: CreateAuthDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  login(@Body() payload: LoginAuthDto) {
    return this.authService.login(payload);
  }

  @Post('forget-pass')
  forgetPass(@Body() payload: ForgetPassDto) {
    return this.authService.forgetPass(payload);
  }
}
