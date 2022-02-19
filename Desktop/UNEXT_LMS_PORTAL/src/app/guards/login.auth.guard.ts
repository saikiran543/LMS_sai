import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class LoginAuthGuard implements CanActivate {
  constructor(
    private authenticate: AuthenticationService,
    private router: Router
  ) { }
  async canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isValidate = await this.authenticate.validateToken();
    if (!isValidate) {
      return true;
    }
    this.router.navigate(['dashboard']);
    return isValidate;
  }
}
