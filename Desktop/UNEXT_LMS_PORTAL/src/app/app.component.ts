import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ResolutionKey } from './enums/resolutionKey';
import { ScreenSizeKey } from './enums/screenSizeKey';
import { StorageKey } from './enums/storageKey';
import { DialogService } from './services/dialog.service';
import { RouteOperationService } from './services/route-operation.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lms-portal';
  constructor(private translateService: TranslateService, private dialogService:DialogService, private routeOperation: RouteOperationService, private storageService: StorageService) {
    // This will tell which are all the languages available for translation
    translateService.addLangs(['en', 'ar']);
    // This will set the default language
    translateService.setDefaultLang('en');
    // If there are some other language than the default,
    // Then add that using this line. So the new language will take into effect
    // translateService.use('en');
    translateService.use('en');
    routeOperation.listenParams();
  }

  ngOnInit(): void {
    this.checkAndUpdateDevice();
    this.onResize();
  }

  @HostListener("window:resize", [])
  onResize(): void {
    this.checkAndUpdateDevice();
  }
  
  checkAndUpdateDevice(): void {
    if (window.innerWidth > ResolutionKey.XL_MONITOR) {
      this.storageService.set(StorageKey.CURRENT_DEVICE, ScreenSizeKey.XL_MONITOR);
    } else if (window.innerWidth <= ResolutionKey.XL_MONITOR && window.innerWidth > ResolutionKey.WEB_APP) {
      this.storageService.set(StorageKey.CURRENT_DEVICE, ScreenSizeKey.WEB_APP);
    } else if (window.innerWidth <= ResolutionKey.WEB_APP && window.innerWidth > ResolutionKey.TABLET) {
      this.storageService.set(StorageKey.CURRENT_DEVICE, ScreenSizeKey.TABLET);
    } else if (window.innerWidth <= ResolutionKey.TABLET && window.innerWidth > 0) {
      this.storageService.set(StorageKey.CURRENT_DEVICE, ScreenSizeKey.MOBILE);
    }
  }
}
