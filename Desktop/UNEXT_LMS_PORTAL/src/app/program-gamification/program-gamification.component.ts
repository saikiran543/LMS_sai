/* eslint-disable max-lines-per-function */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-program-gamification',
  templateUrl: './program-gamification.component.html',
  styleUrls: ['./program-gamification.component.scss']
})
export class ProgramGamificationComponent implements OnInit {
  // validateError(arg0: AbstractControl | null | undefined, arg1: AbstractControl | null | undefined, arg2: boolean) {
  //   throw new Error('Method not implemented.');
  // }

  programConfig = {

    badgeConfig: {
      platinum: { min: 90, max: 100 },
      gold: { min: 50, max: 90 },
      silver: { min: 40, max: 50 },
      bronze: { min: 0, max: 40 }

    },
    courseWeightageConfig: [{
      courseName: 'a1',
      weightage: 50
    },
    {
      courseName: 'b1',
      weightage: 50
    }]
  }
  programConfigForm: any;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private formBuilder: FormBuilder) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.programConfigForm = this.createRoleInfoForm(this.programConfig);
  }
  createRoleInfoForm(roleForm: any) {
    const { ...formControls } = this.createCriteriaFormGroup(roleForm);

    return this.formBuilder.group({
      ...formControls,
    });
  }
  createCriteriaFormGroup(programConfig: any): any {
    const items = programConfig.badgeConfig;
    return {
      badges: this.formBuilder.group({
        platinum: this.formBuilder.group({
          min: [items.platinum.min, [Validators.required]],
          max: [items.platinum.max, [Validators.required]]
        }),
        gold: this.formBuilder.group({
          min: [items.gold.min, [Validators.required]],
          max: [items.gold.max, [Validators.required]]
        }),
        silver: this.formBuilder.group({
          min: [items.silver.min, [Validators.required]],
          max: [items.silver.max, [Validators.required]]
        }),
        bronze: this.formBuilder.group({
          min: [items.bronze.min, [Validators.required]],
          max: [items.bronze.max, [Validators.required]]
        })
      }, { validators: this.identityRevealedValidator.bind(this) }),
      courseWeightageConfig: this.createItem(programConfig.courseWeightageConfig)

    };
  }

  createItem(courseWeightageConfig: any): any {
    const form = this.formBuilder.array([]);
    courseWeightageConfig.forEach((element: any) => {
      form.push(this.createBuilder(element));
    });
    return form;
  }
  createBuilder(element: any): any {
    return this.formBuilder.group({
      courseName: [element.courseName],
      weightage: [
        element.weightage,
        [Validators.required, this.courseValidation()],
      ]
    });
  }

  courseValidation(): ValidatorFn {
    let total;
    return (control: AbstractControl): ValidationErrors | null => {
      const formControl = this.programConfigForm && this.programConfigForm.controls['courseWeightageConfig'] as FormArray;

      if (formControl) {
        total = 0;
        for (let i = 0; i < formControl.controls.length; i++) {
          formControl.controls[i].controls.weightage.setErrors(null);
          total += formControl.controls[i].controls.weightage.value;
        }
        if (total !== 100) {
          control.setErrors({ Validators: Validators.required });
          return { Validators: Validators.required };
        }

      }
      return null;
    };
  }
  // eslint-disable-next-line max-lines-per-function
  identityRevealedValidator(control: AbstractControl): ValidationErrors | null {
    const platinum = control.get('platinum');
    const silver = control.get('silver');
    const gold = control.get('gold');
    const bronze = control.get('bronze');
    if (platinum?.get('min')?.value >= platinum?.get('max')?.value) {
      this.validateError(platinum?.get('max'), platinum?.get('min'), true);
    } else if ((platinum?.get('min')?.value < platinum?.get('max')?.value)) {
      if (platinum?.get('min')?.value === gold?.get('max')?.value) {
        this.validateError(platinum?.get('max'), platinum?.get('min'), false);
      } else {
        platinum?.get('max')?.setErrors(null);
      }
    }

    if (gold?.get('max')?.value <= gold?.get('min')?.value) {
      this.validateError(gold?.get('max'), gold?.get('min'), true);
    } else if ((gold?.get('min')?.value < gold?.get('max')?.value)) {
      this.validateError(gold?.get('max'), silver?.get('max'), true);
      this.validateError(platinum?.get('min'), silver?.get('max'), true);
      if (platinum?.get('min')?.value === gold?.get('max')?.value) {
        this.validateError(gold?.get('max'), platinum?.get('min'), false);
      }
      if (silver?.get('max')?.value === gold?.get('min')?.value) {
        this.validateError(gold?.get('min'), silver?.get('max'), false);
      }
    }
    if (silver?.get('max')?.value <= silver?.get('min')?.value) {
      this.validateError(silver?.get('max'), silver?.get('min'), true);
    } else if ((silver?.get('min')?.value < silver?.get('max')?.value)) {
      this.validateError(silver?.get('max'), silver?.get('min'), true);
      this.validateError(gold?.get('min'), bronze?.get('max'), true);
      if (silver?.get('max')?.value === gold?.get('min')?.value) {
        this.validateError(gold?.get('min'), silver?.get('max'), false);
      }
      if (silver?.get('min')?.value === bronze?.get('max')?.value) {
        this.validateError(silver?.get('min'), bronze?.get('max'), false);
      }
    }
    if (bronze?.get('max')?.value <= bronze?.get('min')?.value) {
      this.validateError(bronze?.get('max'), bronze?.get('min'), true);
    } else if ((bronze?.get('min')?.value < bronze?.get('max')?.value)) {
      this.validateError(bronze?.get('max'), bronze?.get('min'), true);
      silver?.get('min')?.setErrors({ Validators: Validators.required });
      if (bronze?.get('max')?.value === silver?.get('min')?.value) {
        this.validateError(bronze?.get('max'), silver?.get('min'), false);
      }
      bronze?.get('min')?.setErrors(null);
    }
    // control
    return null;
  }

  validateError(max: any, min: any, type: boolean) {
    if (type) {
      max.markAsTouched();
      min.markAsTouched();
      max.setErrors({ Validators: Validators.required });
      min.setErrors({ Validators: Validators.required });
    }
    else {
      max.setErrors(null);
      min.setErrors(null);
    }
    // eslint-disable-next-line no-console
  }
  saveProgramgamification(form: FormGroup) {
    form.updateValueAndValidity();
    // form.markAsPristine();
    // form.markAsDirty();
    // form.markAsTouched();
    if (form.valid) {
      // eslint-disable-next-line no-console
      console.log('ff');
    }
  }

}
