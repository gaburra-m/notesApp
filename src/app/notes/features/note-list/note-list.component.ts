import { AfterViewInit, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NotesService } from '../../data-access/note.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './note-list.component.html',
  styles: ``,
})
export default class NoteListComponent implements AfterViewInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  public notesService = inject(NotesService);
  public toggleNote = false;

  form = this._formBuilder.group({
    title: this._formBuilder.control(null, [Validators.required]),
    note: this._formBuilder.control(null),
    isImportant: this._formBuilder.control(null),
  });

  async logOut() {
    await this._authService.singOut();
    this._router.navigateByUrl('/auth/log-in');
  }

  ngAfterViewInit(): void {
    this.notesService.getAllNotes();
  }

  newNote() {
    if (this.form.invalid) return;
    this.notesService.insertNote({
      title: this.form.value.title ?? '',
      note: this.form.value.note ?? '',
      isImportant: this.form.value.isImportant!,
    });
    this.toggleNote = !this.toggleNote;
  }

  toggleNewNote() {
    this.toggleNote = !this.toggleNote;
    console.log(this.toggleNote);
  }
}
