import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { Alert, AlertService } from '../../../shared/services/alert.service';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}
// interface Alert {
//   type: 'success' | 'error' | 'warning' | 'info' | null;
//   message: string | null;
// }
@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  templateUrl: './auth-sign-up.component.html',
  styles: ``,
  imports: [RouterLink, ReactiveFormsModule, AlertComponent],
})
export default class AuthSignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _alertService = inject(AlertService);

  alertComponent: Alert = {
    type: null,
    message: null,
  };

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
      this._alertService.setAlert(
        'error',
        'La contraseña de ser de 6 o más caracteres',
        3000
      );
      this.alertComponent = this._alertService.alertComponent;
      return;
    }

    try {
      const authResponse = await this._authService.sigUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });

      // if (!authResponse.error) this._router.navigateByUrl('/auth/log-in');
      if (!authResponse.error) {
        this._alertService.setAlert(
          'success',
          'Registro realizado con exito, ya puede ingresar (se te va a redireccionar)',
          3000
        );
        this.alertComponent = this._alertService.alertComponent;
      }
      if (authResponse.error) throw authResponse.error;
    } catch (error) {
      this._alertService.setAlert(
        'error',
        'El correo ya esta en uso, intenta con otro',
        3000
      );
      this.alertComponent = this._alertService.alertComponent;
    }
  }

  // setAlert(type: Alert['type'], message: Alert['message'], time: number) {
  //   this.alertComponent = {
  //     type: type,
  //     message: message,
  //   };
  //   if (type === 'success') {
  //     setTimeout(() => {
  //       this.alertComponent = {
  //         type: null,
  //         message: null,
  //       };
  //       this._router.navigateByUrl('/');
  //     }, time);
  //   }

  //   setTimeout(() => {
  //     this.alertComponent = {
  //       type: null,
  //       message: null,
  //     };
  //   }, time);
  // }
}
