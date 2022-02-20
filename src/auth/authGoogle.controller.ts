import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiUseTags } from '@nestjs/swagger';
import { LoginByGoogleDto } from './authGoogle.dto';

@ApiUseTags('Auth by Google')
@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginByGoogleDto): Promise<any> {
    return this.authService.loginByGoogle(dto);
  }
}
