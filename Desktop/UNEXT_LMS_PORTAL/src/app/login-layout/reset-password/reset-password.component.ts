import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from 'src/app/services/http-client.service';
import { PasswordPolicyValidators } from './password-policy-validators';
import { Service } from '../../enums/service';
import { HttpMethod } from '../../enums/httpMethod';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  userId!: string | null;
  validators = [Validators.required];
  newPasswordType = false;
  confirmPasswordType = false;
  successToast = false;
  responseStatus = 0;
  passwordPolicyValidators = [
    Validators.minLength(8),
    PasswordPolicyValidators.patternValidator(/\d/, { hasNumber: true }),
    PasswordPolicyValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
    PasswordPolicyValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
    PasswordPolicyValidators.patternValidator(/^\S+$/, { hasSpace: true }),
    PasswordPolicyValidators.patternValidator(/[*@!#$`<>?|:;'",.\\/[\]_=+%&()^~{}-]+/, { hasSpecial: true })
  ]

  passwordPolicyErrors = [
    { errorName: 'minlength', errorText: 'login.resetPassword.errorMsg.minLength' },
    { errorName: 'hasSmallCase', errorText: 'login.resetPassword.errorMsg.hasSmallCase' },
    { errorName: 'hasCapitalCase', errorText: 'login.resetPassword.errorMsg.hasCapitalCase' },
    { errorName: 'hasNumber', errorText: 'login.resetPassword.errorMsg.hasNumber' },
    { errorName: 'hasSpace', errorText: 'login.resetPassword.errorMsg.hasSpace' },
    { errorName: 'hasSpecial', errorText: 'login.resetPassword.errorMsg.hasSpecial' }
  ]

  resetPasswordForm = new FormGroup(
    {
      // eslint-disable-next-line no-invalid-this
      newPassword: new FormControl('', [...this.validators, ...this.passwordPolicyValidators]),
      // eslint-disable-next-line no-invalid-this
      confirmPassword: new FormControl('', [...this.validators]),
    },
    PasswordPolicyValidators.matchPasswordValidator('newPassword', 'confirmPassword')
  );

  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClientService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  onSubmit(): void {
    const data = {
      "username": this.userId,
      "password": this.resetPasswordForm.value.newPassword
    };
      // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    self.successToast = false;
    self.responseStatus === 0;
    const obs = this.httpClient.getResponseAsObservable(Service.USER_SERVICE, 'authentication/changePassword', HttpMethod.POST, data, false);
    obs.subscribe(
      function response(res) {
        self.responseStatus = res.status;
        if (self.responseStatus === 200) {
          self.successToast = true;
          self.resetPasswordForm.reset();
          localStorage.clear();
        }
      },
      function errorResponse(error) {
        self.resetPasswordForm.reset();
        self.responseStatus = error.status;
      }
    );

  }
  checkPolicyValidity(): boolean {
    const currentPolicyErrors = this.passwordPolicyErrors.filter((item) => this.resetPasswordForm.controls['newPassword'].hasError(item.errorName));
    if (currentPolicyErrors.length === 0) {
      return false;
    }
    return true;

  }

  cancelOpertion(): void {
    this.router.navigate(['login']);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  closeToast(): void {
    this.successToast = false;
    this.responseStatus = 0;
  }
}
