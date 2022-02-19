import { CommonUtils } from './../utils/common-utils';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface blankValidateReturn {
  blankSpaceValid: boolean
}

export interface numericValidateReturn {
  numericValid: boolean
}

export interface alphaNumericValidateReturn {
  alphaNumericValid: boolean
}

export interface urlValidateReturn {
  urlValid: boolean
}

export class CustomValidator {

  commonUtils = new CommonUtils()

  /**
   * Function to validate blank space
   * @param control
   * @returns
   */
  static blankSpace(control: AbstractControl): null | blankValidateReturn {
    const commonUtils = new CommonUtils();
    const value = commonUtils.removeHTML(control.value);
    if (value === null) {
      return { blankSpaceValid: true };
    }
    if (value.trim() === '') {
      return { blankSpaceValid: true };
    }
    return null;
  }

  /**
   * Function to validate numeric value
   * @param control
   * @returns
   */
  static numeric(control: AbstractControl): null | numericValidateReturn {
    const value = control.value;
    if (value.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) {
      return null;
    }
    return { numericValid: true };
  }
  /**
   * Function to validate apha numeric value
   * @param control
   * @returns
   */
  static alphaNumeric(control: AbstractControl): null | alphaNumericValidateReturn {
    const commonUtils = new CommonUtils();
    const value = commonUtils.removeHTML(control.value);
    if (!value) {
      return null;
    }
    if (value.toString().match(/^[a-zA-Z0-9\s\-_()?']+$/)) {
      return null;
    }
    return { alphaNumericValid: true };
  }

  /**
   * Function to validate url value
   * @param control
   * @returns
   */
  static url(control: AbstractControl): null | urlValidateReturn {
    const value = control.value;
    const regex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;
    if (!value) {
      return { urlValid: true };
    }
    if (value.toString().match(regex)) {
      return null;
    }
    return { urlValid: true };
  }
  static maxCharsWithoutHtml(maxLength: number, error: ValidationErrors): ValidatorFn{
    const commonUtils = new CommonUtils();
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value;
      value = commonUtils.removeHTML(value);
      return value.length < maxLength+1 ? null : error;
    };
  }

  static minLessThanOrEqualToMax(minAmount: string, maxAmount: string, error: ValidationErrors) {
    return (control:AbstractControl): ValidationErrors | null => {
      const form=control.parent;
      if (form) {
        const min=form.get(minAmount);
        const max=form.get(maxAmount);
        if(min && max) {
          return min.value && max.value && +max.value<=+min.value?error:null;
        }
      }
      return null;
    };
  }
}

