import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  templateUrl: './auth-sign-up.component.html',
  styles: ``,
  imports: [RouterLink, ReactiveFormsModule],
})
export default class AuthSignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private toastr = inject(ToastrService);
  // constructor(private toastr: ToastrService) {}

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
    if (this.form.invalid) {
      this.toastr.error('La contraseña de ser de 6 o más caracteres', '', {
        progressBar: true,
        progressAnimation: 'decreasing',
        closeButton: true,
      });
      return;
    }

    try {
      const authResponse = await this._authService.sigUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });

      if (!authResponse.error) {
        this.toastr.success(
          'Redirigiendo...',
          '¡Registro realizado con exito!',
          {
            progressBar: true,
            progressAnimation: 'decreasing',
            closeButton: true,
            timeOut: 3000,
          }
        );

        setTimeout(() => {
          this._router.navigateByUrl('/');
        }, 3000);
      }
      if (authResponse.error) throw authResponse.error;
    } catch (error) {
      this.toastr.error('El correo ya esta en uso, intenta con otro', '', {
        progressBar: true,
        progressAnimation: 'decreasing',
        closeButton: true,
      });
    }
  }
}
