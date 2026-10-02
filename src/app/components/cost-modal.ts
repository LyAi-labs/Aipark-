import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

@Component({
  selector: 'app-cost-modal',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (studio.costAuthorizationModal().isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 shadow-2xl">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <mat-icon>euro</mat-icon>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">Control de Costes</span>
                <span class="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">ESTRICTO</span>
              </div>
              <h3 class="mt-1 text-base font-semibold text-zinc-100">
                Autorización de Gasto en APIs
              </h3>
              <p class="mt-2 text-xs text-zinc-400 leading-relaxed">
                {{ studio.costAuthorizationModal().description }}
              </p>

              <div class="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-zinc-400">Coste estimado de la operación:</span>
                  <span class="font-mono text-sm font-bold text-amber-300">
                    {{ studio.costAuthorizationModal().amountEur | number:'1.2-4' }} €
                  </span>
                </div>
                <div class="mt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-2">
                  <span>Presupuesto autorizado restante:</span>
                  <span class="font-mono text-zinc-300">
                    {{ (studio.authorizedBudgetEur() - studio.totalStudioExpenditureEur()) | number:'1.2-2' }} €
                  </span>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  (click)="cancel()"
                  class="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  Cancelar operación
                </button>
                <button
                  type="button"
                  (click)="confirm()"
                  class="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <mat-icon class="!text-sm !w-4 !h-4 leading-none">check</mat-icon>
                  Autorizar {{ studio.costAuthorizationModal().amountEur | number:'1.2-4' }} €
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class CostModal {
  studio = inject(Studio);

  confirm(): void {
    const modal = this.studio.costAuthorizationModal();
    if (modal.onConfirm) {
      modal.onConfirm();
    }
  }

  cancel(): void {
    const modal = this.studio.costAuthorizationModal();
    if (modal.onCancel) {
      modal.onCancel();
    }
  }
}
