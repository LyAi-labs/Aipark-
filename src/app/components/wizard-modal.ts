import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-wizard-modal',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden my-8">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-6 py-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400">
                AI PRODUCTION WIZARD
              </span>
              <span class="text-xs font-mono text-zinc-500">Paso 1 de 2: Concepto & Dirección</span>
            </div>
            <h2 class="mt-1 text-base font-bold text-zinc-100">
              Crear Nuevo Proyecto Audiovisual
            </h2>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <mat-icon class="!text-lg !w-5 !h-5">close</mat-icon>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <!-- Story Idea Prompt -->
          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1.5">
              Idea o premisa central del episodio <span class="text-amber-400">*</span>
            </label>
            <textarea
              formControlName="idea"
              rows="3"
              placeholder="Ej: Un pequeño zorro aprende por qué es importante compartir sus juguetes con sus amigos del bosque."
              class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none transition-colors"
            ></textarea>
          </div>

          <!-- Title & Series Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                Título provisional
              </label>
              <input
                type="text"
                formControlName="title"
                placeholder="Ej: Milo y la Caja de las Sorpresas"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                Asignar a Serie Universo
              </label>
              <select
                formControlName="seriesId"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="">(Proyecto Independiente / Piloto)</option>
                @for (s of studio.seriesList(); track s.id) {
                  <option [value]="s.id">{{ s.name }} ({{ s.targetAge }})</option>
                }
              </select>
            </div>
          </div>

          <!-- Target Age & Duration -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                Rango de Edad
              </label>
              <select
                formControlName="targetAge"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="2-4">2–4 años (Preescolar inicial)</option>
                <option value="4-6">4–6 años (Preescolar medio)</option>
                <option value="6-8">6–8 años (Infantil primaria)</option>
                <option value="8-10">8–10 años (Aventura)</option>
                <option value="10-12">10–12 años (Pre-juvenil)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                Duración Objetivo
              </label>
              <select
                formControlName="durationCategory"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="Short">Short (Menor a 60 seg)</option>
                <option value="3-5 min">3–5 min (Estándar YouTube Kids)</option>
                <option value="5-8 min">5–8 min (Episodio mediano)</option>
                <option value="8-12 min">8–12 min (Episodio largo)</option>
                <option value="Custom">Personalizado</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                Idioma Principal
              </label>
              <select
                formControlName="language"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="Spanish">Español</option>
                <option value="English">English</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Italian">Italiano</option>
                <option value="Portuguese">Português</option>
              </select>
            </div>
          </div>

          <!-- Educational Objective & Tone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                Objetivo Pedagógico / Moral
              </label>
              <input
                type="text"
                formControlName="educationalObjective"
                placeholder="Ej: Empatía, compartir juguetes, superar el miedo a la oscuridad"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-300 mb-1.5">
                Tono Emocional
              </label>
              <input
                type="text"
                formControlName="tone"
                placeholder="Ej: Cálido, curioso y alegre"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Scenes count -->
          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1.5">
              Número de Escenas Iniciales
            </label>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2 text-xs cursor-pointer hover:border-zinc-700">
                <input type="radio" formControlName="numberOfScenes" [value]="4" class="text-amber-500" />
                <span class="text-zinc-300">4 Escenas (Arco Conciso)</span>
              </label>
              <label class="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2 text-xs cursor-pointer hover:border-zinc-700">
                <input type="radio" formControlName="numberOfScenes" [value]="6" class="text-amber-500" />
                <span class="text-zinc-300">6 Escenas (Arco Detallado)</span>
              </label>
            </div>
          </div>

          <!-- Cost preview in Euros banner -->
          <div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400 !text-base !w-4 !h-4">info</mat-icon>
              <span class="text-zinc-300">Coste de generación estimado:</span>
              <span class="font-mono font-bold text-amber-300">~ 0,015 €</span>
            </div>
            <span class="text-[11px] text-zinc-500">Gemini 3.8 Flash · Autorización automática de microgasto</span>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              (click)="close.emit()"
              class="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || studio.isGenerating()"
              class="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              @if (studio.isGenerating()) {
                <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent"></span>
                <span>Generando Historia...</span>
              } @else {
                <mat-icon class="!text-sm !w-4 !h-4">auto_awesome</mat-icon>
                <span>Generar Historia (Generate Story)</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class WizardModal {
  studio = inject(Studio);

  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  form = new FormGroup({
    idea: new FormControl('Un pequeño zorro aprende por qué es importante compartir sus juguetes con sus amigos del bosque.', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)]
    }),
    title: new FormControl('Milo y la Caja de las Sorpresas', { nonNullable: true }),
    seriesId: new FormControl('series_milo', { nonNullable: true }),
    targetAge: new FormControl<'2-4' | '4-6' | '6-8' | '8-10' | '10-12'>('4-6', { nonNullable: true }),
    durationCategory: new FormControl<'Short' | '3-5 min' | '5-8 min' | '8-12 min' | 'Custom'>('3-5 min', { nonNullable: true }),
    language: new FormControl('Spanish', { nonNullable: true }),
    educationalObjective: new FormControl('Compartir, empatía y generosidad', { nonNullable: true }),
    tone: new FormControl('Cálido, alegre y tierno', { nonNullable: true }),
    numberOfScenes: new FormControl<number>(4, { nonNullable: true })
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const val = this.form.getRawValue();

    try {
      await this.studio.createNewProject({
        title: val.title,
        idea: val.idea,
        targetAge: val.targetAge,
        language: val.language,
        durationCategory: val.durationCategory,
        educationalObjective: val.educationalObjective,
        tone: val.tone,
        numberOfScenes: val.numberOfScenes,
        seriesId: val.seriesId || undefined
      });
      this.created.emit();
      this.close.emit();
      this.studio.activeSection.set('stories');
    } catch (e) {
      console.error(e);
    }
  }
}
