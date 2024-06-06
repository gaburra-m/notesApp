import { AfterViewInit, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NotesService } from '../../data-access/note.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './note-list.component.html',
  styles: ``,
})
export default class NoteListComponent implements AfterViewInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  public notesService = inject(NotesService);

  async logOut() {
    await this._authService.singOut();
    this._router.navigateByUrl('/auth/log-in');
  }

  ngAfterViewInit(): void {
    this.notesService.getAllNotes();
  }
}
