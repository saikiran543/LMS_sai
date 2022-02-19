/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BrandingSettingService } from '../services/branding.setting.service';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {
  @Input() isPreview = false;
  layout!: string
  userName!: string
  message!: string
  isAnnouncement!: boolean
  announcement!: string
  isPoweredBy!: boolean
  profilePic!: string;
  verticalBanner!: string;
  horizontalBanner!: string;
  horizontalSplitBanner!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bannerConfig: any = {}
  isInitialize = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interval: any;
  progressAmount = 10;
  progress = 100;
  duration = 1000;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  percentageTitle: any;
  iconType = '';
  counterState = false;
  constructor(
    private brandingService: BrandingSettingService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.isPreview) {
      this.bannerConfig = this.brandingService.getWholeConfiguration();
      this.bannerConfig.announcementMessage = this.sanitizer.bypassSecurityTrustHtml(this.bannerConfig.announcementMessage);
      this.percentageTitle=this.bannerConfig.screenDuration;
    } else {
      await this.initializeBrandingPage();
    }
    this.isInitialize = true;
  }

  public async initializeBrandingPage(): Promise<void> {
    await this.brandingService.initializeData();
    this.bannerConfig = this.brandingService.getWholeConfiguration();
    this.bannerConfig.announcementMessage = this.sanitizer.bypassSecurityTrustHtml(this.bannerConfig.announcementMessage);
    if (this.bannerConfig.screenDuration) {
      this.progressAmount = JSON.parse(this.bannerConfig.screenDuration);
      this.percentageTitle = this.progressAmount;
    }
  }

  skipToDashBoard(): void {
    clearInterval(this.interval);
    this.router.navigate([''], { queryParams: { leftMenu: false, id: "dashboard" } });
  }

  ngAfterViewInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    if(this.isPreview){
      return;
    }
    this.interval = setInterval(() => {
      if (0 < this.progress) {
        this.duration = this.progress;
        this.progress -= Math.round(100 / this.progressAmount);
      } else {
        this.skipToDashBoard();
      }
      if (this.progressAmount >= this.percentageTitle && this.percentageTitle > 0) {
        this.percentageTitle--;
      }
    }, 1000);

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pauseResumeCountdown(state: any, announcement: any) {
    if (this.isPreview) {
      return;
    }
    if (state) {
      clearInterval(this.interval);
      this.iconType = 'resume';
      this.counterState = true;
    } else if (!state && announcement === "mouseleave") {
      this.startCountdown();
      this.iconType = '';
      this.counterState = false;
    } else {
      this.startCountdown();
      this.iconType = 'pause';
      this.counterState = false;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pauseResumeIconsHover(eventType: any) {
    if (this.isPreview) {
      return;
    }
    if (eventType === "mouseenter" && !this.counterState) {
      this.iconType = 'pause';
    } else if (!this.counterState) {
      this.iconType = '';
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pausePlayCountdownAnnouncement(event: any): void {
    if (this.isPreview) {
      return;
    }
    if (event.type === "mouseenter" && this.counterState) {
      this.pauseResumeCountdown(true, '');
    } else if (event.type === "mouseenter") {
      this.pauseResumeCountdown(true, '');
      this.counterState = false;
    } else if (this.counterState) {
      this.pauseResumeCountdown(true, '');
    } else {
      this.pauseResumeCountdown(false, 'mouseleave');
    }
  }
}
