import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';
import { Project } from '../models/studio.models';

@Component({
  selector: 'app-projects-list-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">CATALOG & REPERTOIRE</span>
            <span class="text-xs text-zinc-500">{{ studio.projects().length }} Producciones Registradas</span>
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            Proyectos Audiovisuales
          </h1>
          <p class="text-xs text-zinc-400 mt-0.5">
            Explora, filtra y continúa la edición de cualquier episodio o piloto en producción.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="newProject.emit()"
            class="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            <mat-icon class="!text-sm !w-4 !h-4">add</mat-icon>
            <span>Nueva Producción</span>
          </button>
        </div>
      </div>

      <!-- Projects List / Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (proj of studio.projects(); track proj.id) {
          <div
            (click)="openProject(proj.id)"
            class="group cursor-pointer rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-md"
            [class.border-amber-500/60]="studio.activeProjectId() === proj.id"
            [class.bg-zinc-900/80]="studio.activeProjectId() === proj.id"
            [class.border-zinc-800]="studio.activeProjectId() !== proj.id"
            [class.bg-zinc-900/40]="studio.activeProjectId() !== proj.id"
            [class.hover:border-zinc-700]="studio.activeProjectId() !== proj.id"
          >
            <div class="space-y-3">
              <!-- Thumbnail Banner -->
              <div class="aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-inner relative">
                @if (proj.thumbnailUrl) {
                  <div [innerHTML]="proj.thumbnailUrl" class="w-full h-full object-cover"></div>
                }
                <div class="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-zinc-800">
                  {{ proj.status | uppercase }}
                </div>
              </div>

              <div>
                <div class="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-1">
                  <span>{{ proj.targetAge }} AÑOS</span>
                  <span>·</span>
                  <span>{{ proj.language }}</span>
                  <span>·</span>
                  <span>{{ proj.durationCategory }}</span>
                </div>
                <h3 class="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                  {{ proj.title }}
                </h3>
                <p class="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {{ proj.logline }}
                </p>
              </div>
            </div>

            <div class="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>{{ proj.scenes.length }} Escenas</span>
              <span class="flex items-center gap-1 text-amber-400 group-hover:translate-x-0.5 transition-transform">
                <span>Abrir Estudio</span>
                <mat-icon class="!text-xs !w-3 !h-3">arrow_forward</mat-icon>
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProjectsListView {
  studio = inject(Studio);

  @Output() newProject = new EventEmitter<void>();

  openProject(id: string): void {
    this.studio.activeProjectId.set(id);
    this.studio.activeSection.set('dashboard');
  }
}
