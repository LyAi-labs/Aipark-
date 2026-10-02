import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-dashboard-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Welcome & Production Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="text-xs font-mono text-zinc-400 uppercase tracking-wider">Centro de Operaciones</span>
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            KidsToon Studio Dashboard
          </h1>
          <p class="text-xs text-zinc-400 mt-0.5">
            Plataforma de producción y publicación automatizada de dibujos animados para niños.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="newProject.emit()"
            class="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            <mat-icon class="!text-base !w-4 !h-4">add</mat-icon>
            <span>Nueva Producción</span>
          </button>
        </div>
      </div>

      <!-- KPI Section: Producción & YouTube -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <!-- Proyectos Activos -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Proyectos Activos</span>
            <mat-icon class="!text-base !w-4 !h-4 text-zinc-500">folder</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ studio.projects().length }}
          </div>
          <div class="mt-1 text-[11px] text-zinc-500">En pipeline activo</div>
        </div>

        <!-- Vídeos Generados -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Vídeos Generados</span>
            <mat-icon class="!text-base !w-4 !h-4 text-zinc-500">movie</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ generatedVideosCount }}
          </div>
          <div class="mt-1 text-[11px] text-emerald-400">Listos para emisión</div>
        </div>

        <!-- Vídeos Pendientes de Revisión -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pendientes QC</span>
            <mat-icon class="!text-base !w-4 !h-4 text-amber-500/80">fact_check</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-amber-300">
            1
          </div>
          <div class="mt-1 text-[11px] text-zinc-500">Requiere aprobación</div>
        </div>

        <!-- Vídeos Programados -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Programados</span>
            <mat-icon class="!text-base !w-4 !h-4 text-zinc-500">event</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ studio.calendarItems().length }}
          </div>
          <div class="mt-1 text-[11px] text-zinc-500">En calendario YouTube</div>
        </div>

        <!-- Vídeos Publicados -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Publicados (Privados/Públicos)</span>
            <mat-icon class="!text-base !w-4 !h-4 text-zinc-500">cloud_done</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ studio.channelInfo().videoCount }}
          </div>
          <div class="mt-1 text-[11px] text-zinc-500">Canal KidsToon Studio</div>
        </div>
      </div>

      <!-- YouTube Channel Performance Strip (With DEMO DATA Notice) -->
      <div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
              <mat-icon>smart_display</mat-icon>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold text-zinc-100">Métricas Canal YouTube</h3>
                <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                  DEMO DATA (SANDBOX)
                </span>
              </div>
              <p class="text-xs text-zinc-400">{{ studio.channelInfo().channelTitle }} · {{ studio.channelInfo().channelCustomUrl }}</p>
            </div>
          </div>

          <button
            type="button"
            (click)="goTo('youtube')"
            class="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <span>Gestionar Publicaciones</span>
            <mat-icon class="!text-sm !w-4 !h-4">arrow_forward</mat-icon>
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div>
            <div class="text-[11px] text-zinc-500">Visualizaciones Totales</div>
            <div class="text-lg font-bold font-mono text-zinc-200 mt-0.5">{{ studio.channelInfo().viewCount }}</div>
            <div class="text-[10px] text-emerald-400 mt-0.5">+14.2% últimos 28 días</div>
          </div>
          <div>
            <div class="text-[11px] text-zinc-500">Suscriptores</div>
            <div class="text-lg font-bold font-mono text-zinc-200 mt-0.5">{{ studio.channelInfo().subscriberCount }}</div>
            <div class="text-[10px] text-emerald-400 mt-0.5">+1,850 este mes</div>
          </div>
          <div>
            <div class="text-[11px] text-zinc-500">CTR Promedio Miniaturas</div>
            <div class="text-lg font-bold font-mono text-zinc-200 mt-0.5">11.8%</div>
            <div class="text-[10px] text-zinc-400 mt-0.5">Composición 1280x720</div>
          </div>
          <div>
            <div class="text-[11px] text-zinc-500">Retención Media Audiencia</div>
            <div class="text-lg font-bold font-mono text-zinc-200 mt-0.5">76.4%</div>
            <div class="text-[10px] text-zinc-400 mt-0.5">Rango 4–6 años</div>
          </div>
        </div>
      </div>

      <!-- Production Queue: 10 Stages Visualizer -->
      <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 class="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <mat-icon class="!text-base !w-4 !h-4 text-amber-400">linear_scale</mat-icon>
              <span>Cadena de Producción (Production Queue)</span>
            </h3>
            <p class="text-xs text-zinc-400 mt-0.5">
              Estado de las 10 etapas del pipeline audiovisual para el proyecto activo:
              <strong class="text-zinc-200">{{ studio.activeProject()?.title }}</strong>
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="goTo('animation')"
              class="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Abrir Timeline
            </button>
          </div>
        </div>

        <!-- 10 Stages Visual Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 pt-4">
          @for (step of queueSteps; track step.index) {
            <div
              (click)="goTo(step.targetRoute)"
              class="cursor-pointer group flex flex-col justify-between rounded-xl border p-2.5 transition-all"
              [class.border-emerald-500/40]="step.status === 'completed'"
              [class.bg-emerald-500/5]="step.status === 'completed'"
              [class.border-amber-500/50]="step.status === 'processing'"
              [class.bg-amber-500/10]="step.status === 'processing'"
              [class.border-zinc-800]="step.status === 'pending'"
              [class.bg-zinc-950/40]="step.status === 'pending'"
              [class.border-rose-500/40]="step.status === 'failed'"
              [class.bg-rose-500/5]="step.status === 'failed'"
            >
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] text-zinc-500">0{{ step.index }}</span>
                  @if (step.status === 'completed') {
                    <mat-icon class="!text-xs !w-3 !h-3 text-emerald-400">check_circle</mat-icon>
                  } @else if (step.status === 'processing') {
                    <span class="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                  } @else if (step.status === 'failed') {
                    <mat-icon class="!text-xs !w-3 !h-3 text-rose-400">error</mat-icon>
                  } @else {
                    <span class="h-1.5 w-1.5 rounded-full bg-zinc-700"></span>
                  }
                </div>
                <div class="mt-2 text-xs font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">
                  {{ step.title }}
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono">
                <span
                  [class.text-emerald-400]="step.status === 'completed'"
                  [class.text-amber-400]="step.status === 'processing'"
                  [class.text-zinc-500]="step.status === 'pending'"
                  [class.text-rose-400]="step.status === 'failed'"
                >
                  {{ step.status }}
                </span>
                <mat-icon class="!text-xs !w-3 !h-3 text-zinc-600 group-hover:text-zinc-300">chevron_right</mat-icon>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Active Project Detail Card & Quick Editor Access -->
      @if (studio.activeProject(); as proj) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left 2 Cols: Project Overview -->
          <div class="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    EDAD: {{ proj.targetAge }} AÑOS
                  </span>
                  <span class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    {{ proj.durationCategory }}
                  </span>
                  <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                    {{ proj.language }}
                  </span>
                </div>
                <h2 class="text-base font-bold text-zinc-100 mt-2">
                  {{ proj.title }}
                </h2>
                <p class="text-xs text-zinc-400 mt-1 italic leading-relaxed">
                  "{{ proj.logline }}"
                </p>
              </div>

              <button
                type="button"
                (click)="goTo('stories')"
                class="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                Editar Guion
              </button>
            </div>

            <!-- Scenes mini-strip -->
            <div>
              <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                Escenas del Storyboard ({{ proj.scenes.length }})
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                @for (sc of proj.scenes; track sc.id) {
                  <div
                    (click)="goTo('storyboard')"
                    class="cursor-pointer group rounded-xl border border-zinc-800 bg-zinc-950 p-2 hover:border-amber-500/50 transition-colors"
                  >
                    <div class="aspect-video w-full rounded-lg overflow-hidden bg-zinc-900">
                      @if (sc.visualSvg) {
                        <div [innerHTML]="sc.visualSvg" class="w-full h-full object-cover"></div>
                      }
                    </div>
                    <div class="mt-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>{{ sc.scene_id }}</span>
                      <span>{{ sc.duration }}s</span>
                    </div>
                    <div class="truncate text-[11px] font-medium text-zinc-300 group-hover:text-amber-400">
                      {{ sc.location }}
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Objective & Moral Box -->
            <div class="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 flex flex-col sm:flex-row gap-4 text-xs">
              <div class="flex-1">
                <span class="text-zinc-500 block text-[10px] font-mono uppercase">Objetivo Pedagógico</span>
                <span class="text-zinc-200 mt-0.5 block font-medium">{{ proj.educationalObjective }}</span>
              </div>
              <div class="flex-1 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-4">
                <span class="text-zinc-500 block text-[10px] font-mono uppercase">Enseñanza Moral</span>
                <span class="text-amber-300/90 mt-0.5 block font-medium">{{ proj.moral }}</span>
              </div>
            </div>
          </div>

          <!-- Right Col: Thumbnail & Quick Actions -->
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-zinc-200">Miniatura YouTube</span>
                <span class="text-[10px] font-mono text-zinc-500">1280 × 720</span>
              </div>

              <div class="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner">
                @if (proj.thumbnailUrl) {
                  <div [innerHTML]="proj.thumbnailUrl" class="w-full h-full object-cover"></div>
                }
              </div>

              <div class="mt-3 flex items-center justify-between text-xs">
                <span class="text-zinc-400">Audience:</span>
                <span class="font-mono text-emerald-400 font-semibold">Made for Kids (COPPA ✓)</span>
              </div>
              <div class="mt-1 flex items-center justify-between text-xs">
                <span class="text-zinc-400">Estado de subida:</span>
                <span class="font-mono text-amber-300 font-semibold uppercase">{{ proj.youtubeMetadata?.privacyStatus || 'Private' }}</span>
              </div>
            </div>

            <div class="space-y-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                (click)="goTo('animation')"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-100 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                <mat-icon class="!text-sm !w-4 !h-4">play_arrow</mat-icon>
                <span>Reproducir Animación</span>
              </button>
              <button
                type="button"
                (click)="goTo('youtube')"
                class="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <mat-icon class="!text-sm !w-4 !h-4">publish</mat-icon>
                <span>Publicar en YouTube (Privado)</span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardView {
  studio = inject(Studio);

  @Output() newProject = new EventEmitter<void>();

  get generatedVideosCount(): number {
    return this.studio.projects().filter(p => p.videoTrack.isRendered).length;
  }

  get queueSteps() {
    const p = this.studio.activeProject();
    const isRendered = p?.videoTrack?.isRendered;
    const isQcPassed = p?.qualityScore?.approvedForProduction;
    const isScheduled = p?.status === 'scheduled';
    const isPublished = p?.status === 'published';

    return [
      { index: 1, title: 'Story Generation', status: 'completed', targetRoute: 'stories' },
      { index: 2, title: 'Character Generation', status: 'completed', targetRoute: 'characters' },
      { index: 3, title: 'Scene Generation', status: 'completed', targetRoute: 'storyboard' },
      { index: 4, title: 'Voice Generation', status: 'completed', targetRoute: 'voice' },
      { index: 5, title: 'Animation', status: isRendered ? 'completed' : 'processing', targetRoute: 'animation' },
      { index: 6, title: 'Rendering', status: isRendered ? 'completed' : 'processing', targetRoute: 'rendering' },
      { index: 7, title: 'Thumbnail', status: 'completed', targetRoute: 'thumbnail' },
      { index: 8, title: 'Metadata', status: 'completed', targetRoute: 'youtube' },
      { index: 9, title: 'Quality Control', status: isQcPassed ? 'completed' : 'pending', targetRoute: 'qc' },
      { index: 10, title: 'YouTube Upload', status: isPublished ? 'completed' : (isScheduled ? 'processing' : 'pending'), targetRoute: 'youtube' }
    ];
  }

  goTo(section: string): void {
    this.studio.activeSection.set(section);
  }
}
