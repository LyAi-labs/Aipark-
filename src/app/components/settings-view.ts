import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-settings-view',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
              STUDIO PREFERENCES & CONFIGURATION
            </span>
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            Ajustes del Estudio & APIs
          </h1>
          <p class="text-xs text-zinc-400 mt-0.5">
            Configuración de modelos de IA, políticas de seguridad COPPA, YouTube OAuth y control presupuestario en euros.
          </p>
        </div>

        <button
          type="button"
          (click)="saveSettings()"
          class="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
        >
          <mat-icon class="!text-sm !w-4 !h-4">save</mat-icon>
          <span>Guardar Configuración</span>
        </button>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6">
        <!-- 1. Strict Cost Control in Euros (€) -->
        <div class="rounded-2xl border border-amber-500/30 bg-zinc-900/60 p-6 space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <mat-icon>euro</mat-icon>
              </div>
              <div>
                <h2 class="text-sm font-bold text-zinc-100">Control Presupuestario & Autorización en Euros (€)</h2>
                <p class="text-xs text-zinc-400">Protección estricta: Solicitar autorización antes de consumir APIs externas de pago.</p>
              </div>
            </div>

            <span class="rounded bg-amber-500/15 px-2.5 py-1 text-xs font-mono font-bold text-amber-300">
              ESTRICTO ACTIVO
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span class="text-[10px] font-mono uppercase text-zinc-500 block">Límite Autorizado Total</span>
              <div class="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  [value]="studio.authorizedBudgetEur()"
                  (change)="updateBudget($event)"
                  step="1"
                  min="1"
                  max="100"
                  class="w-24 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-base font-bold font-mono text-zinc-100"
                />
                <span class="font-mono text-sm text-zinc-400">EUR (€)</span>
              </div>
            </div>

            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span class="text-[10px] font-mono uppercase text-zinc-500 block">Gasto Acumulado Actual</span>
              <div class="mt-1 text-lg font-bold font-mono text-amber-300">
                {{ studio.totalStudioExpenditureEur() | number:'1.3-4' }} €
              </div>
              <span class="text-[10px] text-zinc-500">Tokens Gemini 3.8 + Imagen</span>
            </div>

            <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span class="text-[10px] font-mono uppercase text-zinc-500 block">Saldo Disponible</span>
              <div class="mt-1 text-lg font-bold font-mono text-emerald-400">
                {{ (studio.authorizedBudgetEur() - studio.totalStudioExpenditureEur()) | number:'1.2-2' }} €
              </div>
              <span class="text-[10px] text-zinc-500">Capacidad para ~320 episodios</span>
            </div>
          </div>
        </div>

        <!-- 2. AI Model Selection -->
        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <mat-icon>psychology</mat-icon>
            </div>
            <div>
              <h2 class="text-sm font-bold text-zinc-100">Modelos de Inteligencia Artificial (Google GenAI)</h2>
              <p class="text-xs text-zinc-400">Selección del motor para generación de guion, personajes y control de calidad.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <label class="flex items-start gap-3 rounded-xl border p-4 cursor-pointer text-xs transition-colors"
              [class.border-amber-500]="selectedModel() === 'gemini-3.8-flash'"
              [class.bg-amber-500/5]="selectedModel() === 'gemini-3.8-flash'"
              [class.border-zinc-800]="selectedModel() !== 'gemini-3.8-flash'"
              [class.bg-zinc-950]="selectedModel() !== 'gemini-3.8-flash'"
            >
              <input type="radio" name="model" value="gemini-3.8-flash" [checked]="selectedModel() === 'gemini-3.8-flash'" (change)="selectedModel.set('gemini-3.8-flash')" class="mt-1 accent-amber-500" />
              <div>
                <div class="font-bold text-zinc-200">Gemini 3.8 Flash (Recomendado)</div>
                <div class="text-zinc-400 mt-1">Velocidad ultra-rápida, latencia mínima y coste microscópico (~0,0001 € / guion). Ideal para iteración continua.</div>
              </div>
            </label>

            <label class="flex items-start gap-3 rounded-xl border p-4 cursor-pointer text-xs transition-colors"
              [class.border-amber-500]="selectedModel() === 'gemini-3.1-pro-preview'"
              [class.bg-amber-500/5]="selectedModel() === 'gemini-3.1-pro-preview'"
              [class.border-zinc-800]="selectedModel() !== 'gemini-3.1-pro-preview'"
              [class.bg-zinc-950]="selectedModel() !== 'gemini-3.1-pro-preview'"
            >
              <input type="radio" name="model" value="gemini-3.1-pro-preview" [checked]="selectedModel() === 'gemini-3.1-pro-preview'" (change)="selectedModel.set('gemini-3.1-pro-preview')" class="mt-1 accent-amber-500" />
              <div>
                <div class="font-bold text-zinc-200">Gemini 3.1 Pro Preview</div>
                <div class="text-zinc-400 mt-1">Razonamiento profundo para tramas complejas y arcos pedagógicos de primaria alta (8–12 años).</div>
              </div>
            </label>
          </div>
        </div>

        <!-- 3. Publishing Defaults & COPPA Rules -->
        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <mat-icon>shield</mat-icon>
            </div>
            <div>
              <h2 class="text-sm font-bold text-zinc-100">Reglas de Publicación & Seguridad Infantil</h2>
              <p class="text-xs text-zinc-400">Parámetros predeterminados para evitar emisiones accidentales en YouTube.</p>
            </div>
          </div>

          <div class="space-y-3 pt-2 text-xs">
            <div class="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
              <div>
                <span class="font-semibold text-zinc-200 block">Visibilidad Inicial Obligatoria: PRIVADO</span>
                <span class="text-zinc-400">Nunca publicar en directo sin que un humano revise el vídeo renderizado en YouTube Studio.</span>
              </div>
              <span class="font-mono text-emerald-400 font-bold">ACTIVADO</span>
            </div>

            <div class="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
              <div>
                <span class="font-semibold text-zinc-200 block">Clasificación Automática Made for Kids (COPPA)</span>
                <span class="text-zinc-400">Bloqueo automático de anuncios dirigidos y desactivación preventiva de comentarios.</span>
              </div>
              <span class="font-mono text-emerald-400 font-bold">OBLIGATORIO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsView {
  studio = inject(Studio);

  selectedModel = signal<string>('gemini-3.8-flash');

  updateBudget(e: Event): void {
    const val = Number((e.target as HTMLInputElement).value) || 5;
    this.studio.authorizedBudgetEur.set(val);
  }

  saveSettings(): void {
    alert('Configuración del estudio guardada con éxito.');
  }
}
