import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './auth-sign-up.component.html',
  styles: ``,
})
export default class AuthSignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);

  form = this._formBuilder.group<SignUpForm>({
    email: this._formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const authResponse = await this._authService.sigUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });

      if (authResponse.error) throw authResponse.error;
    } catch (error) {
      console.error(error);
    }
  }
}
