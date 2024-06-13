import { AfterViewInit, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Note, NotesService } from '../../data-access/note.service';
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

  public noteSelected: Note | null = null;

  form = this._formBuilder.group({
    title: this._formBuilder.control('', [Validators.required]),
    note: this._formBuilder.control(''),
    isImportant: this._formBuilder.control(false),
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
    if (this.noteSelected) {
      this.notesService.updateNote({
        id: this.noteSelected.id,
        title: this.form.value.title ?? '',
        note: this.form.value.note ?? '',
        isImportant: this.form.value.isImportant!,
      });
    } else {
      this.notesService.insertNote({
        title: this.form.value.title ?? '',
        note: this.form.value.note ?? '',
        isImportant: this.form.value.isImportant!,
      });
    }
    this.toggleNote = !this.toggleNote;
    this.form.reset();
    this.noteSelected = null;
  }

  toggleNewNote() {
    this.toggleNote = !this.toggleNote;
    this.form.reset();
    this.noteSelected = null;
  }

  editNote(note: Note) {
    this.noteSelected = note;
    this.toggleNote = true;
    this.form.setValue({
      title: this.noteSelected?.title,
      note: this.noteSelected?.note,
      isImportant: this.noteSelected?.isImportant,
    });
  }

  deleteNote(note: Note) {
    this.notesService.deleteNote(note.id);
  }
}
