import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';
import { ProjectPipelineStatus } from '../models/studio.models';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur-md">
      <!-- Left side: App brand & Project selector -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          (click)="toggleSidebar()"
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          title="Toggle Navigation"
        >
          <mat-icon class="!text-lg !w-[18px] !h-[18px]">menu</mat-icon>
        </button>

        <div class="flex items-center gap-2 pr-3 border-r border-zinc-800">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-zinc-950 font-black text-xs">
            KT
          </div>
          <span class="font-bold tracking-tight text-sm text-zinc-100 hidden sm:inline-block">
            KidsToon <span class="text-zinc-500 font-normal">Studio</span>
          </span>
        </div>

        <!-- Project Selector Dropdown -->
        <div class="relative flex items-center">
          <mat-icon class="text-zinc-500 !text-base !w-4 !h-4 mr-1.5 hidden md:inline-block">movie</mat-icon>
          <select
            [value]="studio.activeProjectId()"
            (change)="onProjectSelect($event)"
            class="h-8 max-w-[220px] rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 text-xs font-medium text-zinc-200 focus:border-amber-500 focus:outline-none"
          >
            @for (p of studio.projects(); track p.id) {
              <option [value]="p.id">{{ p.title }}</option>
            }
          </select>
        </div>

        <!-- Active Pipeline Badge -->
        @if (studio.activeProject(); as proj) {
          <div class="hidden lg:flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
            <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">FASE:</span>
            <span class="text-[11px] font-mono font-semibold uppercase text-amber-300">
              {{ proj.status }}
            </span>
          </div>
        }
      </div>

      <!-- Right side: Mode, Budget, Actions -->
      <div class="flex items-center gap-2.5">
        <!-- Demo Mode Badge -->
        <button
          type="button"
          (click)="toggleDemoMode()"
          class="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-colors"
          [class.border-amber-500/40]="studio.isDemoMode()"
          [class.bg-amber-500/10]="studio.isDemoMode()"
          [class.text-amber-300]="studio.isDemoMode()"
          [class.border-emerald-500/40]="!studio.isDemoMode()"
          [class.bg-emerald-500/10]="!studio.isDemoMode()"
          [class.text-emerald-300]="!studio.isDemoMode()"
          title="Alternar entre Entorno Sandbox de Demostración y Producción Real"
        >
          <span class="h-1.5 w-1.5 rounded-full" [class.bg-amber-400]="studio.isDemoMode()" [class.bg-emerald-400]="!studio.isDemoMode()"></span>
          <span>{{ studio.isDemoMode() ? 'DEMO DATA' : 'LIVE API' }}</span>
        </button>

        <!-- Studio Budget Tracker -->
        <div
          class="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-400"
          title="Gasto acumulado de APIs vs Límite Autorizado"
        >
          <mat-icon class="!text-sm !w-3.5 !h-3.5 text-zinc-500">euro</mat-icon>
          <span class="font-mono text-zinc-200 font-semibold">{{ studio.totalStudioExpenditureEur() | number:'1.3-3' }} €</span>
          <span class="text-[10px] text-zinc-600">/ {{ studio.authorizedBudgetEur() | number:'1.0-0' }} €</span>
        </div>

        <!-- New Project Action Button -->
        <button
          type="button"
          (click)="openNewProjectWizard.emit()"
          class="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
        >
          <mat-icon class="!text-sm !w-4 !h-4 leading-none">add</mat-icon>
          <span class="hidden md:inline">Nuevo Proyecto</span>
          <span class="md:hidden">Nuevo</span>
        </button>
      </div>
    </header>
  `
})
export class Topbar {
  studio = inject(Studio);

  @Output() openNewProjectWizard = new EventEmitter<void>();

  toggleSidebar(): void {
    this.studio.sidebarCollapsed.update(c => !c);
  }

  onProjectSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.studio.activeProjectId.set(target.value);
    }
  }

  toggleDemoMode(): void {
    this.studio.isDemoMode.update(m => !m);
    this.studio.channelInfo.update(ch => ({
      ...ch,
      isDemoMode: this.studio.isDemoMode()
    }));
  }
}
