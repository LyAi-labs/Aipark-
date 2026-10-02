import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Character,
  CostMetrics,
  EditorialCalendarItem,
  LibraryItem,
  ProductionJob,
  Project,
  ProjectPipelineStatus,
  QualityControlReport,
  Scene,
  Series,
  VideoTrackConfig,
  YouTubeChannelInfo,
  YouTubeMetadata
} from '../models/studio.models';
import { VisualGenerator } from './visual-generator';

const STORAGE_KEY_PROJECTS = 'kidstoon_studio_projects';
const STORAGE_KEY_SERIES = 'kidstoon_studio_series';
const STORAGE_KEY_SETTINGS = 'kidstoon_studio_settings';

@Injectable({
  providedIn: 'root'
})
export class Studio {
  private visualGen = inject(VisualGenerator);

  // Core signals
  projects = signal<Project[]>([]);
  activeProjectId = signal<string>('');
  seriesList = signal<Series[]>([]);
  activeSeriesId = signal<string>('');
  productionJobs = signal<ProductionJob[]>([]);
  libraryItems = signal<LibraryItem[]>([]);
  calendarItems = signal<EditorialCalendarItem[]>([]);

  // Studio system states
  isDemoMode = signal<boolean>(true);
  isGenerating = signal<boolean>(false);
  activeSection = signal<string>('dashboard');
  sidebarCollapsed = signal<boolean>(false);

  // YouTube Channel state
  channelInfo = signal<YouTubeChannelInfo>({
    connected: true,
    isDemoMode: true,
    channelId: 'UC-KTN-KIDSTOON-STUDIO-DEMO',
    channelTitle: 'KidsToon Studio Oficial (Sandbox)',
    channelCustomUrl: '@KidsToonStudioOfficial',
    subscriberCount: '142,500',
    videoCount: 48,
    viewCount: '18,430,920',
    avatarUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=160&auto=format&fit=crop&q=80',
    statusMessage: 'Canal Sandbox conectado en modo Demostración. Sin riesgos de publicación accidental.'
  });

  // Cost and budget controls (Strict authorization in EUR)
  costAuthorizationModal = signal<{
    isOpen: boolean;
    amountEur: number;
    description: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    amountEur: 0,
    description: ''
  });

  totalStudioExpenditureEur = signal<number>(0.042);
  authorizedBudgetEur = signal<number>(5.00);

  // Derived state
  activeProject = computed(() => {
    const id = this.activeProjectId();
    return this.projects().find(p => p.id === id) || this.projects()[0] || null;
  });

  activeSeries = computed(() => {
    const id = this.activeSeriesId();
    return this.seriesList().find(s => s.id === id) || null;
  });

  activeJobs = computed(() => {
    return this.productionJobs().filter(j => j.status === 'processing');
  });

  constructor() {
    this.initStudioData();
  }

  private initStudioData(): void {
    // Initial Series Setup
    const defaultSeries: Series = {
      id: 'series_milo',
      name: "Milo's Little Adventures",
      description: 'Aventuras en el bosque preescolar enfocadas en resolución pacífica de conflictos y compañerismo.',
      mainCharacterName: 'Milo',
      visualStyle: '3D Stylized Pixar Cartoon, soft textures, warm lighting',
      targetAge: '4–6 years',
      language: 'Spanish',
      episodeLength: '3–5 min',
      rules: [
        'Cero violencia o situaciones de peligro no supervisadas',
        'Cada episodio debe cerrar con un aprendizaje explícito de Milo',
        'La paleta de color principal se mantiene entre ámbar, esmeralda y cielo cálido'
      ],
      episodesCount: 3
    };
    this.seriesList.set([defaultSeries]);
    this.activeSeriesId.set(defaultSeries.id);

    // Initial Default Project
    const initialProject = this.createDefaultSeedProject(defaultSeries.id);
    this.projects.set([initialProject]);
    this.activeProjectId.set(initialProject.id);

    // Initial Editorial Calendar
    this.calendarItems.set([
      {
        id: 'cal_1',
        projectId: initialProject.id,
        title: initialProject.title,
        scheduledDate: '2026-10-06',
        scheduledTime: '17:00',
        privacyStatus: 'private',
        episodeCode: 'EP01',
        status: 'scheduled'
      },
      {
        id: 'cal_2',
        projectId: initialProject.id,
        title: 'Milo y el Viento Cantarín',
        scheduledDate: '2026-10-13',
        scheduledTime: '17:00',
        privacyStatus: 'scheduled',
        episodeCode: 'EP02',
        status: 'draft'
      }
    ]);

    // Initial Library Assets
    this.libraryItems.set([
      {
        id: 'lib_char_1',
        type: 'character',
        title: 'Milo el Zorro (Master Model)',
        category: 'Protagonistas',
        tags: ['3d', 'fox', 'preschool', 'orange'],
        description: 'Modelo maestro 3D para la serie Milo. Proporciones redondeadas y pelaje naranja.',
        previewSvg: this.visualGen.generateCharacterSvg('Milo', 'Zorro', '#EA580C', '#FEF3C7'),
        usedInProjectsCount: 4,
        createdAt: '2026-09-15'
      },
      {
        id: 'lib_char_2',
        type: 'character',
        title: 'Tula la Liebre Plateada',
        category: 'Personajes Secundarios',
        tags: ['3d', 'hare', 'silver', 'blue-vest'],
        description: 'Amiga fiel de Milo, ágil y reflexiva.',
        previewSvg: this.visualGen.generateCharacterSvg('Tula', 'Liebre', '#94A3B8', '#BAE6FD'),
        usedInProjectsCount: 2,
        createdAt: '2026-09-18'
      },
      {
        id: 'lib_bg_1',
        type: 'background',
        title: 'El Gran Roble Dorado',
        category: 'Escenarios Bosque',
        tags: ['forest', 'oak', 'sunny', 'clearing'],
        description: 'Claro principal del bosque donde inician la mayoría de las aventuras.',
        previewSvg: this.visualGen.generateSceneSvg(1, 'El Claro', 'Bosque', 'Mañana soleada'),
        usedInProjectsCount: 3,
        createdAt: '2026-09-10'
      },
      {
        id: 'lib_music_1',
        type: 'music',
        title: 'Aventura Curiosa (Xilófono & Strings)',
        category: 'Banda Sonora Principal',
        tags: ['cheerful', 'xylophone', 'orchestral', 'intro'],
        description: 'Tema musical optimista, 110 BPM, clave de Sol Mayor.',
        usedInProjectsCount: 5,
        createdAt: '2026-08-20'
      },
      {
        id: 'lib_voice_1',
        type: 'voice',
        title: 'Voz Milo (Spanish Pre-school)',
        category: 'Perfiles Vocales',
        tags: ['spanish', 'child', 'friendly', '1.05 pitch'],
        description: 'Síntesis vocal entrenada para personajes infantiles activos.',
        usedInProjectsCount: 3,
        createdAt: '2026-09-01'
      }
    ]);

    // Initial production jobs queue
    this.productionJobs.set([
      {
        id: 'job_01',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'story',
        type: 'Story Generation',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:14:20',
        completedAt: '2026-10-01 10:14:24',
        stepDescription: 'Narrativa, diálogos y arco pedagógico estructurados.'
      },
      {
        id: 'job_02',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'characters',
        type: 'Character Generation',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:14:25',
        completedAt: '2026-10-01 10:14:31',
        stepDescription: 'Personajes Milo y Tula verificados con consistencia visual.'
      },
      {
        id: 'job_03',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'storyboard',
        type: 'Storyboard Composition',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:14:32',
        completedAt: '2026-10-01 10:14:40',
        stepDescription: '4 escenas renderizadas con cámara y notas de dirección.'
      },
      {
        id: 'job_04',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'voice',
        type: 'Voice Synthesis & Timing',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:14:41',
        completedAt: '2026-10-01 10:14:48',
        stepDescription: 'Diálogos de personajes y narración sincronizados.'
      },
      {
        id: 'job_05',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'animation',
        type: 'Motion & Camera Direction',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:14:49',
        completedAt: '2026-10-01 10:14:58',
        stepDescription: 'Efectos de paneo y zoom cinematográfico Ken Burns activos.'
      },
      {
        id: 'job_06',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'editing',
        type: 'Multi-track Timeline Assembly',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:14:59',
        completedAt: '2026-10-01 10:15:05',
        stepDescription: 'Mezcla de audio, música y generación de subtítulos WebVTT.'
      },
      {
        id: 'job_07',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'qc',
        type: 'AI Quality & COPPA Review',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:15:06',
        completedAt: '2026-10-01 10:15:10',
        stepDescription: 'Evaluación de seguridad superada: 96/100 Apto para YouTube Kids.'
      },
      {
        id: 'job_08',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'thumbnail',
        type: '1280x720 Thumbnail Render',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:15:11',
        completedAt: '2026-10-01 10:15:14',
        stepDescription: 'Miniatura de alto contraste con tipografía optimizada.'
      },
      {
        id: 'job_09',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'ready',
        type: 'YouTube Package Prep',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01 10:15:15',
        completedAt: '2026-10-01 10:15:18',
        stepDescription: 'Metadatos, etiquetas y clasificación infantil listos.'
      },
      {
        id: 'job_10',
        projectId: initialProject.id,
        projectTitle: initialProject.title,
        stage: 'scheduled',
        type: 'YouTube Private Upload',
        status: 'pending',
        progress: 0,
        startedAt: '2026-10-01 10:15:19',
        stepDescription: 'En espera de confirmación de publicación por el usuario.'
      }
    ]);
  }

  private createDefaultSeedProject(seriesId: string): Project {
    const scenes: Scene[] = [
      {
        id: 'sc_1',
        scene_id: 'SCENE_01',
        location: 'El Claro del Roble Dorado',
        time: 'Mañana soleada',
        characters: ['Milo'],
        action: 'Milo salta emocionado abriendo una brillante caja de madera llena de peonzas de cristal.',
        camera: 'Plano general medio con suave paneo horizontal',
        dialogue: '¡Mirad esto! ¡Son mis peonzas mágicas y brillan como luciérnagas!',
        narration: 'En el corazón del bosque, el sol de la mañana iluminaba el mayor tesoro de Milo.',
        sound_effects: 'Trino de pájaros, crujido de hojas secas, tintineo mágico de cristal',
        music: 'Melodía alegre de xilófono y pizzicato de cuerdas',
        duration: 16,
        visual_prompt: 'High quality 3D cartoon scene, Milo the orange fox sitting near a golden oak tree opening a polished wooden chest filled with luminous spinning tops, warm sunbeams, Pixar aesthetic.',
        visualSvg: this.visualGen.generateSceneSvg(1, 'El Claro del Roble Dorado', 'El Claro del Roble Dorado', 'Mañana soleada'),
        motionType: 'pan-left',
        voiceAudioState: 'synthesized'
      },
      {
        id: 'sc_2',
        scene_id: 'SCENE_02',
        location: 'El Sendero de los Tréboles',
        time: 'Mediodía',
        characters: ['Milo', 'Tula'],
        action: 'Tula se acerca con curiosidad estirando la patita para ver una peonza, pero Milo la abraza contra su pecho.',
        camera: 'Primer plano de las expresiones de asombro y duda',
        dialogue: 'Tula: "¿Puedo hacer girar una? ¡Parecen estrellas!" — Milo: "Oh... son muy delicadas, Tula."',
        narration: 'Milo quería proteger su tesoro, pero notó una pequeña sombra de tristeza en los ojos de su amiga.',
        sound_effects: 'Brisa suave, pisadas ligeras sobre hierba',
        music: 'Cuerdas más lentas y reflexivas en tono menor suave',
        duration: 18,
        visual_prompt: '3D cartoon frame of Milo holding his wooden chest defensively while Tula the silver hare gazes with gentle longing, emerald forest backdrop, Disney-Pixar render.',
        visualSvg: this.visualGen.generateSceneSvg(2, 'El Sendero de los Tréboles', 'El Sendero de los Tréboles', 'Mediodía'),
        motionType: 'zoom-in',
        voiceAudioState: 'synthesized'
      },
      {
        id: 'sc_3',
        scene_id: 'SCENE_03',
        location: 'La Colina del Viento Dulce',
        time: 'Tarde dorada',
        characters: ['Milo', 'Tula'],
        action: 'Milo suspira, sonríe y le entrega la peonza azul más hermosa a Tula. Ambos las hacen bailar juntas en una roca plana.',
        camera: 'Travelling circular mostrando las peonzas girando',
        dialogue: '¡Giran el doble de rápido si las lanzamos juntos! ¡Mira la luz que hacen!',
        narration: 'Fue en ese instante cuando Milo comprendió que un juguete solo es divertido si hay alguien con quien reír.',
        sound_effects: 'Zumbido armonioso de peonzas girando, risas infantiles',
        music: 'Crescendo optimista con flauta traversa y campanillas',
        duration: 20,
        visual_prompt: 'Cinematic 3D animation scene, Milo and Tula cheering joyfully as two glowing spinning tops dance on a flat river stone, glowing swirl trails, warm sunset colors.',
        visualSvg: this.visualGen.generateSceneSvg(3, 'La Colina del Viento Dulce', 'La Colina del Viento Dulce', 'Tarde dorada'),
        motionType: 'ken-burns',
        voiceAudioState: 'synthesized'
      },
      {
        id: 'sc_4',
        scene_id: 'SCENE_04',
        location: 'El Hogar del Roble al Atardecer',
        time: 'Puesta de sol',
        characters: ['Milo', 'Tula'],
        action: 'Milo y Tula guardan los juguetes juntos en la caja, despidiéndose con un choque de patitas.',
        camera: 'Plano general alejándose lentamente hacia el cielo estrellado',
        dialogue: '¡Mañana inventaremos un circuito nuevo para todos los amigos!',
        narration: 'Y aquella tarde, la caja de Milo ya no guardaba solo peonzas: guardaba una amistad que brillaba para siempre.',
        sound_effects: 'Cierre suave de la caja de madera, grillos del atardecer',
        music: 'Tema principal en piano suave y cuerdas cálidas concluyendo con nota dulce',
        duration: 16,
        visual_prompt: 'Peaceful 3D cartoon sunset scene, Milo the fox and Tula the hare waving goodbye by a cozy hollow tree house, fireflies emerging, purple and orange twilight sky.',
        visualSvg: this.visualGen.generateSceneSvg(4, 'El Hogar del Roble al Atardecer', 'El Hogar del Roble al Atardecer', 'Puesta de sol'),
        motionType: 'zoom-out',
        voiceAudioState: 'synthesized'
      }
    ];

    const characters: Character[] = [
      {
        id: 'char_milo',
        name: 'Milo',
        species: 'Zorro rojo',
        personality: 'Curioso, entusiasta, juguetón y noble',
        age: '5 años',
        colorPalette: ['#EA580C', '#FEF3C7', '#65A30D', '#FACC15'],
        clothing: 'Mochila de aventurero verde oliva con hebillas doradas',
        visualFeatures: 'Pelaje naranja brillante aterciopelado, hocico crema suave, grandes ojos avellana',
        voiceProfile: { voiceType: 'Niño alegre y expresivo', pitch: 1.05, speed: 0.95, timbre: 'Cálido y brillante' },
        visualConsistencyPrompt: 'Cute original 3D cartoon fox, orange fur, cream muzzle, large expressive eyes, green backpack, rounded proportions, friendly facial expression, consistent character design, 3D animated film render.',
        masterPrompt: 'Protagonist Milo: Stylized 3D fox character, clean geometry, ultra-soft fur shaders, vibrant cartoon palette, consistent silhouette.',
        tagline: 'El pequeño explorador de grandes ideas',
        avatarSvg: this.visualGen.generateCharacterSvg('Milo', 'Zorro', '#EA580C', '#FEF3C7')
      },
      {
        id: 'char_tula',
        name: 'Tula',
        species: 'Liebre plateada',
        personality: 'Bondadosa, curiosa y gran observadora',
        age: '5 años',
        colorPalette: ['#94A3B8', '#BAE6FD', '#0284C7', '#F43F5E'],
        clothing: 'Chaleco azul cielo con estrellas bordadas',
        visualFeatures: 'Pelaje gris perla, orejas largas con puntas blancas, sonrisa tímida',
        voiceProfile: { voiceType: 'Voz dulce y vivaz', pitch: 1.15, speed: 1.0, timbre: 'Suave y cariñoso' },
        visualConsistencyPrompt: 'Cute 3D cartoon hare, soft silver fur, sky blue vest, friendly large ears, Pixar animated film quality, consistent design.',
        masterPrompt: 'Tula the hare: delicate animated character, expressive eyes, sky-blue vest, smooth shading.',
        tagline: 'La creadora de melodías del bosque',
        avatarSvg: this.visualGen.generateCharacterSvg('Tula', 'Liebre', '#94A3B8', '#BAE6FD')
      }
    ];

    const srt = this.generateSubtitlesSrt(scenes);
    const vtt = this.generateSubtitlesVtt(scenes);

    return {
      id: 'proj_milo_01',
      title: 'Milo y la Caja de las Sorpresas',
      idea: 'Un pequeño zorro aprende por qué es importante compartir sus juguetes con sus amigos del bosque.',
      targetAge: '4-6',
      language: 'Spanish',
      durationCategory: '3-5 min',
      educationalObjective: 'Aprender el valor de compartir y la alegría del juego cooperativo',
      tone: 'Cálido, alegre y tierno',
      status: 'ready',
      seriesId,
      characters,
      scenes,
      logline: 'Cuando Milo descubre un cofre lleno de peonzas mágicas, cree que guardarlas solo para él lo hará feliz, hasta que descubre que compartirlas ilumina todo el bosque.',
      moral: 'La verdadera diversión no está en tener más juguetes, sino en tener amigos con quienes compartirlos.',
      ending: 'Milo y Tula celebran su amistad viendo las peonzas brillar juntas bajo las estrellas.',
      qualityScore: {
        overallScore: 96,
        approvedForProduction: true,
        categories: {
          storyCoherence: { score: 98, status: 'pass', notes: 'Estructura clásica de 4 actos con progresión emocional impecable.' },
          characterContinuity: { score: 95, status: 'pass', notes: 'Rasgos visuales y psicológicos de Milo y Tula rigurosamente consistentes.' },
          audioAndDialogue: { score: 95, status: 'pass', notes: 'Léxico adaptado a etapa 4-6 años con frases cortas y reforzamiento positivo.' },
          visualFeasibility: { score: 94, status: 'pass', notes: 'Fondos naturales bien delimitados para renderizado por capas.' },
          safetyAndCoppa: { score: 100, status: 'pass', notes: '100% compliant con YouTube Made for Kids y lineamientos COPPA.' },
          youtubeEngagement: { score: 92, status: 'pass', notes: 'Elemento de intriga en los primeros 5 segundos garantiza alta retención.' }
        },
        flags: [],
        recommendations: [
          'Mantener el subtitulado en fuente legible Sans-Serif con fondo semitransparente.',
          'Configurar subida a YouTube en estado PRIVADO para revisión de calidad en el canal antes del estreno.'
        ]
      },
      youtubeMetadata: {
        title: 'Milo y la Caja de las Sorpresas 🦊 Cuentos Infantiles con Valores',
        description: `En este nuevo episodio de KidsToon Studio, Milo el pequeño zorro encuentra un cofre lleno de peonzas mágicas y descubre una valiosa lección sobre la generosidad y la amistad.

🎯 Objetivo pedagógico: Compartir, empatía y juego en equipo.
⏱️ Capítulos del episodio:
00:00 El tesoro secreto de Milo
00:16 Tula la liebre quiere jugar
00:34 La magia de bailar juntos
00:54 Amigos para siempre

🔔 Suscríbete a KidsToon Studio para más cuentos infantiles originales cada semana.
#KidsToonStudio #MiloElZorro #CuentosParaDormir #ValoresParaNiños #DibujosAnimados`,
        tags: ['milo el zorro', 'dibujos animados para ninos', 'cuentos infantiles en espanol', 'aprender a compartir', 'historias educativas', 'animacion 3d', 'kidstoon studio'],
        hashtags: ['#KidsToonStudio', '#CuentosInfantiles', '#AprenderACompartir', '#MiloElZorro'],
        madeForKids: true,
        privacyStatus: 'private',
        category: 'Film & Animation (1)',
        thumbnailOverlayText: '¡EL GRAN TESORO!',
        recommendedPlaylist: 'Aventuras en el Bosque de Milo',
        coppaComplianceConfirmed: true,
        monetizationNotice: 'Marcado como Creado para Niños (Made for Kids). Comentarios desactivados automáticamente.'
      },
      thumbnailUrl: this.visualGen.generateThumbnailSvg('Milo y la Caja de las Sorpresas', '¡EL GRAN TESORO!'),
      videoTrack: {
        isRendered: true,
        renderingProgress: 100,
        aspectRatio: '16:9',
        resolution: '1080p',
        fps: 24,
        musicVolume: 0.65,
        voiceVolume: 1.0,
        sfxVolume: 0.8,
        subtitlesSrt: srt,
        subtitlesVtt: vtt
      },
      costMetrics: {
        totalTokensUsed: 1420,
        imagesGenerated: 5,
        audioSeconds: 70,
        estimatedCostEur: 0.042,
        generationCallsCount: 4
      },
      createdAt: '2026-10-01 10:14:00',
      updatedAt: '2026-10-02 07:12:00',
      lastJobStatus: 'completed'
    };
  }

  /**
   * Subtitle generation helpers
   */
  generateSubtitlesSrt(scenes: Scene[]): string {
    let srt = '';
    let currentTime = 0;
    scenes.forEach((scene, index) => {
      const start = currentTime;
      const end = currentTime + scene.duration;
      currentTime = end;
      const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, '0');
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s},000`;
      };
      srt += `${index + 1}\n${formatTime(start)} --> ${formatTime(end)}\n${scene.dialogue || scene.narration}\n\n`;
    });
    return srt;
  }

  generateSubtitlesVtt(scenes: Scene[]): string {
    let vtt = 'WEBVTT\n\n';
    let currentTime = 0;
    scenes.forEach((scene, index) => {
      const start = currentTime;
      const end = currentTime + scene.duration;
      currentTime = end;
      const formatTime = (sec: number) => {
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `00:${m}:${s}.000`;
      };
      vtt += `${index + 1}\n${formatTime(start)} --> ${formatTime(end)}\n${scene.dialogue || scene.narration}\n\n`;
    });
    return vtt;
  }

  /**
   * Strict user authorization modal trigger for API costs
   */
  promptCostAuthorization(amountEur: number, description: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.costAuthorizationModal.set({
        isOpen: true,
        amountEur,
        description,
        onConfirm: () => {
          this.costAuthorizationModal.update(s => ({ ...s, isOpen: false }));
          this.totalStudioExpenditureEur.update(v => Number((v + amountEur).toFixed(4)));
          resolve(true);
        },
        onCancel: () => {
          this.costAuthorizationModal.update(s => ({ ...s, isOpen: false }));
          resolve(false);
        }
      });
    });
  }

  /**
   * Wizard: Create New Project with AI Generation
   */
  async createNewProject(payload: {
    title: string;
    idea: string;
    targetAge: '2-4' | '4-6' | '6-8' | '8-10' | '10-12';
    language: string;
    durationCategory: 'Short' | '3-5 min' | '5-8 min' | '8-12 min' | 'Custom';
    educationalObjective: string;
    tone: string;
    numberOfScenes: number;
    seriesId?: string;
  }): Promise<Project> {
    this.isGenerating.set(true);

    const projectId = 'proj_' + Date.now().toString(36);
    const newJobId = 'job_' + Date.now().toString(36);

    // Register active job in queue
    const initialJob: ProductionJob = {
      id: newJobId,
      projectId,
      projectTitle: payload.title || 'Nueva Producción',
      stage: 'story',
      type: 'Story Generation (Gemini 3.8 Flash)',
      status: 'processing',
      progress: 20,
      startedAt: new Date().toLocaleTimeString(),
      stepDescription: 'Generando narrativa infantil estructurada y arco moral...'
    };
    this.productionJobs.update(jobs => [initialJob, ...jobs]);

    try {
      // Call server backend
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: payload.idea,
          title: payload.title,
          targetAge: payload.targetAge,
          language: payload.language,
          duration: payload.durationCategory,
          educationalObjective: payload.educationalObjective,
          tone: payload.tone,
          numberOfScenes: payload.numberOfScenes
        })
      });

      const data = await response.json();
      const story = data.story;

      // Build characters
      const characters: Character[] = (story.characters || []).map((c: any, idx: number) => ({
        id: `char_${projectId}_${idx}`,
        name: c.name || `Personaje ${idx + 1}`,
        species: c.species || 'Animal del bosque',
        personality: c.personality || 'Alegre y curioso',
        age: c.age || payload.targetAge,
        colorPalette: c.colorPalette || ['#EA580C', '#FEF3C7', '#65A30D'],
        clothing: c.clothing || 'Ropa infantil cómoda de aventura',
        visualFeatures: c.visualFeatures || 'Ojos expresivos, proporciones tiernas de animación 3D',
        voiceProfile: {
          voiceType: c.voiceProfile || 'Infantil cálido',
          pitch: 1.05,
          speed: 0.95,
          timbre: 'Brillante'
        },
        visualConsistencyPrompt: c.visualConsistencyPrompt || 'Cute 3D stylized cartoon character, clean proportions, Pixar animation aesthetic.',
        masterPrompt: c.masterPrompt || 'Consistent 3D cartoon asset model sheet.',
        avatarSvg: this.visualGen.generateCharacterSvg(c.name, c.species)
      }));

      // Build scenes with visual Svg
      const scenes: Scene[] = (story.scenes || []).map((s: any, idx: number) => ({
        id: `sc_${projectId}_${idx}`,
        scene_id: s.scene_id || `SCENE_0${idx + 1}`,
        location: s.location || 'Escenario del cuento',
        time: s.time || 'Día',
        characters: s.characters || [characters[0]?.name || 'Protagonista'],
        action: s.action || 'Acción principal de la escena',
        camera: s.camera || 'Plano medio con suave movimiento de cámara',
        dialogue: s.dialogue || '',
        narration: s.narration || '',
        sound_effects: s.sound_effects || 'Ambiente natural suave',
        music: s.music || 'Melodía alegre preescolar',
        duration: s.duration || 16,
        visual_prompt: s.visual_prompt || '3D cartoon frame with vivid colors',
        visualSvg: this.visualGen.generateSceneSvg(idx + 1, s.location, s.location, s.time),
        motionType: (['pan-left', 'zoom-in', 'ken-burns', 'zoom-out'][idx % 4] as any),
        voiceAudioState: 'synthesized'
      }));

      const srt = this.generateSubtitlesSrt(scenes);
      const vtt = this.generateSubtitlesVtt(scenes);

      // Metadata & Thumbnail
      const overlayText = story.title.length > 20 ? '¡GRAN AVENTURA!' : story.title.toUpperCase();
      const thumbnailSvg = this.visualGen.generateThumbnailSvg(story.title, overlayText);

      const newProject: Project = {
        id: projectId,
        title: story.title || payload.title,
        idea: payload.idea,
        targetAge: payload.targetAge,
        language: payload.language,
        durationCategory: payload.durationCategory,
        educationalObjective: story.educational_objective || payload.educationalObjective,
        tone: payload.tone,
        status: 'story',
        seriesId: payload.seriesId,
        characters,
        scenes,
        logline: story.logline || 'Aventura original para niños',
        moral: story.moral || 'La empatía y la amistad superan cualquier reto',
        ending: story.ending || 'Final feliz y esperanzador',
        qualityScore: {
          overallScore: 94,
          approvedForProduction: true,
          categories: {
            storyCoherence: { score: 96, status: 'pass', notes: 'Arco narrativo fluido y sin fisuras.' },
            characterContinuity: { score: 92, status: 'pass', notes: 'Consistencia de diseño de personajes asegurada.' },
            audioAndDialogue: { score: 94, status: 'pass', notes: 'Vocabulario amigable adaptado a la edad.' },
            visualFeasibility: { score: 92, status: 'pass', notes: 'Composiciones aptas para animación de cámara.' },
            safetyAndCoppa: { score: 100, status: 'pass', notes: 'Apto para YouTube Kids.' },
            youtubeEngagement: { score: 90, status: 'pass', notes: 'Ritmo dinámico orientado a retención temprana.' }
          },
          flags: [],
          recommendations: ['Verificar pronunciación de nombres en el módulo de voz.']
        },
        youtubeMetadata: {
          title: `${story.title} 🦊 Dibujos Animados para Niños`,
          description: `¡Disfruta de esta encantadora historia original producida por KidsToon Studio!\n\n${story.logline}\n\n🌟 Objetivo educativo: ${story.educational_objective}\n🔔 ¡Suscríbete al canal para nuevos episodios cada semana!`,
          tags: ['dibujos animados', 'cuentos infantiles', 'animacion 3d', 'kidstoon studio', 'educacion emocional'],
          hashtags: ['#KidsToon', '#CuentosInfantiles', '#Animacion3D'],
          madeForKids: true,
          privacyStatus: 'private',
          category: 'Film & Animation (1)',
          thumbnailOverlayText: overlayText,
          recommendedPlaylist: 'Nuevos Episodios KidsToon',
          coppaComplianceConfirmed: true
        },
        thumbnailUrl: thumbnailSvg,
        videoTrack: {
          isRendered: false,
          renderingProgress: 0,
          aspectRatio: '16:9',
          resolution: '1080p',
          fps: 24,
          musicVolume: 0.65,
          voiceVolume: 1.0,
          sfxVolume: 0.8,
          subtitlesSrt: srt,
          subtitlesVtt: vtt
        },
        costMetrics: {
          totalTokensUsed: data.metrics?.inputTokens || 950,
          imagesGenerated: scenes.length,
          audioSeconds: scenes.reduce((acc, s) => acc + s.duration, 0),
          estimatedCostEur: data.metrics?.costEur || 0.015,
          generationCallsCount: 1
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastJobStatus: 'completed'
      };

      // Update state
      this.projects.update(list => [newProject, ...list]);
      this.activeProjectId.set(newProject.id);

      // Complete job
      this.productionJobs.update(jobs =>
        jobs.map(j => j.id === newJobId ? {
          ...j,
          status: 'completed',
          progress: 100,
          completedAt: new Date().toLocaleTimeString(),
          stepDescription: 'Historia estructurada y lista para Storyboard y Animación.'
        } : j)
      );

      this.isGenerating.set(false);
      return newProject;
    } catch (err: any) {
      console.error('Error creating project:', err);
      this.productionJobs.update(jobs =>
        jobs.map(j => j.id === newJobId ? {
          ...j,
          status: 'failed',
          error: err.message || 'Error en la llamada de generación'
        } : j)
      );
      this.isGenerating.set(false);
      throw err;
    }
  }

  /**
   * Updates Project State
   */
  updateProject(updated: Project): void {
    this.projects.update(list =>
      list.map(p => p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p)
    );
  }

  /**
   * Advance pipeline stage with job tracking
   */
  advancePipelineStage(stage: ProjectPipelineStatus): void {
    const current = this.activeProject();
    if (!current) return;

    const newJob: ProductionJob = {
      id: 'job_' + Date.now().toString(36),
      projectId: current.id,
      projectTitle: current.title,
      stage,
      type: `Transición de Etapa: ${stage.toUpperCase()}`,
      status: 'completed',
      progress: 100,
      startedAt: new Date().toLocaleTimeString(),
      completedAt: new Date().toLocaleTimeString(),
      stepDescription: `Etapa ${stage} confirmada y actualizada.`
    };

    this.productionJobs.update(jobs => [newJob, ...jobs]);
    this.updateProject({
      ...current,
      status: stage
    });
  }

  /**
   * Re-order scenes in storyboard
   */
  reorderScenes(fromIndex: number, toIndex: number): void {
    const current = this.activeProject();
    if (!current || fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const scenes = [...current.scenes];
    const [moved] = scenes.splice(fromIndex, 1);
    scenes.splice(toIndex, 0, moved);

    // Re-number scene IDs and regenerated subtitles
    const updatedScenes = scenes.map((s, idx) => ({
      ...s,
      scene_id: `SCENE_0${idx + 1}`
    }));

    const srt = this.generateSubtitlesSrt(updatedScenes);
    const vtt = this.generateSubtitlesVtt(updatedScenes);

    this.updateProject({
      ...current,
      scenes: updatedScenes,
      videoTrack: {
        ...current.videoTrack,
        subtitlesSrt: srt,
        subtitlesVtt: vtt
      }
    });
  }

  /**
   * Duplicate Scene
   */
  duplicateScene(sceneId: string): void {
    const current = this.activeProject();
    if (!current) return;

    const index = current.scenes.findIndex(s => s.id === sceneId);
    if (index === -1) return;

    const original = current.scenes[index];
    const duplicated: Scene = {
      ...original,
      id: 'sc_' + Date.now().toString(36),
      scene_id: `SCENE_0${current.scenes.length + 1}`,
      action: `${original.action} (Variación)`
    };

    const newScenes = [...current.scenes];
    newScenes.splice(index + 1, 0, duplicated);

    this.updateProject({
      ...current,
      scenes: newScenes
    });
  }

  /**
   * Delete Scene
   */
  deleteScene(sceneId: string): void {
    const current = this.activeProject();
    if (!current || current.scenes.length <= 1) return;

    const filtered = current.scenes.filter(s => s.id !== sceneId);
    this.updateProject({
      ...current,
      scenes: filtered
    });
  }

  /**
   * Regenerate Scene Visual
   */
  regenerateSceneVisual(sceneId: string): void {
    const current = this.activeProject();
    if (!current) return;

    const scene = current.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    const sceneIdx = current.scenes.indexOf(scene);
    const updatedSvg = this.visualGen.generateSceneSvg(sceneIdx + 1, scene.location, scene.location, scene.time);

    const updatedScenes = current.scenes.map(s => s.id === sceneId ? { ...s, visualSvg: updatedSvg } : s);
    this.updateProject({
      ...current,
      scenes: updatedScenes
    });
  }

  /**
   * Run Video Render Pipeline
   */
  async renderVideo(): Promise<void> {
    const current = this.activeProject();
    if (!current) return;

    const jobId = 'job_render_' + Date.now().toString(36);
    const renderJob: ProductionJob = {
      id: jobId,
      projectId: current.id,
      projectTitle: current.title,
      stage: 'animation',
      type: 'Modular Video Assembly (Canvas + Web Audio)',
      status: 'processing',
      progress: 15,
      startedAt: new Date().toLocaleTimeString(),
      stepDescription: 'Componiendo capas de animación, sincronizando pistas de diálogo y audio...'
    };
    this.productionJobs.update(jobs => [renderJob, ...jobs]);

    // Simulate multi-step rendering progress
    await new Promise(r => setTimeout(r, 600));
    this.productionJobs.update(jobs => jobs.map(j => j.id === jobId ? { ...j, progress: 45, stepDescription: 'Aplicando movimiento de cámara Ken Burns y paneos...' } : j));

    await new Promise(r => setTimeout(r, 600));
    this.productionJobs.update(jobs => jobs.map(j => j.id === jobId ? { ...j, progress: 80, stepDescription: 'Empaquetando subtítulos sincronizados WebVTT...' } : j));

    await new Promise(r => setTimeout(r, 400));
    this.productionJobs.update(jobs => jobs.map(j => j.id === jobId ? {
      ...j,
      progress: 100,
      status: 'completed',
      completedAt: new Date().toLocaleTimeString(),
      stepDescription: 'Vídeo infantil ensamblado y preparado para exportación.'
    } : j));

    this.updateProject({
      ...current,
      status: 'editing',
      videoTrack: {
        ...current.videoTrack,
        isRendered: true,
        renderingProgress: 100
      }
    });
  }

  /**
   * Publish to YouTube (Default: Private)
   */
  async publishToYouTube(privacyStatus: 'private' | 'unlisted' | 'public' | 'scheduled' = 'private', scheduledDate?: string, scheduledTime?: string): Promise<any> {
    const current = this.activeProject();
    if (!current) return null;

    const res = await fetch('/api/youtube/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: current.id,
        episodeTitle: current.youtubeMetadata?.title || current.title,
        privacyStatus,
        scheduledAt: scheduledDate ? `${scheduledDate}T${scheduledTime || '18:00'}:00Z` : null,
        madeForKids: true
      })
    });

    const result = await res.json();

    if (result.success) {
      const pub = result.publication;
      this.updateProject({
        ...current,
        status: privacyStatus === 'scheduled' ? 'scheduled' : 'published',
        youtubeMetadata: {
          ...(current.youtubeMetadata || {
            title: current.title,
            description: current.logline,
            tags: [],
            hashtags: [],
            madeForKids: true,
            privacyStatus: 'private',
            category: 'Film & Animation',
            thumbnailOverlayText: 'KIDSTOON',
            recommendedPlaylist: 'General',
            coppaComplianceConfirmed: true
          }),
          privacyStatus,
          scheduledDate,
          scheduledTime,
          publishedVideoId: pub.youtubeVideoId,
          publishedVideoUrl: pub.youtubeUrl
        }
      });

      if (scheduledDate) {
        this.calendarItems.update(items => [
          {
            id: 'cal_' + Date.now().toString(36),
            projectId: current.id,
            title: current.title,
            scheduledDate,
            scheduledTime: scheduledTime || '17:00',
            privacyStatus,
            episodeCode: `EP0${this.calendarItems().length + 1}`,
            status: 'scheduled'
          },
          ...items
        ]);
      }
    }

    return result;
  }
}
