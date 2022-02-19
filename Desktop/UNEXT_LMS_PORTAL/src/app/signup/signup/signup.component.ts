import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchPasswordValidator } from '../password-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signupGroup = {} as any;
  signupForm!: FormGroup;

  formConfig = [
    {
      name: 'username',
      label: 'signup.username',
      value: '',
      type: 'text',
      id: 'username',
      inputType: 'input',
      required: 'true',
      validators: [Validators.required]
    },
    {
      name: 'email',
      label: 'signup.email',
      value: '',
      type: 'text',
      id: 'email',
      inputType: 'input',
      required: 'true',
      validators: [Validators.required]
    },
    {
      name: 'password',
      label: 'signup.password',
      value: '',
      type: 'password',
      id: 'password',
      inputType: 'input',
      required: 'true',
      validators: [Validators.required]
    },
    {
      name: 'reEnterPassword',
      label: 'signup.reenterPassword',
      value: '',
      type: 'text',
      id: 'reEnterPassword',
      inputType: 'input',
      required: 'true',
      validators: [Validators.required]
    },
    {
      name: 'gender',
      label: 'signup.gender',
      type: 'radio',
      inputType: 'input',
      options: [
        {
          id: 'male',
          label: 'signup.male',
          value: 'male'
        },
        {
          id: 'female',
          label: 'signup.female',
          value: 'female'
        }
      ]
    }
  ]
  constructor(private router: Router) { }

  ngOnInit(): void {
    for (const config of this.formConfig) {
      this.signupGroup[config.name] = new FormControl(config.value || '', config.validators);
    }
    this.signupForm = new FormGroup(this.signupGroup);
    this.signupForm.setValidators(MatchPasswordValidator('password', 'reEnterPassword'));
  }
  async onSubmit(): Promise<void> {
    this.router.navigate(['login']);
  }
  async goToLogin(): Promise<void> {
    this.router.navigate(['login']);
  }
}
