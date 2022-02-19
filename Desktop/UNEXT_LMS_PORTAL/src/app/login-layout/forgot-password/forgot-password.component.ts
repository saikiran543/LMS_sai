/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  toastr = false;
  toastType = 'error'
  toastMessage = "";
  forgotPasswordErrorResponse = "";
  @ViewChild(ToastContainerDirective, { static: false })
  toastContainer!: ToastContainerDirective;
  constructor(private formBuilder: FormBuilder, private authenticate: AuthenticationService, private toastrService: ToastrService) { }

  // eslint-disable-next-line no-invalid-this
  forgotpasswordForm = this.formBuilder.group({
    usernameoremail: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
  }

  async forgotPassword(): Promise<void> {
    this.toastr = false;
    this.forgotPasswordErrorResponse = "";
    if (this.forgotpasswordForm.invalid) {
      this.forgotPasswordErrorResponse = "login.forgotPassword.emailOrUsernameIsRequired";
    } else {
      try {
        const result = await this.authenticate.forgotPassword(this.forgotpasswordForm.value.usernameoremail);
        this.forgotPasswordErrorResponse = "";
        this.toastr = true;
        this.toastType = "success";
        this.toastMessage = result.body.message;
        this.forgotpasswordForm.reset();
      } catch (error) {
        if (error.status === 401) {
          this.forgotPasswordErrorResponse = error.error;
        }
        this.forgotpasswordForm.reset();
      }
    }
  }

  closeToast(): void {
    this.toastr = false;
  }

}
