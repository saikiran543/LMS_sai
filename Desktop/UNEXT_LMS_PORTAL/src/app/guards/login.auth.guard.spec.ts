import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../services/authentication.service';

import { LoginAuthGuard } from './login.auth.guard';

describe('LoginAuthGuard', () => {
  let guard: LoginAuthGuard;
  let authService: AuthenticationService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeMock: any = { snapshot: {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeStateMock: any = { snapshot: {}, url: '/home' };

  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [LoginAuthGuard, { provide: Router, useValue: routerMock },],
    });
    guard = TestBed.inject(LoginAuthGuard);
    authService = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  it('should stay on login page access', async () => {
    await expectAsync(guard.canActivate(routeMock, routeStateMock)).toBeResolvedTo(false);
  });
  it('should go to dashboard', async () => {
    spyOn(authService, 'validateToken').and.returnValue(Promise.resolve(true));
    await expectAsync(guard.canActivate(routeMock, routeStateMock)).toBeResolvedTo(true);
    expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard']);
  });
});
