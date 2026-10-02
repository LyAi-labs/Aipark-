import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';
import { Character } from '../models/studio.models';

@Component({
  selector: 'app-characters-view',
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
                CHARACTER BIBLE & CONTINUITY
              </span>
              <span class="text-xs text-zinc-500">Sistema de Consistencia Visual 3D</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
              Personajes de la Producción
            </h1>
            <p class="text-xs text-zinc-400 mt-0.5">
              Definiciones maestras de personajes reutilizables para garantizar continuidad entre episodios.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="addSecondaryCharacter()"
              class="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <mat-icon class="!text-sm !w-4 !h-4 text-amber-400">person_add</mat-icon>
              <span>Añadir Personaje</span>
            </button>
            <button
              type="button"
              (click)="goToStoryboard()"
              class="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <span>Continuar a Storyboard</span>
              <mat-icon class="!text-sm !w-4 !h-4">arrow_forward</mat-icon>
            </button>
          </div>
        </div>

        <!-- Characters Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (char of proj.characters; track char.id) {
            <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
              <!-- Character Header -->
              <div class="flex items-start gap-4">
                <!-- 3D Avatar Portrait -->
                <div class="h-28 w-28 shrink-0 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner">
                  @if (char.avatarSvg) {
                    <div [innerHTML]="char.avatarSvg" class="w-full h-full object-cover"></div>
                  }
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <h2 class="text-lg font-bold text-zinc-100">{{ char.name }}</h2>
                      <span class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">{{ char.species }}</span>
                    </div>

                    <!-- Regenerate Button -->
                    <button
                      type="button"
                      (click)="regenerateCharacter(char.id)"
                      [disabled]="isRegeneratingChar() === char.id"
                      class="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      title="Regenerar prompts y consistencia con IA"
                    >
                      <mat-icon class="!text-xs !w-3.5 !h-3.5 text-amber-400">autorenew</mat-icon>
                      <span>{{ isRegeneratingChar() === char.id ? 'Regenerando...' : 'Regenerar' }}</span>
                    </button>
                  </div>

                  <p class="text-xs text-zinc-400 mt-1 italic">{{ char.personality }}</p>

                  <!-- Color Palette Swatches -->
                  <div class="mt-2.5 flex items-center gap-1.5">
                    <span class="text-[10px] font-mono uppercase text-zinc-500 mr-1">Paleta:</span>
                    @for (hex of char.colorPalette; track hex) {
                      <div
                        class="h-4 w-4 rounded-full border border-black/40 shadow-sm"
                        [style.background-color]="hex"
                        [title]="hex"
                      ></div>
                    }
                  </div>
                </div>
              </div>

              <!-- Physical traits & clothing -->
              <div class="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs space-y-2">
                <div>
                  <span class="text-[10px] font-mono uppercase text-zinc-500">Rasgos Visuales Clave:</span>
                  <p class="text-zinc-300 mt-0.5">{{ char.visualFeatures }}</p>
                </div>
                <div class="border-t border-zinc-800/80 pt-2">
                  <span class="text-[10px] font-mono uppercase text-zinc-500">Vestimenta & Accesorios:</span>
                  <p class="text-zinc-300 mt-0.5">{{ char.clothing }}</p>
                </div>
              </div>

              <!-- Voice & Audio Profile -->
              <div class="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 flex items-center justify-between text-xs">
                <div>
                  <span class="text-[10px] font-mono uppercase text-zinc-500 block">Perfil de Voz</span>
                  <span class="text-zinc-200 font-medium">{{ char.voiceProfile.voiceType }}</span>
                </div>
                <div class="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
                  <span>Pitch: <strong class="text-zinc-200">{{ char.voiceProfile.pitch }}</strong></span>
                  <span>Velocidad: <strong class="text-zinc-200">{{ char.voiceProfile.speed }}</strong></span>
                </div>
              </div>

              <!-- Visual Consistency Prompt (Mandatory across all scenes) -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    Visual Consistency Prompt (Inyectado en cada escena)
                  </span>
                  <button
                    type="button"
                    (click)="copyToClipboard(char.visualConsistencyPrompt)"
                    class="text-[10px] font-mono text-zinc-500 hover:text-zinc-300"
                  >
                    Copiar
                  </button>
                </div>
                <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-[11px] font-mono text-zinc-300 leading-relaxed max-h-24 overflow-y-auto">
                  «{{ char.visualConsistencyPrompt }}»
                </div>
              </div>

              <!-- Master Generation Prompt -->
              <div class="space-y-1.5">
                <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Master Prompt (Modelado 3D)
                </span>
                <div class="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-2.5 text-[11px] font-mono text-zinc-400 leading-relaxed">
                  {{ char.masterPrompt }}
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class CharactersView {
  studio = inject(Studio);

  isRegeneratingChar = signal<string | null>(null);

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  async regenerateCharacter(charId: string): Promise<void> {
    const p = this.studio.activeProject();
    if (!p) return;

    const char = p.characters.find(c => c.id === charId);
    if (!char) return;

    const authorized = await this.studio.promptCostAuthorization(0.005, `Regenerar prompts de consistencia para el personaje "${char.name}"`);
    if (!authorized) return;

    this.isRegeneratingChar.set(charId);
    try {
      const res = await fetch('/api/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: char.name,
          species: char.species,
          personality: char.personality,
          age: char.age
        })
      });
      const data = await res.json();
      if (data.character) {
        const updated = p.characters.map(c => c.id === charId ? {
          ...c,
          visualConsistencyPrompt: data.character.visualConsistencyPrompt || c.visualConsistencyPrompt,
          masterPrompt: data.character.masterPrompt || c.masterPrompt,
          visualFeatures: data.character.visualFeatures || c.visualFeatures,
          clothing: data.character.clothing || c.clothing
        } : c);
        this.studio.updateProject({ ...p, characters: updated });
      }
    } finally {
      this.isRegeneratingChar.set(null);
    }
  }

  addSecondaryCharacter(): void {
    const p = this.studio.activeProject();
    if (!p) return;

    const newChar: Character = {
      id: 'char_' + Date.now().toString(36),
      name: 'Boby',
      species: 'Búho sabio',
      personality: 'Observador, pausado y con gran sentido del humor',
      age: '6 años',
      colorPalette: ['#78350F', '#FEF3C7', '#3B82F6'],
      clothing: 'Gafas de marco redondo dorado y chaleco de cuadros',
      visualFeatures: 'Plumas castañas suaves, ojos grandes ambarinos muy expresivos',
      voiceProfile: {
        voiceType: 'Infantil pausado',
        pitch: 0.95,
        speed: 0.9,
        timbre: 'Sereno'
      },
      visualConsistencyPrompt: 'Cute 3D cartoon owl character, round golden glasses, brown feathers, Pixar style, consistent design.',
      masterPrompt: 'Boby the owl 3D model sheet.',
      avatarSvg: this.studio['visualGen'].generateCharacterSvg('Boby', 'Buho')
    };

    this.studio.updateProject({
      ...p,
      characters: [...p.characters, newChar]
    });
  }

  goToStoryboard(): void {
    this.studio.advancePipelineStage('storyboard');
    this.studio.activeSection.set('storyboard');
  }
}
