import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastContainerDirective } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoginSettingService } from 'src/app/services/login.setting.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  // Just for the reference for toast component.
  // message: string = 'This is the message'
  // type: string = 'error'
  // heading: string = 'Heading'

  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer!: ToastContainerDirective;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginConfiguration!: any;
  signIn!: FormGroup;
  showPassword!: boolean;
  inValidCredentialToast!: boolean;
  errorMessage!: string;
  validators = [Validators.required];
  @Input() isPreview = false;
  constructor(
    private loginSettingService: LoginSettingService,
    private router: Router,
    private authenticate: AuthenticationService,
    private configuration: ConfigurationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getLoginFormConfigs();
    this.createFormGroup();
  }
  getLoginFormConfigs(): void {
    this.loginConfiguration = this.loginSettingService.getWholeConfiguration();
    // this.loginConfiguration.supportText = this.sanitizer.bypassSecurityTrustHtml(this.loginConfiguration.supportText);
    // this.loginConfiguration.ssoText = this.sanitizer.bypassSecurityTrustHtml(this.loginConfiguration.ssoText);
    // this.loginConfiguration.welcomeText = this.sanitizer.bypassSecurityTrustHtml(this.loginConfiguration.welcomeText);
  }

  showHidePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  async onSubmit(event: any): Promise<void> {
    const data = this.signIn.value;
    try {
      const validate = await this.authenticate.login(
        data.username,
        data.password
      );
      if (validate) {
        this.router.navigate(['branding'], { skipLocationChange: true });
      }
    } catch (error) {
      if (error.status === 401) {
        this.inValidCredentialToast = true;
        this.errorMessage = 'login.loginForm.errorMsg.invalidCredentials';
      }
    }
  }

  createFormGroup(): void {
    this.signIn = new FormGroup({
      username: new FormControl('', this.validators),
      password: new FormControl('', this.validators),
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  closeToast(): void {
    this.inValidCredentialToast = false;
  }
}
