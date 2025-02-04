import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async validateToken(token: string): Promise<any> {
    try {
      const validate = await this.jwtService.verifyAsync(token, {
        secret: "secret",
      });

      return validate;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException(
        'Authorization token is missing or invalid',
      );
    }

    const user = await this.validateToken(token);

    if (user) {
      request.auth = user;
      return true;
    }
    return false;
  }
}
