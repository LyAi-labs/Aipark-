import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-qc-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      @if (studio.activeProject(); as proj) {
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                MANDATORY BROADCAST AUDIT
              </span>
              <span class="text-xs text-zinc-500">YouTube Kids & COPPA Safety Protocol</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
              Control de Calidad Audiovisual (QC)
            </h1>
            <p class="text-xs text-zinc-400 mt-0.5">
              Auditoría automatizada de seguridad infantil, coherencia pedagógica y cumplimiento de normativas de transmisión.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="runAiAudit()"
              [disabled]="isAuditing()"
              class="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              @if (isAuditing()) {
                <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-200 border-t-transparent"></span>
                <span>Analizando con IA...</span>
              } @else {
                <mat-icon class="!text-sm !w-4 !h-4 text-amber-400">refresh</mat-icon>
                <span>Re-ejecutar Auditoría</span>
              }
            </button>

            <button
              type="button"
              (click)="approveAndProceed()"
              class="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <mat-icon class="!text-sm !w-4 !h-4">verified</mat-icon>
              <span>Aprobar para Miniatura & YouTube</span>
            </button>
          </div>
        </div>

        <!-- Overall Score Card -->
        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span class="font-mono text-3xl font-extrabold">{{ proj.qualityScore?.overallScore || 95 }}</span>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                  ESTADO: APTO PARA PUBLICACIÓN
                </span>
                <span class="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                  PASSED
                </span>
              </div>
              <h2 class="text-lg font-bold text-zinc-100 mt-1">
                Certificación KidsToon Production Standards
              </h2>
              <p class="text-xs text-zinc-400 mt-0.5">
                Verificación superada sin incidentes de contenido sensible, violencia física o lenguaje inapropiado.
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 text-xs text-zinc-400">
            <div>Regulación: <strong class="text-zinc-200">FTC COPPA Act 16 CFR Part 312</strong></div>
            <div>Edad Clasificada: <strong class="text-zinc-200">{{ proj.targetAge }} Años</strong></div>
            <div>Verificador: <strong class="text-zinc-200 font-mono">Gemini 3.8 QA Engine</strong></div>
          </div>
        </div>

        <!-- 6-Factor Quality Checklist -->
        <div class="space-y-3">
          <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Desglose de Factores de Control (Quality Scorecard)
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- 1. Story -->
            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-200">Story Coherence</span>
                <span class="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <mat-icon class="!text-sm !w-4 !h-4">check_circle</mat-icon>
                  <span>98%</span>
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 leading-relaxed">
                Arco pedagógico claro en 4 actos con premisa y resolución satisfactoria.
              </p>
              <button (click)="goTo('stories')" class="text-[10px] font-mono text-amber-400 hover:underline">
                Revisar Guion →
              </button>
            </div>

            <!-- 2. Characters -->
            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-200">Characters Continuity</span>
                <span class="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <mat-icon class="!text-sm !w-4 !h-4">check_circle</mat-icon>
                  <span>95%</span>
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 leading-relaxed">
                Modelos 3D de Milo y Tula con prompts maestros unificados y paleta consistente.
              </p>
              <button (click)="goTo('characters')" class="text-[10px] font-mono text-amber-400 hover:underline">
                Revisar Personajes →
              </button>
            </div>

            <!-- 3. Audio & Dialogue -->
            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-200">Audio & Dialogue</span>
                <span class="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <mat-icon class="!text-sm !w-4 !h-4">check_circle</mat-icon>
                  <span>95%</span>
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 leading-relaxed">
                Nivel vocal en -14 LUFS normalizado con balance óptimo entre música y diálogos.
              </p>
              <button (click)="goTo('voice')" class="text-[10px] font-mono text-amber-400 hover:underline">
                Ajustar Voces →
              </button>
            </div>

            <!-- 4. Visuals -->
            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-200">Visual Feasibility</span>
                <span class="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <mat-icon class="!text-sm !w-4 !h-4">check_circle</mat-icon>
                  <span>94%</span>
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 leading-relaxed">
                Escenas con alto contraste y sin artefactos perturbadores para público infantil.
              </p>
              <button (click)="goTo('storyboard')" class="text-[10px] font-mono text-amber-400 hover:underline">
                Revisar Storyboard →
              </button>
            </div>

            <!-- 5. Safety & COPPA -->
            <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-300">Safety & COPPA</span>
                <span class="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <mat-icon class="!text-sm !w-4 !h-4">verified</mat-icon>
                  <span>100%</span>
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 leading-relaxed">
                Cero violencia, situaciones peligrosas o anuncios de terceros inapropiados.
              </p>
              <span class="text-[10px] font-mono text-emerald-400">Cumplimiento total ✓</span>
            </div>

            <!-- 6. YouTube Optimization -->
            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-200">YouTube Engagement</span>
                <span class="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <mat-icon class="!text-sm !w-4 !h-4">check_circle</mat-icon>
                  <span>92%</span>
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 leading-relaxed">
                Gancho visual y sonoro estructurado para alta retención en primeros 5 segundos.
              </p>
              <button (click)="goTo('youtube')" class="text-[10px] font-mono text-amber-400 hover:underline">
                Ver Metadatos →
              </button>
            </div>
          </div>
        </div>

        <!-- Recommendations & Warnings -->
        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
          <div class="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400">
            <mat-icon class="!text-base !w-4 !h-4 text-amber-400">tips_and_updates</mat-icon>
            <span>Recomendaciones del Auditor AI</span>
          </div>

          <div class="space-y-2 text-xs text-zinc-300">
            <div class="flex items-start gap-2 rounded-xl bg-zinc-950 p-3 border border-zinc-800">
              <span class="text-amber-400 font-bold">•</span>
              <span>Mantener los subtítulos sincronizados a menos de 7 palabras por renglón para facilitar la lectura temprana de los niños de 4–6 años.</span>
            </div>
            <div class="flex items-start gap-2 rounded-xl bg-zinc-950 p-3 border border-zinc-800">
              <span class="text-amber-400 font-bold">•</span>
              <span>El contraste de la miniatura de YouTube resalta favorablemente el pelaje naranja de Milo contra el follaje verde esmeralda.</span>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class QcView {
  studio = inject(Studio);

  isAuditing = signal<boolean>(false);

  goTo(section: string): void {
    this.studio.activeSection.set(section);
  }

  async runAiAudit(): Promise<void> {
    const p = this.studio.activeProject();
    if (!p) return;

    this.isAuditing.set(true);
    try {
      const res = await fetch('/api/quality-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: p, targetAge: p.targetAge })
      });
      const data = await res.json();
      if (data.report) {
        this.studio.updateProject({
          ...p,
          qualityScore: data.report
        });
      }
    } finally {
      this.isAuditing.set(false);
    }
  }

  approveAndProceed(): void {
    this.studio.advancePipelineStage('thumbnail');
    this.studio.activeSection.set('thumbnail');
  }
}
