/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from '../layout/layout.component';
import { BrandingSettingService } from '../services/branding.setting.service';
import { HttpClientService } from '../services/http-client.service';
import { Location } from '@angular/common';
import { BrandingComponent } from './branding.component';
import { LoginLayoutComponent } from '../login-layout/login-layout.component';
import { NgCircleProgressModule } from 'ng-circle-progress';

describe('BrandingComponent', () => {
  let component: BrandingComponent;
  let fixture: ComponentFixture<BrandingComponent>;
  let brandingService: BrandingSettingService;
  let location: Location;
  // let circleProgress: NgCircleProgressModule;
  const routes: Routes = [
    { path: '', component: LayoutComponent },
    { path: 'login', component: LoginLayoutComponent }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes(routes), NgCircleProgressModule.forRoot({})],
      declarations: [BrandingComponent, LayoutComponent, LoginLayoutComponent],
      providers: [HttpClientService, BrandingSettingService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandingComponent);
    brandingService = TestBed.inject(BrandingSettingService);
    location = TestBed.inject(Location);
    // circleProgress = TestBed.inject(NgCircleProgressModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if vertical layout is loaded', async () => {
    spyOn(brandingService, 'initializeData').and.resolveTo();
    const spyGetWholeConfige = spyOn(brandingService, 'getWholeConfiguration');
    const expectedResult = {
      bannerType: 'vertical',
      userName: 'Ryan',
      headerText: 'Hello',
      greetingsText: 'You will enter into your personalized learning world now..',
      poweredByUnextLogo: true,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      brandingBannerVerticalImage: 'assets/images/icons/vertical-layout-img.png',
      brandingBannerHorizontalImage: 'assets/images/icons/card-layout-img.png',
      brandingBannerHorizontalSplitImage: 'assets/images/icons/horizontal-layout-img.png',
      announcementMessage: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: true
    };
    spyGetWholeConfige.and.returnValue(expectedResult);
    await component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.branding-vertical-layout')).toBeTruthy();
    expect(compiled.querySelector('.branding-card-layout')).toBeFalsy();
    expect(compiled.querySelector('.branding-horizontal-layout')).toBeFalsy();
    expect(compiled.querySelector('.vertical-img-component>img').src).toContain(expectedResult.brandingBannerVerticalImage);
    expect(compiled.querySelector('.user-img').src).toContain(expectedResult.profilePic);
    expect(compiled.querySelector('.hello-text').textContent).toContain(expectedResult.headerText + ' ' + expectedResult.userName);
    expect(compiled.querySelector('.branding-text').textContent).toContain(expectedResult.greetingsText);
    expect(compiled.querySelector('.announcement-text').textContent).toContain(expectedResult.announcementMessage);
    expect(compiled.querySelector('.powered-by-unext')).toBeTruthy();
    expect(compiled.querySelector('.powered-by-unext>img').src).toContain('assets/images/powered-by-unext-logo.png');
    const expectedResult1 = {
      bannerType: 'vertical',
      userName: 'Ryan',
      greetingsText: 'You will enter into your personalized learning world now..',
      poweredByUnextLogo: false,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      brandingBannerVerticalImage: 'assets/images/icons/vertical-layout-img.png',
      brandingBannerHorizontalImage: 'assets/images/icons/card-layout-img.png',
      brandingBannerHorizontalSplitImage: 'assets/images/icons/horizontal-layout-img.png',
      announcementMessage: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: false
    };
    spyGetWholeConfige.and.returnValue(expectedResult1);
    await component.ngOnInit();
    fixture.detectChanges();
    expect(compiled.querySelector('.branding-vertical-layout>.announcement-text')).toBeFalsy();
    expect(compiled.querySelector('.branding-vertical-layout>.powered-by-unext')).toBeFalsy();
    // compiled.querySelector('.skip-to-dashboard>a').click();
    // expect(location.path()).toBe('');
  });

  it('should check if horizontal layout is loaded', async () => {
    spyOn(brandingService, 'initializeData').and.resolveTo();
    const spyGetWholeConfige = spyOn(brandingService, 'getWholeConfiguration');
    const expectedResult = {
      bannerType: 'horizontal',
      userName: 'Ryan',
      headerText: 'Hello',
      greetingsText: 'You will enter into your personalized learning world now..',
      poweredByUnextLogo: true,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      brandingBannerVerticalImage: 'assets/images/icons/vertical-layout-img.png',
      brandingBannerHorizontalImage: 'assets/images/icons/card-layout-img.png',
      brandingBannerHorizontalSplitImage: 'assets/images/icons/horizontal-layout-img.png',
      announcementMessage: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: true
    };
    spyGetWholeConfige.and.returnValue(expectedResult);
    await component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.branding-vertical-layout')).toBeFalsy();
    expect(compiled.querySelector('.branding-card-layout')).toBeTruthy();
    expect(compiled.querySelector('.branding-horizontal-layout')).toBeFalsy();
    const bgImage = compiled.querySelector('.hero-overlay-component').style.backgroundImage;
    expect(bgImage).toContain('url("' + expectedResult.brandingBannerHorizontalImage + '")');
    expect(compiled.querySelector('.user-img').src).toContain(expectedResult.profilePic);
    expect(compiled.querySelector('.hello-text').textContent).toContain(expectedResult.headerText + ' ' + expectedResult.userName);
    expect(compiled.querySelector('.branding-text').textContent).toContain(expectedResult.greetingsText);
    expect(compiled.querySelector('.announcement-text').textContent).toContain(expectedResult.announcementMessage);
    expect(compiled.querySelector('.powered-by-unext')).toBeTruthy();
    expect(compiled.querySelector('.powered-by-unext>img').src).toContain('assets/images/powered-by-unext-logo.png');
    const expectedResult1 = {
      bannerType: 'horizontal',
      userName: 'Ryan',
      greetingsText: 'You will enter into your personalized learning world now..',
      poweredByUnextLogo: false,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      brandingBannerVerticalImage: 'assets/images/icons/vertical-layout-img.png',
      brandingBannerHorizontalImage: 'assets/images/icons/card-layout-img.png',
      brandingBannerHorizontalSplitImage: 'assets/images/icons/horizontal-layout-img.png',
      announcement: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: false
    };
    spyGetWholeConfige.and.returnValue(expectedResult1);
    await component.ngOnInit();
    fixture.detectChanges();
    expect(compiled.querySelector('.branding-card-layout>.announcement-text')).toBeFalsy();
    expect(compiled.querySelector('.branding-card-layout>.powered-by-unext')).toBeFalsy();
  });

  it('should check if horizontalSplit layout is loaded', async () => {
    spyOn(brandingService, 'initializeData').and.resolveTo();
    const spyGetWholeConfige = spyOn(brandingService, 'getWholeConfiguration');
    const expectedResult = {
      bannerType: 'horizontalSplit',
      userName: 'Ryan',
      headerText: 'Hello',
      greetingsText: 'You will enter into your personalized learning world now..',
      poweredByUnextLogo: true,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      brandingBannerVerticalImage: 'assets/images/icons/vertical-layout-img.png',
      brandingBannerHorizontalImage: 'assets/images/icons/card-layout-img.png',
      brandingBannerHorizontalSplitImage: 'assets/images/icons/horizontal-layout-img.png',
      announcementMessage: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: true
    };
    spyGetWholeConfige.and.returnValue(expectedResult);
    await component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.branding-vertical-layout')).toBeFalsy();
    expect(compiled.querySelector('.branding-card-layout')).toBeFalsy();
    expect(compiled.querySelector('.branding-horizontal-layout')).toBeTruthy();
    expect(compiled.querySelector('.horizontal-img-component>img').src).toContain(expectedResult.brandingBannerHorizontalSplitImage);
    expect(compiled.querySelector('.user-img').src).toContain(expectedResult.profilePic);
    expect(compiled.querySelector('.hello-text').textContent).toContain(expectedResult.headerText + ' ' + expectedResult.userName);
    expect(compiled.querySelector('.branding-text').textContent).toContain(expectedResult.greetingsText);
    expect(compiled.querySelector('.announcement-text').textContent).toContain(expectedResult.announcementMessage);
    expect(compiled.querySelector('.powered-by-unext')).toBeTruthy();
    expect(compiled.querySelector('.powered-by-unext>img').src).toContain('assets/images/powered-by-unext-logo.png');
    const expectedResult1 = {
      bannerType: 'horizontalSplit',
      userName: 'Ryan',
      detailedWelcomeMessage: 'You will enter into your personalized learning world now..',
      isPoweredBy: false,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      verticalBanner: 'assets/images/icons/vertical-layout-img.png',
      horizontalBanner: 'assets/images/icons/card-layout-img.png',
      horizontalSplitBanner: 'assets/images/icons/horizontal-layout-img.png',
      announcementMessage: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: false
    };
    spyGetWholeConfige.and.returnValue(expectedResult1);
    await component.ngOnInit();
    fixture.detectChanges();
    expect(compiled.querySelector('.branding-horizontal-layout>.announcement-text')).toBeFalsy();
    expect(compiled.querySelector('.branding-horizontal-layout>.powered-by-unext')).toBeFalsy();
  });

  it('should preview mode is loaded', async () => {
    spyOn(brandingService, 'initializeData').and.resolveTo();
    const spyGetWholeConfige = spyOn(brandingService, 'getWholeConfiguration');
    const expectedResult = {
      bannerType: 'horizontalSplit',
      userName: 'Ryan',
      headerText: 'Hello',
      greetingsText: 'You will enter into your personalized learning world now..',
      poweredByUnextLogo: true,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      brandingBannerVerticalImage: 'assets/images/icons/vertical-layout-img.png',
      brandingBannerHorizontalImage: 'assets/images/icons/card-layout-img.png',
      brandingBannerHorizontalSplitImage: 'assets/images/icons/horizontal-layout-img.png',
      announcementMessage: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: true
    };
    spyGetWholeConfige.and.returnValue(expectedResult);
    component.isPreview = true;
    await component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.branding-vertical-layout')).toBeFalsy();
    expect(compiled.querySelector('.branding-card-layout')).toBeFalsy();
    expect(compiled.querySelector('.branding-horizontal-layout')).toBeTruthy();
    expect(compiled.querySelector('.horizontal-img-component>img').src).toContain(expectedResult.brandingBannerHorizontalSplitImage);
    expect(compiled.querySelector('.user-img').src).toContain(expectedResult.profilePic);
    expect(compiled.querySelector('.hello-text').textContent).toContain(expectedResult.headerText + ' ' + expectedResult.userName);
    expect(compiled.querySelector('.branding-text').textContent).toContain(expectedResult.greetingsText);
    expect(compiled.querySelector('.announcement-text').textContent).toContain(expectedResult.announcementMessage);
    expect(compiled.querySelector('.powered-by-unext')).toBeTruthy();
    expect(compiled.querySelector('.powered-by-unext>img').src).toContain('assets/images/powered-by-unext-logo.png');
  });

  it('should check pause and resume icons are loaded', async () => {
    spyOn(brandingService, 'initializeData').and.resolveTo();
    const spyGetWholeConfige = spyOn(brandingService, 'getWholeConfiguration');
    const expectedResult = {
      bannerType: 'horizontalSplit',
      userName: 'Ryan',
      headerText: 'Hello',
      greetingsText: 'You will enter into your personalized learning world now..',
      poweredByUnextLogo: true,
      profilePic: 'assets/images/icons/icon-profile-avatar.png',
      brandingBannerVerticalImage: 'assets/images/icons/vertical-layout-img.png',
      brandingBannerHorizontalImage: 'assets/images/icons/card-layout-img.png',
      brandingBannerHorizontalSplitImage: 'assets/images/icons/horizontal-layout-img.png',
      announcementMessage: "We are delighted to have you among us. Our programs are comprehensive learning to boost skill sets. You will enter into your personalized learning world soon You will enter into your personalized learning world soon You will enter into your personalize...",
      announcementStatus: true
    };
    spyGetWholeConfige.and.returnValue(expectedResult);
    component.iconType = 'pause';
    await component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.progressbar-action-btn.pause>img').src).toContain('assets/images/icons/icon-pause.svg');
    // eslint-disable-next-line require-atomic-updates
    component.iconType = 'resume';
    await component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(compiled.querySelector('.progressbar-action-btn.play>img').src).toContain('assets/images/icons/icon-play.svg');
  });

  it('should show pause icon while mouse entering the counter', async () => {
    spyOn(component, 'pauseResumeIconsHover').withArgs("mouseenter").and.callThrough();
    await component.pauseResumeIconsHover("mouseenter");
    fixture.detectChanges();
    expect(component.counterState).toBeFalsy();
    expect(component.iconType).toEqual('pause');
    expect(component.pauseResumeIconsHover).toHaveBeenCalled();
  });

  it('should remove the icon counter while mouse leaving the counter', async () => {
    spyOn(component, 'pauseResumeIconsHover').withArgs("mouseleave").and.callThrough();
    fixture.detectChanges();
    component.counterState = false;
    component.iconType = "";
    await component.pauseResumeIconsHover("mouseleave");
    fixture.detectChanges();
    expect(component.counterState).toBeFalsy();
    expect(component.iconType).toEqual('');
    expect(component.pauseResumeIconsHover).toHaveBeenCalled();
  });

  it('should show resume icon while mouse entering the announcement if the counter is already paused', () => {
    const eventType = { type: "mouseenter" };
    component.counterState = true;
    spyOn(component, "pauseResumeCountdown").withArgs(true, '').and.callThrough();
    spyOn(component, 'pausePlayCountdownAnnouncement').withArgs(eventType).and.callThrough();
    component.pauseResumeCountdown(true, '');
    component.pausePlayCountdownAnnouncement(eventType);
    fixture.detectChanges();
    expect(component.iconType).toEqual('resume');
    expect(component.counterState).toBeTruthy();
    expect(component.pauseResumeCountdown(true, '')).toHaveBeenCalled;
    expect(component.pausePlayCountdownAnnouncement(eventType)).toHaveBeenCalled;
  });

  it('should show resume icon and pause the counter while mouse entering the announcement if the counter is running', () => {
    const eventType = { type: "mouseenter" };
    component.counterState = false;
    component.iconType = 'resume';
    spyOn(component, "pauseResumeCountdown").withArgs(true, '').and.callThrough();
    spyOn(component, 'pausePlayCountdownAnnouncement').withArgs(eventType).and.callThrough();
    component.pausePlayCountdownAnnouncement(eventType);
    fixture.detectChanges();
    expect(component.iconType).toEqual('resume');
    expect(component.counterState).toBeFalsy();
    expect(component.pausePlayCountdownAnnouncement(eventType)).toHaveBeenCalled;
  });

  it('should show resume icon while mouse mouseleaves the announcement if the counter is already paused', () => {
    const eventType = "mouseleave";
    component.counterState = true;
    spyOn(component, "pauseResumeCountdown").withArgs(true, '').and.callThrough();
    spyOn(component, 'pausePlayCountdownAnnouncement').withArgs(eventType).and.callThrough();
    component.pauseResumeCountdown(true, '');
    component.pausePlayCountdownAnnouncement(eventType);
    fixture.detectChanges();
    expect(component.iconType).toEqual('resume');
    expect(component.counterState).toBeTruthy();
    expect(component.pauseResumeCountdown(true, '')).toHaveBeenCalled;
    expect(component.pausePlayCountdownAnnouncement(eventType)).toHaveBeenCalled;
  });

  it('should not show any icons while mouse leave the announcement if the counter is running', () => {
    const eventType = "mouseleave";
    component.counterState = false;
    spyOn(component, "pauseResumeCountdown").withArgs(false, 'mouseleave').and.callThrough();
    spyOn(component, 'pausePlayCountdownAnnouncement').withArgs(eventType).and.callThrough();
    component.pauseResumeCountdown(false, 'mouseleave');
    component.pausePlayCountdownAnnouncement(eventType);
    fixture.detectChanges();
    expect(component.iconType).toEqual('');
    expect(component.counterState).toBeFalsy();
    expect(component.pauseResumeCountdown(false, 'mouseleave')).toHaveBeenCalled;
    expect(component.pausePlayCountdownAnnouncement(eventType)).toHaveBeenCalled;
  });

  it('should show pause icon while mouse entering the counter to click pause icon', () => {
    component.counterState = false;
    spyOn(component, "pauseResumeCountdown").withArgs(false, 'mouseenter').and.callThrough();
    component.pauseResumeCountdown(false, 'mouseenter');
    fixture.detectChanges();
    expect(component.iconType).toEqual('pause');
    expect(component.counterState).toBeFalsy();
    expect(component.pauseResumeCountdown(false, 'mouseenter')).toHaveBeenCalled;
  });

  it('should start countdown when entering the branding page', () => {
    component.duration = 1000;
    component.progress = 100;
    component.progressAmount = 10;
    component.percentageTitle = component.progressAmount;
    component.duration = component.progress;
    const countdownMock = spyOn(component, "startCountdown");
    component.iconType = "pause";
    component.startCountdown();
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(component.percentageTitle).toEqual(component.progressAmount);
    expect(countdownMock).toHaveBeenCalled();
  });

  it('should redirect to dashboard', () => {
    spyOn(component, "skipToDashBoard").and.callThrough();
    component.skipToDashBoard();
    fixture.detectChanges();
    expect(component.skipToDashBoard).toHaveBeenCalled();
    expect(location.path()).toBe('');
  });

});
