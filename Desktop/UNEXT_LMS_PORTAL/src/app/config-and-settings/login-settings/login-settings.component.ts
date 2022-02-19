import { CommonUtils } from './../../utils/common-utils';
import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { CommonService } from 'src/app/services/common.service';
import { LoginSettingService } from 'src/app/services/login.setting.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Dialog } from 'src/app/Models/Dialog';
@Component({
  selector: 'app-login-settings',
  templateUrl: './login-settings.component.html',
  styleUrls: ['./login-settings.component.scss']
})
export class LoginSettingsComponent implements OnInit {

  form = new FormGroup({
    header: new FormControl(''),
    logoUrl: new FormControl(''),
    logoRedirectUrl: new FormControl(''),
    welcomeText: new FormControl(''),
    ssoText: new FormControl(''),
    supportText: new FormControl(''),
    poweredByUnextLogo: new FormControl(false)
  });
  logoImageSrc = '';
  croppedLogo = '';
  logoOriginalImageSrc = '';
  logoFileType = 'image';
  logoAcceptedFiles = 'image/jpg, image/jpeg, image/img, image/png';
  logoOutputWidth = 168;
  logoOutputHeight = 52;
  logoSavedImage = "";
  showLogoUpload = true;
  showEditLogo = false;
  initialLogo = '';

  bannerImageSrc = '';
  croppedBanner = '';
  bannerOriginalImageSrc = '';
  bannerFileType = 'image';
  bannerAcceptedFiles = 'image/jpg, image/jpeg, image/img, image/png';
  bannerOutputWidth = 1008;
  bannerOutputHeight = 588;
  bannerSavedImage = "";
  showBannerUpload = true;
  showEditBanner = false;
  initialBanner = '';

  headerTextLengthMax = 160;
  welcomeTextLengthMax = 120;
  ssoTextLengthMax = 120;
  supportTextLengthMax = 250;
  headerLengthText = '';
  welcomeLengthText = '';
  ssoLengthText = '';
  supportLengthText = '';
  showPreviewComponent = false;
  saveCalled = false;
  formLoaded = false;
  validationToast = false;
  publishFailToast = false;
  publishSuccessToast = false;
  somethingWrongToast = false;

  // eslint-disable-next-line max-params
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private service: LoginSettingService,
    private commonService: CommonService,
    private commonUtils: CommonUtils,
    private dialogService: DialogService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,

  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.service.initializeData();
    await this.initForm();
  }

  /**
   * Function to initialize the form
   */
  // eslint-disable-next-line max-lines-per-function
  private async initForm(): Promise<void> {
    const formInitialValues = this.service.getWholeConfiguration();
    this.form = this.formBuilder.group({
      header: [
        formInitialValues.headerText,
        [
          Validators.required,
          CustomValidator.blankSpace,
          CustomValidator.maxCharsWithoutHtml(160, {maxLengtherror: true})
        ]
      ],
      logoUrl: [
        formInitialValues.logoImage_URL,
        [
          Validators.required,
          CustomValidator.blankSpace,
        ]
      ],
      logoRedirectUrl: [
        formInitialValues.logoRedirectUrl,
        [
          Validators.required,
          CustomValidator.blankSpace,
          CustomValidator.url
        ]
      ],
      welcomeText: [
        formInitialValues.welcomeText, [
          Validators.required,
          CustomValidator.blankSpace,
          CustomValidator.maxCharsWithoutHtml(120, {maxLengtherror: true})
        ]
      ],
      ssoText: [
        formInitialValues.ssoText,
        CustomValidator.maxCharsWithoutHtml(120, {maxLengtherror: true})
      ],
      supportText: [
        formInitialValues.supportText,
        CustomValidator.maxCharsWithoutHtml(250, {maxLengtherror: true})
      ],
      poweredByUnextLogo: [formInitialValues.poweredByUnextLogo]
    });
    this.logoImageSrc = this.logoOriginalImageSrc = this.initialLogo = formInitialValues.logoImageUrl;
    this.bannerImageSrc = this.bannerOriginalImageSrc = this.initialBanner = formInitialValues.bannerImageUrl;
    this.showCharacterLeft();
    this.initLengthTextChange();
    this.formLoaded = true;
    if (formInitialValues.logoImage_URL.default !== true) {
      this.showEditLogo = true;
    }
    if (formInitialValues.loginBannerImage_URL.default !== true) {
      this.showEditBanner = true;
    }
  }

  /**
   * Function will trigger when save the modal of logo image
   * @param event
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  logoFileSaveHandler(event: any): boolean {
    if (event.cropped === '' || event.original === '') {
      this.logoSavedImage = '';
      return false;
    }
    this.logoImageSrc = this.croppedLogo = event.cropped;
    this.logoOriginalImageSrc = event.original;
    this.showLogoUpload = false;
    this.showEditLogo = true;
    this.logoSavedImage = '';
    return true;
  }

  /**
   * Function will trigger when save the banner image modal
   * @param event
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  bannerFileSaveHandler(event: any): boolean {
    if (event.cropped === '' || event.original === '') {
      this.bannerSavedImage = '';
      return false;
    }
    this.bannerImageSrc = this.croppedBanner = event.cropped;
    this.bannerOriginalImageSrc = event.original;
    this.showBannerUpload = false;
    this.showEditBanner = true;
    this.bannerSavedImage = '';
    return true;
  }

  /**
   * Function will trigger when click on preview button
   */
  async showPreview(): Promise<void> {
    if (this.form.invalid === true) {
      this.validationToast = true;
      return;
    }
    await this.generatePreviewObject();
    this.showPreviewComponent = true;
    this.renderer.addClass(this.document.body, 'stop-body-scroll');
  }

  /**
   * Function to create the object of form data to show preview page
   * @returns PreviewObject
   */
  private async generatePreviewObject(): Promise<void> {
    const formValues = this.form.value;
    this.service.set('headerText', formValues.header);
    this.service.set('logoRedirectUrl', formValues.logoRedirectUrl);
    this.service.set('logoOnHover', formValues.logoRedirectUrl);
    this.service.set('welcomeText', formValues.welcomeText);
    this.service.set('ssoText', (formValues.ssoText ? formValues.ssoText : ''));
    this.service.set('supportText', (formValues.supportText ? formValues.supportText : ''));
    this.service.set('poweredByUnextLogo', formValues.poweredByUnextLogo || false);
    if (this.croppedLogo) {
      this.service.set('logoImageUrl', this.croppedLogo);
    }
    if (this.croppedBanner) {
      this.service.set('bannerImageUrl', this.croppedBanner);
    }
  }

  /**
   * Function to show characters left in input fields while field value changes
   */
  private showCharacterLeft(): void {
    const header = this.form.get('header');
    /* istanbul ignore else*/
    if (header) {
      header.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.headerTextLengthMax, 'header');
      });
    }
    const welcomeText = this.form.get('welcomeText');
    /* istanbul ignore else*/
    if (welcomeText) {
      welcomeText.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.welcomeTextLengthMax, 'welcome');
      });
    }
    const ssoText = this.form.get('ssoText');
    /* istanbul ignore else*/
    if (ssoText) {
      ssoText.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.ssoTextLengthMax, 'sso');
      });
    }
    const supportText = this.form.get('supportText');
    /* istanbul ignore else*/
    if (supportText) {
      supportText.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.supportTextLengthMax, 'support');
      });
    }
  }

  /**
   * Set the character left message after initialize the form
   */
  private async initLengthTextChange(): Promise<void> {
    const formVals = this.form.value;
    this.setCharacterLeftText(formVals.header, this.headerTextLengthMax, 'header');
    this.setCharacterLeftText(formVals.welcomeText, this.welcomeTextLengthMax, 'welcome');
    this.setCharacterLeftText(formVals.ssoText, this.ssoTextLengthMax, 'sso');
    this.setCharacterLeftText(formVals.supportText, this.supportTextLengthMax, 'support');
  }

  /**
   *Function to set the character left text
   * @param text string
   * @param maxLength number
   * @param type string
   * @returns void
   */
  private setCharacterLeftText(text: string, maxLength: number, type: string): void {
    text = this.commonUtils.removeHTML(text);
    if (text === '' || text === null) {
      this.setDefaultCharLength(type);
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    let translationKey = 'admin.loginSettings.charactersLeft';
    if (charLeft <= 1) {
      translationKey = 'admin.loginSettings.characterLeft';
    }
    this.translate.get(translationKey, { length: charLeft }).subscribe((res: string) => {
      switch (type) {
        case 'header':
          this.headerLengthText = res;
          break;
        case 'welcome':
          this.welcomeLengthText = res;
          break;
        case 'sso':
          this.ssoLengthText = res;
          break;
        case 'support':
          this.supportLengthText = res;
          break;
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
        this.translate.get('admin.loginSettings.maxOfCharacter', { length: this.headerTextLengthMax }).subscribe((res: string) => {
          this.headerLengthText = res;
        });
        break;
      case 'welcome':
        this.translate.get('admin.loginSettings.maxOfCharacter', { length: this.welcomeTextLengthMax }).subscribe((res: string) => {
          this.welcomeLengthText = res;
        });
        break;
      case 'sso':
        this.translate.get('admin.loginSettings.maxOfCharacter', { length: this.ssoTextLengthMax }).subscribe((res: string) => {
          this.ssoLengthText = res;
        });
        break;
      case 'support':
        this.translate.get('admin.loginSettings.maxOfCharacter', { length: this.supportTextLengthMax }).subscribe((res: string) => {
          this.supportLengthText = res;
        });
        break;
    }
  }

  /**
   * Function save the settings
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
          if (this.croppedLogo) {
            const croppedImg = this.croppedLogo.split(',')[1].trim();
            await this.service.updateImage('logoImage', croppedImg);
          }
          if (this.croppedBanner) {
            const croppedImg = this.croppedBanner.split(',')[1].trim();
            await this.service.updateImage('loginBannerImage', croppedImg);
          }
          this.croppedLogo = '';
          this.croppedBanner = '';
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
          this.showPreviewComponent = false;
          this.saveCalled = false;
          this.somethingWrongToast = true;
        }
        break;
    }
  }

  reloadPage(): void {
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href;
  }

  /**
   * Function to show the confirmation while delete logo
   */
  async logoDeleteConfirm(): Promise<void> {
    const dialog: Dialog = {title: {translationKey: "admin.loginSettings.logoDeleteConfirm"}};
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res) {
      if (this.croppedLogo !== '') {
        this.croppedLogo = '';
        this.logoImageSrc = this.initialLogo;
        this.showLogoUpload = true;
        this.showEditLogo = false;
      } else {
        const result = await this.service.deleteImage('logoImage');
        if (result) {
          this.reloadPage();
        }
      }

    }
  }

  /**
   * Function to show confirmation while delete banner
   */
  async bannerDeleteConfirm(): Promise<void> {
    const dialog: Dialog = {title: {translationKey: "admin.loginSettings.bannerDeleteConfirm"}};
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res === true) {
      if (this.croppedBanner !== '') {
        this.croppedBanner = '';
        this.bannerImageSrc = this.initialBanner;
        this.showBannerUpload = true;
        this.showEditBanner = false;
      } else {
        const result = await this.service.deleteImage('loginBannerImage');
        if (result) {
          this.reloadPage();
        }
      }

    }
  }

  /**
   * Function to show the edit logo modal
   */
  editLogoImage(): void {
    this.logoSavedImage = this.logoOriginalImageSrc;
  }

  /**
   * Function to show the edit banner modal
   */
  editBannerImage(): void {
    this.bannerSavedImage = this.bannerOriginalImageSrc;
  }

  /**
   * Function to show the upload logo area
   */
  uploadNewLogo(): void {
    this.showLogoUpload = true;
  }

  /**
   * Function to show the upload logo area
   */
  uploadNewBanner(): void {
    this.showBannerUpload = true;
  }

  /**
   * Function to show confirmation while clear the form changes
   */
  async clearChangesConfirm(): Promise<void> {
    const dialog: Dialog = {title: {translationKey: "admin.loginSettings.confirmFormClear"}};
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res) {
      this.resetForm();
    }
  }

  /**
   * Function to reset the form
   */
  private resetForm(): void {
    this.initForm();
    this.showLogoUpload = true;
    this.showBannerUpload = true;
    this.croppedLogo = '';
    this.croppedBanner = '';
  }

  closeToast(): void {
    this.validationToast = false;
    this.publishFailToast = false;
    this.publishSuccessToast = false;
    this.somethingWrongToast = false;
  }

}
