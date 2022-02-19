import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { CKEditorSharedModule } from 'src/app/shared/modules/ckeditor-shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonUtils } from 'src/app/utils/common-utils';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { LayoutComponent } from './layout.component';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { ContentHeaderComponent } from './content-layout/content-header/content-header.component';
import { HeaderComponent } from './header/header.component';
import { ContentLayoutComponent } from './content-layout/content-layout.component';
import { LeftMenuComponent } from './left-nav/left-menu/left-menu.component';
import { SidebarComponent } from './left-nav/sidebar/sidebar.component';
import { TocComponent } from './left-nav/toc/toc.component';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule,PerfectScrollbarConfigInterface,PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  declarations: [
    LayoutComponent,
    LeftNavComponent,
    HeaderComponent,
    ContentHeaderComponent,
    ContentLayoutComponent,
    LeftMenuComponent,
    SidebarComponent,
    TocComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Ng7BootstrapBreadcrumbModule,
    RouterModule,
    AngularSvgIconModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrSharedModule,
    CKEditorSharedModule,
    TranslateModule,
    PerfectScrollbarModule
  ],
  providers: [
    CommonUtils,{provide: PERFECT_SCROLLBAR_CONFIG,useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
  ],
  exports: [
    CommonModule,
  ]

})
export class LayoutModule { }
