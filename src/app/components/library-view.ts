import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';
import { LibraryItem } from '../models/studio.models';

@Component({
  selector: 'app-library-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
              CENTRAL REUSABLE ASSET REPOSITORY
            </span>
            <span class="text-xs text-zinc-500">{{ filteredItems.length }} Elementos Catalogados</span>
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            Biblioteca Central de Assets
          </h1>
          <p class="text-xs text-zinc-400 mt-0.5">
            Modelos de personajes, fondos, perfiles de voz, bandas sonoras y efectos reutilizables entre series.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Filter Tabs -->
          <div class="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1 text-xs">
            <button
              type="button"
              (click)="selectedCategory.set('all')"
              class="rounded-lg px-2.5 py-1 font-medium transition-colors"
              [class.bg-zinc-800]="selectedCategory() === 'all'"
              [class.text-zinc-100]="selectedCategory() === 'all'"
              [class.text-zinc-400]="selectedCategory() !== 'all'"
            >
              Todos
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('character')"
              class="rounded-lg px-2.5 py-1 font-medium transition-colors"
              [class.bg-zinc-800]="selectedCategory() === 'character'"
              [class.text-zinc-100]="selectedCategory() === 'character'"
              [class.text-zinc-400]="selectedCategory() !== 'character'"
            >
              Personajes
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('background')"
              class="rounded-lg px-2.5 py-1 font-medium transition-colors"
              [class.bg-zinc-800]="selectedCategory() === 'background'"
              [class.text-zinc-100]="selectedCategory() === 'background'"
              [class.text-zinc-400]="selectedCategory() !== 'background'"
            >
              Escenarios
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('music')"
              class="rounded-lg px-2.5 py-1 font-medium transition-colors"
              [class.bg-zinc-800]="selectedCategory() === 'music'"
              [class.text-zinc-100]="selectedCategory() === 'music'"
              [class.text-zinc-400]="selectedCategory() !== 'music'"
            >
              Música & Audio
            </button>
          </div>
        </div>
      </div>

      <!-- Assets Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (item of filteredItems; track item.id) {
          <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4 hover:border-zinc-700 transition-all shadow-md flex flex-col justify-between">
            <div class="space-y-3">
              <!-- Visual Preview or Icon -->
              <div class="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center relative">
                @if (item.previewSvg) {
                  <div [innerHTML]="item.previewSvg" class="w-full h-full object-cover"></div>
                } @else {
                  <div class="flex flex-col items-center gap-2 text-zinc-500">
                    <mat-icon class="!text-3xl !w-8 !h-8 text-amber-400">
                      {{ item.type === 'music' ? 'music_note' : (item.type === 'sfx' ? 'auto_fix_high' : 'record_voice_over') }}
                    </mat-icon>
                    <span class="text-xs font-mono uppercase">{{ item.category }}</span>
                  </div>
                }

                <div class="absolute top-2 left-2 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-800">
                  {{ item.type | uppercase }}
                </div>
              </div>

              <div>
                <h3 class="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {{ item.description }}
                </p>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                @for (tag of item.tags; track tag) {
                  <span class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    #{{ tag }}
                  </span>
                }
              </div>
            </div>

            <div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Usado en {{ item.usedInProjectsCount }} proyectos</span>
              <button
                type="button"
                (click)="insertIntoCurrentProject(item)"
                class="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
              >
                Inyectar en Proyecto
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class LibraryView {
  studio = inject(Studio);

  selectedCategory = signal<string>('all');

  get filteredItems(): LibraryItem[] {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.studio.libraryItems();
    return this.studio.libraryItems().filter(i => i.type === cat);
  }

  insertIntoCurrentProject(item: LibraryItem): void {
    // Feedback injection
    alert(`Asset "${item.title}" referenciado con éxito en el proyecto activo.`);
  }
}
