import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-story-view',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      @if (studio.activeProject(); as proj) {
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">STORY ARCHITECTURE</span>
              <span class="text-xs text-zinc-500">Gemini 3.8 Flash Engine</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
              {{ proj.title }}
            </h1>
            <p class="text-xs text-zinc-400 mt-0.5">
              Guion audiovisual infantil estructurado para animación 3D.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Regenerate button with cost check -->
            <button
              type="button"
              (click)="regenerateStory()"
              [disabled]="studio.isGenerating()"
              class="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              @if (studio.isGenerating()) {
                <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-100 border-t-transparent"></span>
                <span>Regenerando...</span>
              } @else {
                <mat-icon class="!text-sm !w-4 !h-4 text-amber-400">autorenew</mat-icon>
                <span>Regenerar con Gemini (~0,015 €)</span>
              }
            </button>

            <button
              type="button"
              (click)="saveStoryChanges()"
              class="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <mat-icon class="!text-sm !w-4 !h-4">save</mat-icon>
              <span>Guardar Guion</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            type="button"
            (click)="activeTab.set('overview')"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            [class.bg-zinc-800]="activeTab() === 'overview'"
            [class.text-zinc-100]="activeTab() === 'overview'"
            [class.text-zinc-400]="activeTab() !== 'overview'"
          >
            Arco & Premisa Pedagógica
          </button>
          <button
            type="button"
            (click)="activeTab.set('scenes')"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            [class.bg-zinc-800]="activeTab() === 'scenes'"
            [class.text-zinc-100]="activeTab() === 'scenes'"
            [class.text-zinc-400]="activeTab() !== 'scenes'"
          >
            Estructura de Escenas ({{ proj.scenes.length }})
          </button>
          <button
            type="button"
            (click)="activeTab.set('json')"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            [class.bg-zinc-800]="activeTab() === 'json'"
            [class.text-zinc-100]="activeTab() === 'json'"
            [class.text-zinc-400]="activeTab() !== 'json'"
          >
            Esquema JSON
          </button>
        </div>

        <!-- TAB 1: Overview & Pedagogical Core -->
        @if (activeTab() === 'overview') {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-4">
              <!-- Logline -->
              <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <label class="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Logline / Sinopsis Breve
                </label>
                <textarea
                  [value]="proj.logline"
                  (input)="onLoglineChange($event)"
                  rows="3"
                  class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                ></textarea>
              </div>

              <!-- Moral & Educational Objective -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <label class="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Objetivo Educativo
                  </label>
                  <input
                    type="text"
                    [value]="proj.educationalObjective"
                    (input)="onObjectiveChange($event)"
                    class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <label class="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Enseñanza Moral / Conclusión
                  </label>
                  <input
                    type="text"
                    [value]="proj.moral"
                    (input)="onMoralChange($event)"
                    class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Ending & Resolution -->
              <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <label class="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Resolución / Desenlace Positivo
                </label>
                <textarea
                  [value]="proj.ending"
                  (input)="onEndingChange($event)"
                  rows="2"
                  class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                ></textarea>
              </div>
            </div>

            <!-- Right Column: Story Metadata Box -->
            <div class="space-y-4">
              <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Especificaciones Técnicas
                </h3>
                <div class="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
                  <span class="text-zinc-500">Edad objetivo:</span>
                  <span class="font-mono text-zinc-200 font-semibold">{{ proj.targetAge }} años</span>
                </div>
                <div class="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
                  <span class="text-zinc-500">Idioma:</span>
                  <span class="font-mono text-zinc-200">{{ proj.language }}</span>
                </div>
                <div class="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
                  <span class="text-zinc-500">Escenas totales:</span>
                  <span class="font-mono text-zinc-200 font-semibold">{{ proj.scenes.length }}</span>
                </div>
                <div class="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
                  <span class="text-zinc-500">Duración estimada:</span>
                  <span class="font-mono text-zinc-200 font-semibold">{{ totalDurationSeconds }} seg</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-zinc-500">Tokens consumidos:</span>
                  <span class="font-mono text-amber-300 font-semibold">{{ proj.costMetrics.totalTokensUsed }}</span>
                </div>
              </div>

              <!-- Safety Guarantee Box -->
              <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                <div class="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <mat-icon class="!text-base !w-4 !h-4">verified_user</mat-icon>
                  <span>Garantía Infantil KidsToon</span>
                </div>
                <p class="text-[11px] text-zinc-400 leading-relaxed">
                  Esta historia no contiene situaciones de peligro no supervisado, vocabulario agresivo ni sustos. Cumple los estándares de YouTube Kids.
                </p>
              </div>
            </div>
          </div>
        }

        <!-- TAB 2: Detailed Scenes Breakdown -->
        @if (activeTab() === 'scenes') {
          <div class="space-y-4">
            @for (scene of proj.scenes; track scene.id; let idx = $index) {
              <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
                <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div class="flex items-center gap-2">
                    <span class="rounded bg-amber-500 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-950">
                      {{ scene.scene_id }}
                    </span>
                    <span class="text-xs font-bold text-zinc-200">{{ scene.location }}</span>
                    <span class="text-xs text-zinc-500">· {{ scene.time }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-mono text-zinc-400">Duración:</span>
                    <input
                      type="number"
                      [value]="scene.duration"
                      (change)="updateSceneDuration(scene.id, $event)"
                      min="5"
                      max="60"
                      class="w-14 rounded border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-xs font-mono text-zinc-200 text-center"
                    />
                    <span class="text-[11px] text-zinc-500">seg</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <!-- Action & Camera -->
                  <div class="space-y-2">
                    <div>
                      <span class="text-[10px] font-mono uppercase text-zinc-500">Acción Animada:</span>
                      <textarea
                        [value]="scene.action"
                        (input)="updateSceneAction(scene.id, $event)"
                        rows="2"
                        class="w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
                      ></textarea>
                    </div>
                    <div>
                      <span class="text-[10px] font-mono uppercase text-zinc-500">Cámara / Encuadre:</span>
                      <input
                        type="text"
                        [value]="scene.camera"
                        (input)="updateSceneCamera(scene.id, $event)"
                        class="w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <!-- Dialogue & Narration -->
                  <div class="space-y-2">
                    <div>
                      <span class="text-[10px] font-mono uppercase text-amber-400/90">Diálogo Personaje:</span>
                      <textarea
                        [value]="scene.dialogue"
                        (input)="updateSceneDialogue(scene.id, $event)"
                        rows="2"
                        class="w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                      ></textarea>
                    </div>
                    <div>
                      <span class="text-[10px] font-mono uppercase text-zinc-500">Voz en Off / Narración:</span>
                      <input
                        type="text"
                        [value]="scene.narration"
                        (input)="updateSceneNarration(scene.id, $event)"
                        class="w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <!-- Visual prompt and audio cues footer -->
                <div class="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-zinc-500">
                  <div class="flex items-center gap-3">
                    <span><strong class="text-zinc-400">FX:</strong> {{ scene.sound_effects }}</span>
                    <span><strong class="text-zinc-400">Música:</strong> {{ scene.music }}</span>
                  </div>
                  <button
                    type="button"
                    (click)="studio.activeSection.set('storyboard')"
                    class="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Ver en Storyboard</span>
                    <mat-icon class="!text-xs !w-3 !h-3">arrow_forward</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- TAB 3: Structured JSON -->
        @if (activeTab() === 'json') {
          <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3 text-xs">
              <span class="font-mono text-zinc-400">kids_story_schema_v1.json</span>
              <span class="text-zinc-500">Formato canónico exportable para motores 3D / Unreal / Blender</span>
            </div>
            <pre class="font-mono text-xs text-amber-200/90 overflow-x-auto p-2 bg-zinc-900/50 rounded-xl leading-relaxed">{{ storyJson }}</pre>
          </div>
        }
      }
    </div>
  `
})
export class StoryView {
  studio = inject(Studio);

  activeTab = signal<'overview' | 'scenes' | 'json'>('overview');

  get totalDurationSeconds(): number {
    const p = this.studio.activeProject();
    if (!p) return 0;
    return p.scenes.reduce((acc, s) => acc + s.duration, 0);
  }

  get storyJson(): string {
    const p = this.studio.activeProject();
    if (!p) return '{}';
    return JSON.stringify({
      title: p.title,
      logline: p.logline,
      target_age: p.targetAge,
      educational_objective: p.educationalObjective,
      characters: p.characters.map(c => ({ name: c.name, species: c.species, personality: c.personality })),
      scenes: p.scenes,
      ending: p.ending,
      moral: p.moral
    }, null, 2);
  }

  onLoglineChange(e: Event): void {
    const val = (e.target as HTMLTextAreaElement).value;
    const p = this.studio.activeProject();
    if (p) this.studio.updateProject({ ...p, logline: val });
  }

  onObjectiveChange(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    const p = this.studio.activeProject();
    if (p) this.studio.updateProject({ ...p, educationalObjective: val });
  }

  onMoralChange(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    const p = this.studio.activeProject();
    if (p) this.studio.updateProject({ ...p, moral: val });
  }

  onEndingChange(e: Event): void {
    const val = (e.target as HTMLTextAreaElement).value;
    const p = this.studio.activeProject();
    if (p) this.studio.updateProject({ ...p, ending: val });
  }

  updateSceneDuration(sceneId: string, e: Event): void {
    const val = Number((e.target as HTMLInputElement).value) || 15;
    const p = this.studio.activeProject();
    if (p) {
      const scenes = p.scenes.map(s => s.id === sceneId ? { ...s, duration: val } : s);
      this.studio.updateProject({ ...p, scenes });
    }
  }

  updateSceneAction(sceneId: string, e: Event): void {
    const val = (e.target as HTMLTextAreaElement).value;
    const p = this.studio.activeProject();
    if (p) {
      const scenes = p.scenes.map(s => s.id === sceneId ? { ...s, action: val } : s);
      this.studio.updateProject({ ...p, scenes });
    }
  }

  updateSceneCamera(sceneId: string, e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    const p = this.studio.activeProject();
    if (p) {
      const scenes = p.scenes.map(s => s.id === sceneId ? { ...s, camera: val } : s);
      this.studio.updateProject({ ...p, scenes });
    }
  }

  updateSceneDialogue(sceneId: string, e: Event): void {
    const val = (e.target as HTMLTextAreaElement).value;
    const p = this.studio.activeProject();
    if (p) {
      const scenes = p.scenes.map(s => s.id === sceneId ? { ...s, dialogue: val } : s);
      this.studio.updateProject({ ...p, scenes });
    }
  }

  updateSceneNarration(sceneId: string, e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    const p = this.studio.activeProject();
    if (p) {
      const scenes = p.scenes.map(s => s.id === sceneId ? { ...s, narration: val } : s);
      this.studio.updateProject({ ...p, scenes });
    }
  }

  async regenerateStory(): Promise<void> {
    const p = this.studio.activeProject();
    if (!p) return;

    // Check with user for authorization if external API
    const authorized = await this.studio.promptCostAuthorization(0.015, `Regenerar historia con Gemini 3.8 Flash para "${p.title}"`);
    if (!authorized) return;

    this.studio.isGenerating.set(true);
    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: p.idea,
          title: p.title,
          targetAge: p.targetAge,
          language: p.language,
          duration: p.durationCategory,
          educationalObjective: p.educationalObjective,
          tone: p.tone,
          numberOfScenes: p.scenes.length
        })
      });
      const data = await res.json();
      if (data.story) {
        this.studio.updateProject({
          ...p,
          logline: data.story.logline || p.logline,
          educationalObjective: data.story.educational_objective || p.educationalObjective,
          moral: data.story.moral || p.moral,
          ending: data.story.ending || p.ending
        });
      }
    } finally {
      this.studio.isGenerating.set(false);
    }
  }

  saveStoryChanges(): void {
    const p = this.studio.activeProject();
    if (p) {
      this.studio.updateProject(p);
      this.studio.advancePipelineStage('characters');
      this.studio.activeSection.set('characters');
    }
  }
}
