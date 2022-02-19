import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { LoginSettingService } from '../services/login.setting.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  @ViewChild(ToastContainerDirective, { static: true }) toastContainer!: ToastContainerDirective;
  heading = '';
  toggle = false;
  @Input() isPreview = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginConfiguration: any;

  // eslint-disable-next-line max-params
  constructor(
    private loginSettingService: LoginSettingService,
    private configuration: ConfigurationService,
    private authenticate: AuthenticationService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit(): Promise<void> {
    if (!this.isPreview) {
      await this.loginSettingService.initializeData();
    }
    this.getLoginLayoutConfigs();
  }

  async getLoginLayoutConfigs(): Promise<void> {
    this.loginConfiguration = await this.loginSettingService.getWholeConfiguration();
    this.loginConfiguration.headerText= this.sanitizer.bypassSecurityTrustHtml(this.loginConfiguration.headerText);
  }

  switchLanguage(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    this.toggle = !this.toggle;
    const language = this.toggle ? 'ar' : 'en';
    this.translateService.use(language).subscribe(res => {
      this.loginConfiguration.headerText = res.Welcome;
      this.toastrService.error(this.loginConfiguration.headerText, '', {
        positionClass: 'inline',
        closeButton: true
      });
    });
  }

}
