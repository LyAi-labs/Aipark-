import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Studio } from './services/studio';
import { Topbar } from './components/topbar';
import { Sidebar } from './components/sidebar';
import { DashboardView } from './components/dashboard-view';
import { StoryView } from './components/story-view';
import { CharactersView } from './components/characters-view';
import { StoryboardView } from './components/storyboard-view';
import { VoiceView } from './components/voice-view';
import { AnimationEditorView } from './components/animation-editor-view';
import { QcView } from './components/qc-view';
import { ThumbnailView } from './components/thumbnail-view';
import { YouTubeView } from './components/youtube-view';
import { CalendarView } from './components/calendar-view';
import { AnalyticsView } from './components/analytics-view';
import { LibraryView } from './components/library-view';
import { SeriesView } from './components/series-view';
import { ProjectsListView } from './components/projects-list-view';
import { SettingsView } from './components/settings-view';
import { WizardModal } from './components/wizard-modal';
import { CostModal } from './components/cost-modal';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    Topbar,
    Sidebar,
    DashboardView,
    StoryView,
    CharactersView,
    StoryboardView,
    VoiceView,
    AnimationEditorView,
    QcView,
    ThumbnailView,
    YouTubeView,
    CalendarView,
    AnalyticsView,
    LibraryView,
    SeriesView,
    ProjectsListView,
    SettingsView,
    WizardModal,
    CostModal
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  studio = inject(Studio);

  isWizardOpen = signal<boolean>(false);

  openWizard(): void {
    this.isWizardOpen.set(true);
  }

  closeWizard(): void {
    this.isWizardOpen.set(false);
  }
}
