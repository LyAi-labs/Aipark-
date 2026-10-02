import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-thumbnail-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      @if (studio.activeProject(); as proj) {
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                YOUTUBE THUMBNAIL COMPOSER
              </span>
              <span class="text-xs text-zinc-500">1280 × 720 High CTR Standard</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
              Generador de Miniatura YouTube
            </h1>
            <p class="text-xs text-zinc-400 mt-0.5">
              Composición cinematográfica con enfoque en personaje principal, emoción visible y badge de texto de 3–5 palabras.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="regenerateThumbnail()"
              class="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <mat-icon class="!text-sm !w-4 !h-4 text-amber-400">autorenew</mat-icon>
              <span>Regenerar Composición</span>
            </button>

            <button
              type="button"
              (click)="goToYouTube()"
              class="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <span>Continuar a YouTube Publisher</span>
              <mat-icon class="!text-sm !w-4 !h-4">arrow_forward</mat-icon>
            </button>
          </div>
        </div>

        <!-- 1280x720 Canvas Preview Container -->
        <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
            <span class="font-mono text-zinc-400">Canvas 16:9 · 1280 × 720 px (Cinema Master)</span>
            <span class="font-mono text-emerald-400">Formato: PNG / SVG Vectorial Listo</span>
          </div>

          <div class="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-inner">
            @if (proj.thumbnailUrl) {
              <div [innerHTML]="proj.thumbnailUrl" class="w-full h-full object-cover"></div>
            }
          </div>
        </div>

        <!-- Thumbnail Configuration Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
            <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Texto de Impacto Visual (Max 3–5 palabras)
            </h3>

            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1">
                Badge / Titular sobre Miniatura:
              </label>
              <input
                type="text"
                [value]="overlayText()"
                (input)="onTextChange($event)"
                placeholder="¡EL GRAN TESORO!"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 font-bold focus:border-amber-500 focus:outline-none"
              />
              <span class="text-[10px] text-zinc-500 mt-1 block">
                Palabras actuales: {{ wordCount }} / 5 recomendadas
              </span>
            </div>

            <!-- Quick Presets -->
            <div>
              <span class="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5">Plantillas de Titular:</span>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  (click)="setPreset('¡EL GRAN TESORO!')"
                  class="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 hover:border-amber-500"
                >
                  ¡EL GRAN TESORO!
                </button>
                <button
                  type="button"
                  (click)="setPreset('¡EL SECRETO DE MILO!')"
                  class="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 hover:border-amber-500"
                >
                  ¡EL SECRETO DE MILO!
                </button>
                <button
                  type="button"
                  (click)="setPreset('¡AMIGOS MÁGICOS!')"
                  class="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 hover:border-amber-500"
                >
                  ¡AMIGOS MÁGICOS!
                </button>
              </div>
            </div>
          </div>

          <!-- YouTube Feed Mockup -->
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Vista Previa en YouTube Kids Feed
            </h3>

            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2 max-w-sm">
              <div class="aspect-video w-full rounded-lg overflow-hidden bg-zinc-900">
                @if (proj.thumbnailUrl) {
                  <div [innerHTML]="proj.thumbnailUrl" class="w-full h-full object-cover"></div>
                }
              </div>
              <div class="flex items-start gap-2 pt-1">
                <div class="h-7 w-7 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-xs shrink-0">
                  KT
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-semibold text-zinc-100 truncate">{{ proj.title }}</div>
                  <div class="text-[10px] text-zinc-400 mt-0.5">KidsToon Studio · 142 K suscriptores</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ThumbnailView {
  studio = inject(Studio);

  overlayText = signal<string>('¡EL GRAN TESORO!');

  get wordCount(): number {
    return this.overlayText().trim().split(/\s+/).filter(Boolean).length;
  }

  onTextChange(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.overlayText.set(val);
    this.updateThumbnail(val);
  }

  setPreset(txt: string): void {
    this.overlayText.set(txt);
    this.updateThumbnail(txt);
  }

  regenerateThumbnail(): void {
    const p = this.studio.activeProject();
    if (!p) return;
    this.updateThumbnail(this.overlayText());
  }

  private updateThumbnail(text: string): void {
    const p = this.studio.activeProject();
    if (!p) return;

    const svg = this.studio['visualGen'].generateThumbnailSvg(p.title, text);
    this.studio.updateProject({
      ...p,
      thumbnailUrl: svg,
      youtubeMetadata: {
        ...(p.youtubeMetadata || {
          title: p.title,
          description: p.logline,
          tags: [],
          hashtags: [],
          madeForKids: true,
          privacyStatus: 'private',
          category: 'Film & Animation',
          thumbnailOverlayText: text,
          recommendedPlaylist: 'General',
          coppaComplianceConfirmed: true
        }),
        thumbnailOverlayText: text
      }
    });
  }

  goToYouTube(): void {
    this.studio.advancePipelineStage('ready');
    this.studio.activeSection.set('youtube');
  }
}
