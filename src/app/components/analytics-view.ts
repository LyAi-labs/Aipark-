import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-analytics-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
              AUDIENCE PERFORMANCE & RETENTION
            </span>
            @if (studio.isDemoMode()) {
              <span class="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                DEMO DATA — SANDBOX METRICS
              </span>
            } @else {
              <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                LIVE YOUTUBE ANALYTICS API
              </span>
            }
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            Rendimiento del Canal YouTube
          </h1>
          <p class="text-xs text-zinc-400 mt-0.5">
            Métricas de retención infantil, tiempo de visualización y conversión de miniaturas.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-zinc-400 font-mono">Últimos 28 días</span>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <!-- Views -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Visualizaciones (Views)</span>
            <mat-icon class="!text-sm !w-4 !h-4 text-zinc-500">visibility</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ studio.isDemoMode() ? '18.4M' : 'No data available' }}
          </div>
          <div class="mt-1 text-[11px] text-emerald-400 font-mono">+14.2% vs mes anterior</div>
        </div>

        <!-- Watch Time -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Tiempo de Visualización</span>
            <mat-icon class="!text-sm !w-4 !h-4 text-zinc-500">access_time</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ studio.isDemoMode() ? '412.8K h' : 'No data available' }}
          </div>
          <div class="mt-1 text-[11px] text-emerald-400 font-mono">+8.7% vs mes anterior</div>
        </div>

        <!-- Avg View Duration -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Duración Media (Retención)</span>
            <mat-icon class="!text-sm !w-4 !h-4 text-zinc-500">timelapse</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ studio.isDemoMode() ? '03:42' : 'No data available' }}
          </div>
          <div class="mt-1 text-[11px] text-zinc-400 font-mono">76.4% del vídeo total</div>
        </div>

        <!-- CTR -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Impresiones & CTR</span>
            <mat-icon class="!text-sm !w-4 !h-4 text-zinc-500">ads_click</mat-icon>
          </div>
          <div class="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {{ studio.isDemoMode() ? '11.8%' : 'No data available' }}
          </div>
          <div class="mt-1 text-[11px] text-emerald-400 font-mono">Alta efectividad miniatura</div>
        </div>
      </div>

      <!-- Retention Curve & Views Timeline Visualizer -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Views Chart (2 cols) -->
        <div class="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Curva de Visualizaciones Diarias (Octubre 2026)
            </h3>
            <span class="text-[10px] font-mono text-zinc-500">Canal KidsToon</span>
          </div>

          <!-- Bar Chart Visualization -->
          <div class="h-48 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-zinc-800">
            @for (bar of dailyBars; track bar.day) {
              <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div
                  class="w-full rounded-t transition-all group-hover:bg-amber-400"
                  [style.height.%]="bar.percent"
                  [class.bg-amber-500]="bar.hasEpisode"
                  [class.bg-zinc-700]="!bar.hasEpisode"
                  [title]="bar.label + ': ' + bar.views + ' views'"
                ></div>
                <span class="font-mono text-[9px] text-zinc-500">{{ bar.day }}</span>
              </div>
            }
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Barras doradas = Días de estreno de episodio</span>
            <span>Promedio: 65,000 views/día</span>
          </div>
        </div>

        <!-- Audience Demographics & Made for Kids Rules -->
        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-300 border-b border-zinc-800 pb-3">
            Distribución por Grupo de Edad
          </h3>

          <div class="space-y-3 text-xs">
            <div>
              <div class="flex justify-between text-zinc-300 mb-1">
                <span>4–6 años (Preescolar medio)</span>
                <span class="font-mono font-bold text-amber-400">62%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full" style="width: 62%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-zinc-300 mb-1">
                <span>2–4 años (Primeros pasos)</span>
                <span class="font-mono font-bold text-zinc-200">24%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div class="h-full bg-zinc-600 rounded-full" style="width: 24%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-zinc-300 mb-1">
                <span>6–8 años (Primaria inicial)</span>
                <span class="font-mono font-bold text-zinc-200">14%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div class="h-full bg-zinc-600 rounded-full" style="width: 14%"></div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-[11px] text-zinc-400 space-y-1">
            <span class="text-zinc-300 font-semibold block">Clasificación YouTube Kids</span>
            <p>Los datos de comentarios y demografía de usuarios individuales están restringidos por la política de protección de menores de Google.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsView {
  studio = inject(Studio);

  dailyBars = [
    { day: '01', percent: 45, views: '52K', hasEpisode: false, label: 'Oct 01' },
    { day: '02', percent: 88, views: '115K', hasEpisode: true, label: 'Oct 02 (EP01 Estreno)' },
    { day: '03', percent: 75, views: '98K', hasEpisode: false, label: 'Oct 03' },
    { day: '04', percent: 68, views: '84K', hasEpisode: false, label: 'Oct 04' },
    { day: '05', percent: 62, views: '76K', hasEpisode: false, label: 'Oct 05' },
    { day: '06', percent: 92, views: '124K', hasEpisode: true, label: 'Oct 06 (EP02 Estreno)' },
    { day: '07', percent: 80, views: '102K', hasEpisode: false, label: 'Oct 07' },
    { day: '08', percent: 70, views: '89K', hasEpisode: false, label: 'Oct 08' },
    { day: '09', percent: 65, views: '78K', hasEpisode: false, label: 'Oct 09' },
    { day: '10', percent: 60, views: '71K', hasEpisode: false, label: 'Oct 10' },
    { day: '11', percent: 85, views: '110K', hasEpisode: true, label: 'Oct 11' },
    { day: '12', percent: 72, views: '91K', hasEpisode: false, label: 'Oct 12' }
  ];
}
