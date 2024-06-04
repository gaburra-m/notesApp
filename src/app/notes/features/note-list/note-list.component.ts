import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [],
  templateUrl: './note-list.component.html',
  styles: ``,
})
export default class NoteListComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  async logOut() {
    await this._authService.singOut();
    this._router.navigateByUrl('/auth/log-in');
  }
}
