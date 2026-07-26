import { Body, CurrentUser, Get, HttpCode, JsonController, Post, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthService } from '../services/AuthService';

class LoginBody {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  public login(@Body() body: LoginBody) {
    try {
      return this.authService.login(body.username, body.password);
    } catch {
      throw new UnauthorizedError('Invalid username or password');
    }
  }

  @Get('/me')
  public me(@CurrentUser() user: any) {
    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }
    return { user };
  }
}
