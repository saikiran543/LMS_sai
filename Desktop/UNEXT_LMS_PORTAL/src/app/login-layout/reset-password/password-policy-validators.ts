import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordPolicyValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static matchPasswordValidator(newPassword: string, confirmPassword: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[newPassword];
      const matchingControl = formGroup.controls[confirmPassword];
      if (matchingControl.errors && !matchingControl.errors.matchPasswordValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ matchPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
