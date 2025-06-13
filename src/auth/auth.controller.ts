import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginUserDto from './dto/login-user.dto';
import RegisterUserDto from './dto/register-user.dto';
import LoginGoogleUserDto from './dto/login-google-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('google-login')
  async googleLogin(@Body() loginGoogleUserDto: LoginGoogleUserDto) {
    return this.authService.loginWithGoogle(loginGoogleUserDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
