import { AfterViewInit, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Note, NotesService } from '../../services/note.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReversePipe } from '../../../shared/pipes/reverse.pipe';

@Component({
  selector: 'app-note-list',
  standalone: true,
  templateUrl: './note-list.component.html',
  styles: ``,
  imports: [RouterLink, ReactiveFormsModule, ReversePipe],
})
export default class NoteListComponent implements AfterViewInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  private toastr = inject(ToastrService);

  public notesService = inject(NotesService);
  public toggleNote = false;
  public userSession: string | undefined = '';

  public noteSelected: Note | null = null;

  form = this._formBuilder.group({
    title: this._formBuilder.control('', [Validators.required]),
    note: this._formBuilder.control(''),
    isImportant: this._formBuilder.control(false),
  });

  async session() {
    const { data } = await this._authService.session();
    this.userSession = data.session?.user.email;
  }

  async logOut() {
    await this._authService.singOut();
    this._router.navigateByUrl('/auth/log-in');
  }

  ngAfterViewInit(): void {
    this.notesService.getAllNotes();
    this.session();
  }

  newNote() {
    if (this.form.invalid) {
      this.toastr.error('Escribe un titulo a la nota', '¡Error!', {
        progressBar: true,
        progressAnimation: 'decreasing',
        closeButton: true,
      });
      return;
    }
    if (this.noteSelected) {
      this.notesService.updateNote({
        id: this.noteSelected.id,
        title: this.form.value.title ?? '',
        note: this.form.value.note ?? '',
        isImportant: this.form.value.isImportant!,
      });
      this.toastr.success('¡Nota actualizada con exito!', '', {
        progressBar: true,
        progressAnimation: 'decreasing',
        closeButton: true,
        timeOut: 3000,
      });
    } else {
      this.notesService.insertNote({
        title: this.form.value.title ?? '',
        note: this.form.value.note ?? '',
        isImportant: this.form.value.isImportant!,
      });
      this.toastr.success('¡Nota creada con exito!', '', {
        progressBar: true,
        progressAnimation: 'decreasing',
        closeButton: true,
        timeOut: 3000,
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
    this.toastr.success('¡Nota borrada con exito!', '', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000,
    });
  }
}
