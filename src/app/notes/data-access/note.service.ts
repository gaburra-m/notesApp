import { Injectable, computed, inject, signal } from '@angular/core';
import { SupabaseService } from '../../shared/data-access/supabase.service';

interface NoteState {
  notes: Note[];
  loading: boolean;
  error: boolean;
}

interface Note {
  id: string;
  title: string;
  note: string | null;
  isImportant: boolean;
  user_id: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
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
      const { data } = await this._supabaseClient
        .from('notes')
        .select()
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
}
