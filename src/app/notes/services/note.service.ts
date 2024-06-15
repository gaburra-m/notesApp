import { Injectable, computed, inject, signal } from '@angular/core';
import { SupabaseService } from '../../shared/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';

interface NoteState {
  notes: Note[];
  loading: boolean;
  error: boolean;
}

export interface Note {
  id: string;
  title: string | null;
  note: string | null;
  isImportant: boolean;
  user_id: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private _authService = inject(AuthService);
  private _state = signal<NoteState>({
    notes: [],
    loading: false,
    error: false,
  });

  // selectors
  notes = computed(() => this._state().notes);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  async getAllNotes() {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
      }));
      const {
        data: { session },
      } = await this._authService.session();
      const { data } = await this._supabaseClient
        .from('notes')
        .select()
        .eq('user_id', session?.user.id)
        .returns<Note[]>();

      if (data) {
        this._state.update((state) => ({
          ...state,
          notes: data,
        }));
      }
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    } finally {
      this._state.update((state) => ({
        ...state,
        loading: false,
      }));
    }
  }

  async insertNote(note: {
    title: string;
    note: string | null;
    isImportant: boolean;
  }) {
    try {
      const {
        data: { session },
      } = await this._authService.session();
      await this._supabaseClient.from('notes').insert({
        user_id: session?.user.id,
        title: note.title,
        note: note.note,
        isImportant: note.isImportant,
      });

      this.getAllNotes();
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }

  async updateNote(note: {
    id: string;
    title: string;
    note: string | null;
    isImportant: boolean;
  }) {
    try {
      await this._supabaseClient
        .from('notes')
        .update({
          ...note,
        })
        .eq('id', note.id);

      this.getAllNotes();
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }

  async deleteNote(id: string) {
    try {
      await this._supabaseClient.from('notes').delete().eq('id', id);
      this.getAllNotes();
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }
}
