import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';
import { Series } from '../models/studio.models';

@Component({
  selector: 'app-series-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
              FRANCHISE & UNIVERSE CONTINUITY
            </span>
            <span class="text-xs text-zinc-500">Reglas Permanentes de Mundo</span>
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            Series & Universos Narrativos
          </h1>
          <p class="text-xs text-zinc-400 mt-0.5">
            Garantiza que todos los episodios mantengan personajes, iluminación, estilo 3D y tono moral idéntico.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="createEpisodeForSeries.emit()"
            class="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            <mat-icon class="!text-sm !w-4 !h-4">movie_filter</mat-icon>
            <span>Nuevo Episodio de Serie</span>
          </button>
        </div>
      </div>

      <!-- Series Cards List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (series of studio.seriesList(); track series.id) {
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">SERIE PRINCIPAL</span>
                  <span class="font-mono text-xs text-zinc-500">{{ series.episodesCount }} Episodios Producidos</span>
                </div>
                <h2 class="text-lg font-bold text-zinc-100 mt-1">{{ series.name }}</h2>
                <p class="text-xs text-zinc-400 mt-1 leading-relaxed">{{ series.description }}</p>
              </div>

              <div class="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <mat-icon>auto_stories</mat-icon>
              </div>
            </div>

            <!-- Universe Specs -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-xs font-mono">
              <div>
                <span class="text-[10px] text-zinc-500 uppercase block">Protagonista</span>
                <span class="text-zinc-200 font-bold">{{ series.mainCharacterName }}</span>
              </div>
              <div>
                <span class="text-[10px] text-zinc-500 uppercase block">Edad Diana</span>
                <span class="text-zinc-200 font-bold">{{ series.targetAge }}</span>
              </div>
              <div>
                <span class="text-[10px] text-zinc-500 uppercase block">Estilo 3D</span>
                <span class="text-zinc-200 font-bold truncate">Pixar / Disney</span>
              </div>
              <div>
                <span class="text-[10px] text-zinc-500 uppercase block">Duración Media</span>
                <span class="text-zinc-200 font-bold">{{ series.episodeLength }}</span>
              </div>
            </div>

            <!-- Franchise Rules -->
            <div class="space-y-2">
              <span class="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Reglas Narrativas & Visuales del Universo:
              </span>
              <div class="space-y-1.5 text-xs text-zinc-300">
                @for (rule of series.rules; track rule) {
                  <div class="flex items-start gap-2 rounded-lg bg-zinc-950/60 p-2.5 border border-zinc-800/80">
                    <mat-icon class="!text-sm !w-4 !h-4 text-emerald-400 shrink-0 mt-0.5">check</mat-icon>
                    <span>{{ rule }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span class="text-xs text-zinc-500 font-mono">Continuidad Automática Activada</span>
              <button
                type="button"
                (click)="createEpisodeForSeries.emit()"
                class="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                Producir Nuevo Episodio
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class SeriesView {
  studio = inject(Studio);

  @Output() createEpisodeForSeries = new EventEmitter<void>();
}
