import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../services/studio';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-200 select-none overflow-y-auto"
      [class.w-64]="!studio.sidebarCollapsed()"
      [class.w-16]="studio.sidebarCollapsed()"
    >
      <!-- Navigation Groups -->
      <div class="flex-1 py-3 space-y-5">
        @for (section of sections; track section.title) {
          <div class="px-3">
            @if (!studio.sidebarCollapsed()) {
              <div class="px-2 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                {{ section.title }}
              </div>
            }

            <div class="space-y-0.5">
              @for (item of section.items; track item.id) {
                <button
                  type="button"
                  (click)="handleItemClick(item.id)"
                  class="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                  [class.bg-zinc-800]="studio.activeSection() === item.id"
                  [class.text-zinc-100]="studio.activeSection() === item.id"
                  [class.text-zinc-400]="studio.activeSection() !== item.id"
                  [class.hover:bg-zinc-900]="studio.activeSection() !== item.id"
                  [class.hover:text-zinc-200]="studio.activeSection() !== item.id"
                  [title]="item.label"
                >
                  <mat-icon
                    class="!text-lg !w-[18px] !h-[18px] shrink-0"
                    [class.text-amber-400]="studio.activeSection() === item.id"
                    [class.text-zinc-500]="studio.activeSection() !== item.id"
                    [class.group-hover:text-zinc-300]="studio.activeSection() !== item.id"
                  >
                    {{ item.icon }}
                  </mat-icon>

                  @if (!studio.sidebarCollapsed()) {
                    <span class="truncate flex-1 text-left">{{ item.label }}</span>
                    @if (item.badge) {
                      <span class="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                        {{ item.badge }}
                      </span>
                    }
                  }
                </button>
              }
            </div>
          </div>
        }
      </div>

      <!-- Studio System Status Footer -->
      <div class="border-t border-zinc-800/80 p-3">
        @if (!studio.sidebarCollapsed()) {
          <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-2.5">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-zinc-400">Motor Orquestador</span>
              <span class="font-mono text-xs font-semibold text-emerald-400">Gemini 3.8</span>
            </div>
            <div class="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Pipeline Status</span>
              <span class="font-mono text-zinc-300">Activo (Ready)</span>
            </div>
          </div>
        } @else {
          <div class="flex justify-center">
            <span class="h-2 w-2 rounded-full bg-emerald-400" title="Sistema Activo"></span>
          </div>
        }
      </div>
    </aside>
  `
})
export class Sidebar {
  studio = inject(Studio);

  @Output() newProjectClick = new EventEmitter<void>();

  sections: NavSection[] = [
    {
      title: 'Studio',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
        { id: 'new-project', label: 'Nuevo Proyecto', icon: 'add_circle_outline' },
        { id: 'projects', label: 'Proyectos', icon: 'folder_open' },
        { id: 'series', label: 'Series Universo', icon: 'auto_stories' },
        { id: 'calendar', label: 'Calendario', icon: 'calendar_month' }
      ]
    },
    {
      title: 'Production',
      items: [
        { id: 'stories', label: 'Stories & Guion', icon: 'menu_book' },
        { id: 'characters', label: 'Characters', icon: 'face' },
        { id: 'storyboard', label: 'Storyboard', icon: 'dashboard_customize' },
        { id: 'voice', label: 'Voice Production', icon: 'record_voice_over' },
        { id: 'animation', label: 'Animation & Video Editor', icon: 'movie_edit' },
        { id: 'rendering', label: 'Rendering Pipeline', icon: 'sync' }
      ]
    },
    {
      title: 'Quality & Media',
      items: [
        { id: 'qc', label: 'AI Quality Control', icon: 'verified' },
        { id: 'thumbnail', label: 'Thumbnail 1280×720', icon: 'image' }
      ]
    },
    {
      title: 'Publishing',
      items: [
        { id: 'youtube', label: 'YouTube Publisher', icon: 'smart_display' },
        { id: 'scheduled', label: 'Programados', icon: 'schedule' },
        { id: 'analytics', label: 'Analytics', icon: 'insights' }
      ]
    },
    {
      title: 'Library',
      items: [
        { id: 'library', label: 'Biblioteca Central', icon: 'inventory_2' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'settings', label: 'Ajustes & APIs', icon: 'tune' }
      ]
    }
  ];

  handleItemClick(id: string): void {
    if (id === 'new-project') {
      this.newProjectClick.emit();
    } else {
      this.studio.activeSection.set(id);
    }
  }
}
