import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info' | null;
  message: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  alertComponent: Alert = {
    type: null,
    message: null,
  };
  private _router = inject(Router);
  setAlert(type: Alert['type'], message: Alert['message'], time: number) {
    this.alertComponent = {
      type: type,
      message: message,
    };
    if (type === 'success') {
      setTimeout(() => {
        this.alertComponent = {
          type: null,
          message: null,
        };
        // this._router.navigateByUrl('/');
      }, time);
    }

    setTimeout(() => {
      this.alertComponent = {
        type: null,
        message: null,
      };
    }, time);
  }
}
