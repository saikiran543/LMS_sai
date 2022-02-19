/* eslint-disable max-lines-per-function */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { Dialog } from 'src/app/Models/Dialog';
import { BrandingSettingService } from 'src/app/services/branding.setting.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CommonUtils } from 'src/app/utils/common-utils';

@Component({
  selector: 'app-branding-settings',
  templateUrl: './branding-settings.component.html',
  styleUrls: ['./branding-settings.component.scss']
})
export class BrandingSettingsComponent implements OnInit {

  form = new FormGroup({
    bannerType: new FormControl(''),
    header: new FormControl(''),
    screenDuration: new FormControl(''),
    greetings: new FormControl(''),
    announcementActive: new FormControl(''),
    announcement: new FormControl(''),
    displayLogo: new FormControl('')
  });
  mobForm!: FormGroup;
  showBrandingUpload = true;
  showMobBrandingUpload = true;
  brandingImageSrc = '';
  brandingOriginalImageSrc = '';
  brandingFileType = 'image';
  bannerAcceptedFiles = 'image/jpg, image/jpeg, image/img, image/png';
  bannerSavedImage = '';
  bannerCroppedImage = '';
  mobBrandingImageSrc = '';
  mobBrandingOriginalImageSrc = '';
  mobBrandingFileType = 'image';
  mobBannerAcceptedFiles = 'image/jpg, image/jpeg, image/img, image/png';
  mobBannerSavedImage = '';
  showWebEditBranding = false;
  brandingVerticalWidth = 1048;
  brandingVerticalHeight = 1080;
  brandingHorizontalWidth = 1920;
  brandingHorizontalHeight = 1080;
  brandingHorizontalSplitWidth = 1920;
  brandingHorizontalSplitHeight = 652;
  brandingWebWidth = 0;
  brandingWebHeight = 0;
  webBrandingFullWidth = 1088;
  webBrandingFullHeight = 1112;
  webBrandingHorizontalSplitWidth = 1992;
  webBrandingHorizontalSplitHeight = 672;
  brandingMobWidth = 0;
  brandingMobHeight = 0;
  headerLengthMax = 25;
  greetingsLengthMax = 60;
  announcementLengthMax = 256;
  mobBrandingOutputWidth = 375;
  mobBrandingOutputHeight = 667;
  mobHeaderLengthMax = 25;
  mobGreetingsLengthMax = 60;
  mobAnnouncementLengthMax = 256;
  headerLengthText = '';
  greetingsLengthText = '';
  announcementLengthText = '';
  mobHeaderLengthText = '';
  mobGreetingsLengthText = '';
  mobAnnouncementLengthText = '';
  disableAnnouncementText = true;
  disableMobAnnouncementText = true;
  showPreviewComponent = false;
  imageSaveType = 'brandingBannerVerticalImage';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formInitialValues: any;
  saveCalled = false;
  imageText = '';
  initialBrandingBannerVerticalImage = '';
  initialBrandingBannerHorizontalImage = '';
  initialBrandingBannerHorizontalSplitImage = '';
  validationToast = false;
  publishFailToast = false;
  publishSuccessToast = false;
  somethingWrongToast = false;

  @ViewChild('announcement') announcement!: ElementRef;
  @ViewChild('mobAnnouncement') mobAnnouncement!: ElementRef;

  // eslint-disable-next-line max-params
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private service: BrandingSettingService,
    private commonUtils: CommonUtils,
    private dialogService: DialogService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.service.initializeData();
    await this.initForm();
    this.initMobForm();
    this.showCharacterLeft();
    this.initLengthTextChange();
    this.initFormChanges();
    // this.setMobBannerDimension("fullScreen");
  }

  /**
   * Function to initialize banner form
   */
  private async initForm(): Promise<void> {
    this.formInitialValues = this.service.getWholeConfiguration();
    this.form = this.formBuilder.group({
      bannerType: [this.formInitialValues.bannerType, Validators.required],
      header: [
        this.formInitialValues.headerText,
        [
          Validators.required,
          Validators.maxLength(25),
          CustomValidator.blankSpace
        ]
      ],
      screenDuration: [this.formInitialValues.screenDuration, Validators.required],
      greetings: [
        this.formInitialValues.greetingsText,
        [
          Validators.required,
          Validators.maxLength(60),
          CustomValidator.blankSpace
        ]
      ],
      announcementActive: [this.formInitialValues.announcementStatus],
      announcement: [
        {
          value: this.formInitialValues.announcementStatus ? this.formInitialValues.announcementMessage : '',
          disabled: !this.formInitialValues.announcementStatus
        }
      ],
      displayLogo: [this.formInitialValues.poweredByUnextLogo]
    });
    this.formInitialValues.announcementStatus ? this.form.controls['announcement'].enable() : this.form.controls['announcement'].disable();
    if (this.formInitialValues.announcementStatus) {
      this.setAnnouncementValidator();
    }
    this.setWebBannerDimension(this.formInitialValues.bannerType);
    this.initialBrandingBannerVerticalImage = this.formInitialValues.brandingBannerVerticalImage;
    this.initialBrandingBannerHorizontalImage = this.formInitialValues.brandingBannerHorizontalImage;
    this.initialBrandingBannerHorizontalSplitImage = this.formInitialValues.brandingBannerHorizontalSplitImage;
    /* istanbul ignore else*/
    if (this.formInitialValues[this.imageSaveType + '_URL'].default !== true) {
      this.showWebEditBranding = true;
    }
  }

  /**
   * Initialize mobile settings form
   */
  initMobForm(): void {
    this.mobForm = this.formBuilder.group({
      mobBannerType: ['fullScreen', Validators.required],
      mobHeader: [null,
        [
          Validators.required,
          Validators.maxLength(25)
        ]
      ],
      mobScreenDuration: ['', Validators.required],
      mobGreetings: [null,
        [
          Validators.required,
          Validators.maxLength(60)
        ]
      ],
      mobAnnouncementActive: [0],
      mobAnnouncement: [''],
      mobDisplayLogo: [1]
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  getWebBrandingImageUrl(type: string): string {
    let url = '';
    switch (type) {
      case 'vertical':
        url = this.formInitialValues.brandingBannerVerticalImage;
        break;
      case 'horizontal':
        url = this.formInitialValues.brandingBannerHorizontalImage;
        break;
      case 'horizontalSplit':
        url = this.formInitialValues.brandingBannerHorizontalSplitImage;
        break;
    }
    return url;
  }

  /**
   *
   * @param type Function to set banner dimension for web
   */
  private async setWebBannerDimension(type: string) {
    this.brandingImageSrc = this.brandingOriginalImageSrc = this.getWebBrandingImageUrl(type);
    switch (type) {
      case 'vertical':
        this.brandingWebWidth = this.brandingVerticalWidth;
        this.brandingWebHeight = this.brandingVerticalHeight;
        this.imageSaveType = 'brandingBannerVerticalImage';
        this.imageText = 'admin.loginSettings.webVerticalImageText';
        break;
      case 'horizontal':
        this.brandingWebWidth = this.brandingHorizontalWidth;
        this.brandingWebHeight = this.brandingHorizontalHeight;
        this.imageSaveType = 'brandingBannerHorizontalImage';
        this.imageText = 'admin.loginSettings.webHorizontalImageText';
        break;
      case 'horizontalSplit':
        this.brandingWebWidth = this.brandingHorizontalSplitWidth;
        this.brandingWebHeight = this.brandingHorizontalSplitHeight;
        this.imageSaveType = 'brandingBannerHorizontalSplitImage';
        this.imageText = 'admin.loginSettings.webHorizontalSplitImageText';
        break;
    }
  }

  /**
   * Function to set banner dimension for mobile
   * @param type
   */
  // private setMobBannerDimension(type: string) {
  //   switch (type) {
  //     case 'fullScreen':
  //       this.brandingMobWidth = this.webBrandingFullWidth;
  //       this.brandingMobHeight = this.webBrandingFullHeight;
  //       break;
  //     case 'horizontalSplit':
  //       this.brandingMobWidth = this.webBrandingHorizontalSplitWidth;
  //       this.brandingMobHeight = this.webBrandingHorizontalSplitHeight;
  //       break;
  //   }
  // }

  /**
   * Function will trigger action for some form element changes
   */
  private initFormChanges() {
    const announcementActive = this.form.get('announcementActive');
    /* istanbul ignore else*/
    if (announcementActive) {
      announcementActive.valueChanges.subscribe(val => {
        this.form.patchValue({
          announcement: ''
        });
        if (val === true) {
          this.form.controls['announcement'].enable();
          this.setAnnouncementValidator();
        } else {
          this.form.controls['announcement'].disable();
          this.unsetAnnouncementValidator();
          this.setDefaultCharLength('announcement');
        }
      });
    }

    // this.form.get('mobAnnouncementActive')?.valueChanges.subscribe(val => {
    //   if (val === true) {
    //     this.form.controls['mobAnnouncement'].enable();
    //   } else {
    //     this.form.controls['mobAnnouncement'].disable();
    //     this.mobAnnouncement.nativeElement.value = '';
    //     this.setDefaultCharLength('mobAnnouncement');
    //     this.mobForm.patchValue({
    //       mobAnnouncement: ''
    //     });
    //   }
    // });
    const bannerType = this.form.get('bannerType');
    /* istanbul ignore else*/
    if (bannerType) {
      bannerType.valueChanges.subscribe(type => {
        this.brandingImageSrc = '';
        this.showBrandingUpload = true;
        this.bannerSavedImage = '';
        this.bannerCroppedImage = '';
        setTimeout(() => {
          this.setWebBannerDimension(type);
        }, 10);
      });
    }
    // const mobBannerType = this.mobForm.get('mobBannerType') ?;
    // if (mobBannerType) {
    //   mobBannerType.valueChanges.subscribe((type: string) => {
    //     this.setMobBannerDimension(type);
    //   });
    // }
  }

  /**
   * Function will trigger when save the modal of logo image
   * @param event
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  brandingImageSaveHandler(event: any): void {
    if (event.cropped === '' || event.original === '') {
      this.bannerSavedImage = '';
      return;
    }
    this.brandingImageSrc = this.bannerCroppedImage = event.cropped;
    this.brandingOriginalImageSrc = event.original;
    this.showBrandingUpload = false;
    this.showWebEditBranding = true;
    this.bannerSavedImage = '';
  }

  /**
   * Function will trigger when save the modal of logo image
   * @param event
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  mobBrandingImageSaveHandler(event: any): void {
    this.mobBrandingImageSrc = event.cropped;
    this.mobBrandingOriginalImageSrc = event.original;
    this.showMobBrandingUpload = false;
  }

  /**
  * Function to show characters left in input fields while field value changes
  */
  private showCharacterLeft(): void {
    const header = this.form.get('header');
    /* istanbul ignore else*/
    if (header) {
      header.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.headerLengthMax, 'header');
      });
    }
    const greetings = this.form.get('greetings');
    /* istanbul ignore else*/
    if (greetings) {
      greetings.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.greetingsLengthMax, 'greetings');
      });
    }
    const announcement = this.form.get('announcement');
    /* istanbul ignore else*/
    if (announcement) {
      announcement.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.announcementLengthMax, 'announcement');
      });
    }

    // this.form.get('mobHeader')?.valueChanges.subscribe(val => {
    //   this.setCharacterLeftText(val, this.mobHeaderLengthMax, 'mobHeader');
    // });
    // this.form.get('mobGreetings')?.valueChanges.subscribe(val => {
    //   this.setCharacterLeftText(val, this.mobGreetingsLengthMax, 'mobGreetings');
    // });
    // this.form.get('mobAnnouncement')?.valueChanges.subscribe(val => {
    //   this.setCharacterLeftText(val, this.mobAnnouncementLengthMax, 'mobAnnouncement');
    // });
  }

  /**
   *Function to set the character left text
  * @param text string
  * @param maxLength number
  * @param type string
  * @returns void
  */
  private setCharacterLeftText(text = '', maxLength: number, type: string): void {
    text = this.commonUtils.removeHTML(text);
    if (text === '' || text === null) {
      this.setDefaultCharLength(type);
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    let translationKey = 'admin.brandingSettings.charactersLeft';
    if (charLeft <= 1) {
      translationKey = 'admin.brandingSettings.characterLeft';
    }
    this.translate.get(translationKey, { length: charLeft }).subscribe((res: string) => {
      switch (type) {
        case 'header':
          this.headerLengthText = res;
          break;
        case 'greetings':
          this.greetingsLengthText = res;
          break;
        case 'announcement':
          this.announcementLengthText = res;
          break;
        // case 'mobHeader':
        //   this.mobHeaderLengthText = res;
        //   break;
        // case 'mobGreetings':
        //   this.mobGreetingsLengthText = res;
        //   break;
        // case 'mobAnnouncement':
        //   this.mobAnnouncementLengthText = res;
        //   break;
      }
    });
  }

  /**
   * Function to show the default character left messages
   * @param type string
   */
  private setDefaultCharLength(type: string): void {
    switch (type) {
      case 'header':
        this.translate.get('admin.brandingSettings.maxOfCharacter', { length: this.headerLengthMax }).subscribe((res: string) => {
          this.headerLengthText = res;
        });
        break;
      case 'greetings':
        this.translate.get('admin.brandingSettings.maxOfCharacter', { length: this.greetingsLengthMax }).subscribe((res: string) => {
          this.greetingsLengthText = res;
        });
        break;
      case 'announcement':
        this.translate.get('admin.brandingSettings.maxOfCharacter', { length: this.announcementLengthMax }).subscribe((res: string) => {
          this.announcementLengthText = res;
        });
        break;
      // case 'mobHeader':
      //   this.translate.get('admin.brandingSettings.mobMaxOfCharacter', { length: this.mobHeaderLengthMax }).subscribe((res: string) => {
      //     this.mobHeaderLengthText = res;
      //   });
      //   break;
      // case 'mobGreetings':
      //   this.translate.get('admin.brandingSettings.mobMaxOfCharacter', { length: this.mobGreetingsLengthMax }).subscribe((res: string) => {
      //     this.mobGreetingsLengthText = res;
      //   });
      //   break;
      // case 'mobAnnouncement':
      //   this.translate.get('admin.brandingSettings.mobMaxOfCharacter', { length: this.mobAnnouncementLengthMax }).subscribe((res: string) => {
      //     this.mobAnnouncementLengthText = res;
      //   });
      //   break;
    }
  }

  /**
   * Set the character left message after initialize the form
   */
  private async initLengthTextChange(): Promise<void> {
    const formVals = this.form.value;
    this.setCharacterLeftText(formVals.header, this.headerLengthMax, 'header');
    this.setCharacterLeftText(formVals.greetings, this.greetingsLengthMax, 'greetings');
    this.setCharacterLeftText(formVals.announcement, this.announcementLengthMax, 'announcement');
    this.setCharacterLeftText(formVals.header, this.mobHeaderLengthMax, 'mobHeader');
    this.setCharacterLeftText(formVals.greetings, this.mobGreetingsLengthMax, 'mobGreetings');
    this.setCharacterLeftText(formVals.announcement, this.mobAnnouncementLengthMax, 'mobAnnouncement');
  }

  async webBannerDeleteConfirm(): Promise<void> {
    const dialog: Dialog = {title: {translationKey: "admin.brandingSettings.webBannerDeleteConfirm"}};
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res) {
      if (this.bannerCroppedImage !== '') {
        this.setInitialImage();
        this.showBrandingUpload = true;
        this.bannerCroppedImage = '';
        this.showWebEditBranding = false;
      } else {
        const result = await this.service.deleteImage(this.imageSaveType);
        /* istanbul ignore else*/
        if (result) {
          this.reloadPage();
        }
      }
    }
  }

  private setInitialImage() {
    switch (this.imageSaveType) {
      case 'brandingBannerVerticalImage':
        this.brandingImageSrc = this.initialBrandingBannerVerticalImage;
        break;
      case 'brandingBannerHorizontalImage':
        this.brandingImageSrc = this.initialBrandingBannerHorizontalImage;
        break;
      case 'brandingBannerHorizontalSplitImage':
        this.brandingImageSrc = this.initialBrandingBannerHorizontalSplitImage;
        break;
    }
  }

  /**
   * Function to show the edit banner modal
   */
  editWebBannerImage(): void {
    this.bannerSavedImage = this.brandingOriginalImageSrc;
  }

  /**
   * Function to show the image upload area
   */
  uploadNewWebBannerImage(): void {
    this.showBrandingUpload = true;
  }

  /**
   * Function will trigger when click on preview button
   */
  async showPreview(): Promise<void> {
    this.form.get('announcement')?.touched;
    this.form.controls.markAsTouched;
    if (this.form.invalid === true) {
      this.validationToast = true;
      return;
    }
    await this.generatePreviewObject();
    this.showPreviewComponent = true;
  }

  /**
   * Function to create the object of form data to show preview page
   * @returns PreviewObject
   */
  private async generatePreviewObject(): Promise<void> {
    const formValues = this.form.value;
    this.service.set('bannerType', formValues.bannerType);
    this.service.set('headerText', formValues.header);
    this.service.set('screenDuration', formValues.screenDuration);
    this.service.set('greetingsText', formValues.greetings);
    this.service.set('announcementStatus', formValues.announcementActive);
    this.service.set('announcementMessage', formValues.announcementActive ? formValues.announcement as string : '');
    this.service.set('poweredByUnextLogo', formValues.displayLogo);
    if (this.bannerCroppedImage) {
      this.service.set(this.imageSaveType, this.bannerCroppedImage);
    }
  }

  /**
   * Function to save the page settings
   */
  async saveSettings(event: string): Promise<void> {
    if (this.saveCalled) {
      return;
    }
    this.saveCalled = true;
    switch (event) {
      case 'back':
        this.showPreviewComponent = false;
        this.saveCalled = false;
        break;
      case 'publish':
        try {
          await this.generatePreviewObject();
          if (this.bannerCroppedImage) {
            const image = this.bannerCroppedImage.split(',')[1].trim();
            await this.service.updateImage(this.imageSaveType, image);
          }
          this.bannerCroppedImage = '';
          // eslint-disable-next-line no-case-declarations
          const published = await this.service.publish();
          this.showPreviewComponent = false;
          this.saveCalled = false;
          if (published) {
            this.publishSuccessToast = true;
            this.reloadPage();
            return;
          }
          this.publishFailToast = true;
        } catch (error) {
          this.somethingWrongToast = true;
          this.showPreviewComponent = false;
          this.saveCalled = false;
        }
        break;
    }
  }

  reloadPage(): void {
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href;
  }

  /**
   * Function to show confirmation while clear the form changes
   */
  async clearChangesConfirm(): Promise<void> {
    const dialog: Dialog = {title: {translationKey: "admin.brandingSettings.confirmFormClear"}};
    const status = await this.dialogService.showConfirmDialog(dialog);
    if (status) {
      this.resetForm();
    }
  }

  /**
   * Function to reset the form
   */
  private resetForm(): void {
    this.initForm();
    this.showBrandingUpload = true;
    this.bannerCroppedImage = '';
  }

  private setAnnouncementValidator() {
    this.form.controls['announcement'].setValidators([Validators.required]);
  }

  private unsetAnnouncementValidator() {
    this.form.controls['announcement'].setValidators([]);
  }

  closeToast(): void {
    this.validationToast = false;
    this.publishFailToast = false;
    this.publishSuccessToast = false;
    this.somethingWrongToast = false;
  }

  isFormValid(): boolean {
    if (this.form.invalid === true || (this.form.controls['announcementActive'].value && this.form.controls['announcement'].value.trim() === '')) {
      return false;
    }
    return true;
  }

}
