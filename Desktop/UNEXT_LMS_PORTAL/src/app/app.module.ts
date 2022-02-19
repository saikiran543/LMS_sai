import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { Ng7BootstrapBreadcrumbModule } from "ng7-bootstrap-breadcrumb";
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ConfigurationService } from './services/configuration.service';
import { SignupModule } from './signup/signup.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ForgotPasswordComponent } from './login-layout/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login-layout/reset-password/reset-password.component';
import { NotFoundPageComponent } from './404-page/not-found-page.component';
import { BrandingSharedModule } from './shared/modules/branding-shared.module';
import { LoginLayoutSharedModule } from './shared/modules/login-layout-shared.module';
import { ToastrSharedModule } from './shared/modules/toastr-shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonService } from './services/common.service';
import { SelectionModelComponent } from './shared/components/selection-model/selection-model.component';
import { LayoutModule } from './layout/layout.module';
import { HttpClientInterceptor } from './interceptors/http-interceptor.interceptor';
import { ColumnChangesService, DimensionsHelper, ScrollbarHelper } from '@swimlane/ngx-datatable';



export function initApp(configservice: ConfigurationService) {
  return async (): Promise<void> => {
    await configservice.init();
  };
}

export function translateHttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NotFoundPageComponent,
    SelectionModelComponent,  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule,
    SignupModule,
    LayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng7BootstrapBreadcrumbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrandingSharedModule,
    LoginLayoutSharedModule,
    ToastrSharedModule,
    AngularSvgIconModule.forRoot(),
  ],
  providers: [ScrollbarHelper, DimensionsHelper, ColumnChangesService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [ConfigurationService, CommonService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true
    },
    HttpClient
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
