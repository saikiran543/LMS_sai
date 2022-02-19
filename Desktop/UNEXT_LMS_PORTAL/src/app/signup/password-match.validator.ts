import { FormGroup } from "@angular/forms";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function MatchPasswordValidator(password: string, reEnterUsername: string): any {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[password];
    const matchingControl = formGroup.controls[reEnterUsername];
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