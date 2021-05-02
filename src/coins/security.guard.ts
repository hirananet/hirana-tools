import { environments } from 'src/environment';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SecurityGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenData = environments.bankTokens.find(data => request.header('X-AUTH-TOKEN') == data.token);
    if(tokenData) {
      request.headers['client-id'] = tokenData.clientID;
      return true;
    }
    return false;
  }
}
