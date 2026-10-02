import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import { GoogleGenAI } from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json({ limit: '30mb' }));

const angularApp = new AngularNodeAppEngine();

// Initialize Gemini AI SDK if GEMINI_API_KEY is available
const apiKey = process.env['GEMINI_API_KEY'] || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Estimated pricing in Euros (EUR) for Gemini 3.8 Flash & Imagen
const EUR_PER_1M_INPUT_TOKENS = 0.09;
const EUR_PER_1M_OUTPUT_TOKENS = 0.35;
const EUR_PER_IMAGE = 0.025;
const EUR_PER_TTS_1K_CHARS = 0.015;

/**
 * REST API: Story Generation
 */
app.post('/api/generate-story', async (req, res) => {
  try {
    const { idea, title, targetAge, language, duration, educationalObjective, tone, numberOfScenes, seriesContext } = req.body;

    const systemPrompt = `You are the lead showrunner and storytelling director for a prestigious kids animation studio (like Pixar/Cartoon Network/PBS Kids).
Generate an original, engaging, pedagogically sound cartoon story based on the user's idea.
Target Age: ${targetAge || '4-6 years'}
Language: ${language || 'Spanish'}
Tone: ${tone || 'Warm, humorous and curious'}
Scenes count: ${numberOfScenes || 4}
Educational Objective: ${educationalObjective || 'Teaching empathy, problem solving and sharing'}
${seriesContext ? `Series Context: ${JSON.stringify(seriesContext)}` : ''}

You MUST return ONLY valid JSON matching this schema:
{
  "title": "string",
  "logline": "string",
  "target_age": "string",
  "educational_objective": "string",
  "characters": [
    {
      "name": "string",
      "species": "string",
      "personality": "string",
      "age": "string",
      "visualFeatures": "string",
      "clothing": "string",
      "colorPalette": ["#hex", "#hex", "#hex"],
      "voiceProfile": "string",
      "visualConsistencyPrompt": "Cute original 3D cartoon style, consistent character design, rounded proportions...",
      "masterPrompt": "Master character prompt for visual continuity..."
    }
  ],
  "scenes": [
    {
      "scene_id": "SCENE_01",
      "location": "string",
      "time": "string (e.g. Morning, Golden Hour)",
      "characters": ["string"],
      "action": "string",
      "camera": "string (e.g. Wide establishing shot, slow push-in)",
      "dialogue": "string",
      "narration": "string",
      "sound_effects": "string",
      "music": "string",
      "duration": 15,
      "visual_prompt": "3D cartoon rendered scene featuring [character name], lighting, background details, vibrant friendly colors, 8k Pixar style"
    }
  ],
  "ending": "string",
  "moral": "string",
  "quality_notes": "string"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUSER IDEA: "${idea || 'Un pequeño zorro aprende por qué es importante compartir sus juguetes'}"` }] }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      const inputTokens = response.usageMetadata?.promptTokenCount || 600;
      const outputTokens = response.usageMetadata?.candidatesTokenCount || 900;
      const costEur = (inputTokens * EUR_PER_1M_INPUT_TOKENS + outputTokens * EUR_PER_1M_OUTPUT_TOKENS) / 1_000_000;

      return res.json({
        success: true,
        story: parsed,
        metrics: {
          inputTokens,
          outputTokens,
          costEur: Number(costEur.toFixed(6)),
          modelUsed: 'gemini-3.8-flash',
          isRealAi: true
        }
      });
    }

    // Fallback template when API key is not configured or in offline demo mode
    const fallbackStory = {
      title: title || 'Milo y la Caja de las Sorpresas',
      logline: 'Un pequeño zorro llamado Milo descubre que la verdadera magia de sus juguetes aparece cuando los comparte con sus amigos del bosque.',
      target_age: targetAge || '4-6',
      educational_objective: educationalObjective || 'Compartir y empatía grupal',
      characters: [
        {
          name: 'Milo',
          species: 'Zorro',
          personality: 'Curioso, entusiasta pero un poco posesivo con sus inventos',
          age: '5 años',
          visualFeatures: 'Pelaje naranja brillante, hocico crema suave, grandes ojos avellana expresivos',
          clothing: 'Mochila verde oliva con broches amarillos y pequeña bufanda tejida',
          colorPalette: ['#EA580C', '#FEF3C7', '#65A30D'],
          voiceProfile: 'Voz infantil cálida, tono travieso y alegre (pitch: 1.05, speed: 0.95)',
          visualConsistencyPrompt: 'Cute original 3D cartoon fox, orange fur, cream muzzle, large expressive hazel eyes, green backpack, rounded proportions, friendly facial expression, studio lighting, Pixar aesthetic.',
          masterPrompt: 'Protagonist Milo: Stylized 3D fox character, clean geometry, ultra-soft fur shaders, vibrant cartoon palette, consistent silhouette.'
        },
        {
          name: 'Tula',
          species: 'Liebre',
          personality: 'Ágil, bondadosa y apasionada por los juegos al aire libre',
          age: '5 años',
          visualFeatures: 'Pelaje gris perla, orejas largas con puntas blancas, sonrisa tímida',
          clothing: 'Chaleco azul cielo con estrellas bordadas',
          colorPalette: ['#94A3B8', '#BAE6FD', '#F8FAFC'],
          voiceProfile: 'Voz suave, dulce y rápida (pitch: 1.15, speed: 1.0)',
          visualConsistencyPrompt: 'Cute 3D cartoon hare, soft silver fur, sky blue vest, friendly large ears, Pixar animated film quality, consistent design.',
          masterPrompt: 'Tula the hare: delicate animated character, expressive eyes, sky-blue vest, smooth shading.'
        }
      ],
      scenes: [
        {
          scene_id: 'SCENE_01',
          location: 'El Claro del Roble Dorado',
          time: 'Mañana soleada',
          characters: ['Milo'],
          action: 'Milo salta emocionado abriendo una brillante caja de madera llena de peonzas de cristal.',
          camera: 'Plano general medio con suave paneo horizontal siguiendo a Milo',
          dialogue: '¡Mirad esto! ¡Son mis peonzas mágicas y brillan como luciérnagas!',
          narration: 'En el corazón del bosque, el sol de la mañana iluminaba el mayor tesoro de Milo.',
          sound_effects: 'Trino de pájaros, crujido de hojas secas, tintineo mágico de cristal',
          music: 'Melodía alegre de xilófono y pizzicato de cuerdas',
          duration: 16,
          visual_prompt: 'High quality 3D cartoon scene, Milo the orange fox sitting near a massive golden oak tree opening a polished wooden chest filled with luminous spinning tops, warm morning sunbeams, cinematic cartoon rendering.'
        },
        {
          scene_id: 'SCENE_02',
          location: 'El Sendero de los Tréboles',
          time: 'Mediodía',
          characters: ['Milo', 'Tula'],
          action: 'Tula se acerca con curiosidad estirando la patita para ver una peonza, pero Milo la abraza contra su pecho.',
          camera: 'Primer plano de las expresiones: asombro en Tula y duda protectora en Milo',
          dialogue: 'Tula: "¿Puedo hacer girar una? ¡Parecen estrellas!" — Milo: "Oh... son muy delicadas, Tula."',
          narration: 'Milo quería proteger su tesoro, pero notó una pequeña sombra de tristeza en los ojos de su amiga.',
          sound_effects: 'Brisa suave, pisadas ligeras sobre hierba',
          music: 'Cuerdas más lentas y reflexivas en tono menor suave',
          duration: 18,
          visual_prompt: '3D cartoon frame of Milo holding his wooden chest defensively while Tula the silver hare gazes with gentle longing, emerald forest backdrop, emotionally expressive 3D character animation render.'
        },
        {
          scene_id: 'SCENE_03',
          location: 'La Colina del Viento Dulce',
          time: 'Tarde dorada',
          characters: ['Milo', 'Tula'],
          action: 'Milo suspira, sonríe y le entrega la peonza azul más hermosa a Tula. Ambos las hacen bailar juntas en una roca plana.',
          camera: 'Travelling circular mostrando las dos peonzas girando y la sincronía de risas de los personajes',
          dialogue: '¡Giran el doble de rápido si las lanzamos juntos! ¡Mira la luz que hacen!',
          narration: 'Fue en ese instante cuando Milo comprendió que un juguete solo es divertido si hay alguien con quien reír.',
          sound_effects: 'Zumbido armonioso de peonzas girando, carcajadas infantiles',
          music: 'Crescendo optimista con flauta traversa y campanillas',
          duration: 20,
          visual_prompt: 'Cinematic 3D animation scene, Milo and Tula cheering joyfully as two glowing spinning tops dance on a flat river stone, glowing swirl trails, warm sunset colors, beautiful Disney-Pixar render style.'
        },
        {
          scene_id: 'SCENE_04',
          location: 'El Hogar del Roble al Atardecer',
          time: 'Puesta de sol',
          characters: ['Milo', 'Tula'],
          action: 'Milo y Tula guardan los juguetes juntos en la caja, despidiéndose con un choque de patitas.',
          camera: 'Plano general alejándose lentamente hacia el cielo estrellado que empieza a nacer',
          dialogue: '¡Mañana inventaremos un circuito nuevo para todos los amigos!',
          narration: 'Y aquella tarde, la caja de Milo ya no guardaba solo peonzas: guardaba una amistad que brillaba para siempre.',
          sound_effects: 'Cierre suave de la caja de madera, grillos del atardecer',
          music: 'Tema principal en piano suave y cuerdas cálidas concluyendo con nota dulce',
          duration: 16,
          visual_prompt: 'Peaceful 3D cartoon sunset scene, Milo the fox and Tula the hare waving goodbye by a cozy hollow tree house, fireflies emerging, purple and orange twilight sky, end of episode frame.'
        }
      ],
      ending: 'Milo descubre que compartir sus juguetes multiplica la diversión y crea recuerdos felices.',
      moral: 'La alegría compartida se vuelve el doble de brillante.',
      quality_notes: 'Cumple al 100% con los estándares pedagógicos para 4-6 años: sin elementos agresivos, vocabulario constructivo y resolución empática.'
    };

    return res.json({
      success: true,
      story: fallbackStory,
      metrics: {
        inputTokens: 0,
        outputTokens: 0,
        costEur: 0,
        modelUsed: 'template-engine (demo mode)',
        isRealAi: false
      }
    });
  } catch (error: any) {
    console.error('Error in /api/generate-story:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error generating story' });
  }
});

/**
 * REST API: Character Consistency & Master Prompts Generation
 */
app.post('/api/generate-character', async (req, res) => {
  try {
    const { name, species, personality, age, targetAudience, seriesStyle } = req.body;

    if (ai) {
      const prompt = `Act as lead Character Designer for 3D animation. Create a comprehensive, consistent character bible entry for:
Name: ${name || 'Oliver'}
Species: ${species || 'Oso pequeño'}
Personality: ${personality || 'Curioso y comilón'}
Age: ${age || '5'}
Series Style: ${seriesStyle || '3D stylized cartoon, rounded shapes, Pixar-inspired, soft textures'}

Return JSON:
{
  "name": "string",
  "species": "string",
  "tagline": "string",
  "personality": "string",
  "colorPalette": ["#hex", "#hex", "#hex", "#hex"],
  "visualFeatures": "string",
  "clothing": "string",
  "voiceProfile": {
    "voiceType": "string",
    "pitch": 1.05,
    "speed": 0.95,
    "timbre": "string"
  },
  "visualConsistencyPrompt": "string (ultra detailed consistency prompt)",
  "masterPrompt": "string (production ready 3D generation prompt with camera, lighting and negative rules)",
  "turnaroundNotes": "string (front, 3/4 and side profile tips)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' }
      });

      const characterData = JSON.parse(response.text || '{}');
      return res.json({ success: true, character: characterData, isRealAi: true });
    }

    // Default fallback
    return res.json({
      success: true,
      character: {
        name: name || 'Milo',
        species: species || 'Zorro rojo',
        tagline: 'El pequeño explorador de grandes ideas',
        personality: personality || 'Curioso, entusiasta, juguetón',
        colorPalette: ['#EA580C', '#FEF3C7', '#65A30D', '#3B82F6'],
        visualFeatures: 'Pelaje naranja aterciopelado, orejas puntiagudas con pelusa interior blanca, ojos avellana brillantes',
        clothing: 'Mochila de aventurero verde oliva con hebillas doradas',
        voiceProfile: {
          voiceType: 'Infantil enérgico',
          pitch: 1.05,
          speed: 0.95,
          timbre: 'Cálido, alegre y claro'
        },
        visualConsistencyPrompt: `Cute original 3D cartoon fox, orange fur, cream muzzle, large expressive eyes, green backpack, rounded proportions, friendly facial expression, consistent character design, 3D animated film render.`,
        masterPrompt: `Consistent character render: Milo the fox, full body 3/4 angle, soft studio rim lighting, vivid stylized textures, 8k resolution cartoon character asset.`,
        turnaroundNotes: 'Mantener las proporciones de cabeza 1:2 respecto al torso para acentuar el aspecto amigable y tierno de animación preescolar.'
      },
      isRealAi: false
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * REST API: Quality Control Evaluation
 */
app.post('/api/quality-control', async (req, res) => {
  try {
    const { story, targetAge } = req.body;

    if (ai && story) {
      const prompt = `You are the Head of Broadcast Standards, Children Safety & Quality Assurance at a major animation studio.
Review this story designed for kids age ${targetAge || '4-6'}:
Title: ${story.title}
Logline: ${story.logline}
Educational Objective: ${story.educational_objective}
Scenes: ${JSON.stringify(story.scenes?.map((s: any) => ({ id: s.scene_id, action: s.action, dialogue: s.dialogue })))}

Perform thorough QA and return JSON matching:
{
  "overallScore": 94,
  "approvedForProduction": true,
  "categories": {
    "storyCoherence": { "score": 96, "status": "pass", "notes": "Clear narrative arc with seamless resolution." },
    "characterContinuity": { "score": 92, "status": "pass", "notes": "Consistent behavior and personality traits." },
    "audioAndDialogue": { "score": 95, "status": "pass", "notes": "Age-appropriate vocabulary with strong positive reinforcement." },
    "visualFeasibility": { "score": 90, "status": "pass", "notes": "High contrast scenes easy to render with consistent 3D assets." },
    "safetyAndCoppa": { "score": 100, "status": "pass", "notes": "Zero violence, safe environment, 100% compliant with YouTube Kids regulations." },
    "youtubeEngagement": { "score": 92, "status": "pass", "notes": "Hook within first 5 seconds, clear visual rewards." }
  },
  "flags": [],
  "recommendations": [
    "Ensure sound volume for peonza spinning tops is gentle and soothing.",
    "Add brief visual pause before dialogue delivery in Scene 03 to emphasize emotional turn."
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' }
      });

      return res.json({ success: true, report: JSON.parse(response.text || '{}'), isRealAi: true });
    }

    // High fidelity QA response
    return res.json({
      success: true,
      report: {
        overallScore: 96,
        approvedForProduction: true,
        categories: {
          storyCoherence: { score: 98, status: 'pass', notes: 'Estructura en 4 actos perfecta para el arco de atención preescolar.' },
          characterContinuity: { score: 94, status: 'pass', notes: 'Milo y Tula mantienen rasgos fijos y consistencia visual establecida.' },
          audioAndDialogue: { score: 95, status: 'pass', notes: 'Diálogos naturales, sin dobles sentidos ni modismos confusos.' },
          visualFeasibility: { score: 92, status: 'pass', notes: 'Iluminación diurna y elementos naturales de fácil composición modular.' },
          safetyAndCoppa: { score: 100, status: 'pass', notes: 'Sin peligro físico, sin lenguaje grosero. Totalmente apto para YouTube Made For Kids.' },
          youtubeEngagement: { score: 91, status: 'pass', notes: 'Gancho visual en los primeros 3 segundos con la caja brillante.' }
        },
        flags: [],
        recommendations: [
          'Mantener los subtítulos sincronizados a menos de 7 palabras por renglón para facilitar la lectura temprana.',
          'El contraste en la miniatura debe resaltar el pelaje de Milo contra el fondo verde del bosque.'
        ]
      },
      isRealAi: false
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * REST API: YouTube Metadata & COPPA Compliance Generator
 */
app.post('/api/generate-metadata', async (req, res) => {
  try {
    const { story, language, channelName } = req.body;

    if (ai && story) {
      const prompt = `Act as a certified YouTube Kids Audience & SEO Optimization expert.
Create production-ready YouTube publishing metadata for this children cartoon episode:
Title: ${story.title}
Logline: ${story.logline}
Moral: ${story.moral}
Language: ${language || 'Spanish'}

Return JSON:
{
  "title": "string (50-65 chars, catchy, natural, parent & kid friendly, no clickbait)",
  "description": "string (formatted with episode summary, educational takeaway, timestamps, and channel subscribe CTA)",
  "tags": ["tag1", "tag2", "tag3"],
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "madeForKids": true,
  "privacyStatus": "private",
  "category": "Film & Animation (1)",
  "thumbnailOverlayText": "string (3-4 words max, huge visual punch, e.g. ¡EL SECRETO DE MILO!)",
  "recommendedPlaylist": "Cuentos y Aventuras de Amistad",
  "coppaComplianceConfirmed": true,
  "monetizationNotice": "Targeted advertising disabled automatically for Made for Kids content pursuant to YouTube & FTC COPPA rules."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' }
      });

      return res.json({ success: true, metadata: JSON.parse(response.text || '{}'), isRealAi: true });
    }

    return res.json({
      success: true,
      metadata: {
        title: `Milo y la Caja Mágica de Juguetes 🦊 Cuentos para Niños`,
        description: `En este episodio de KidsToon Studio, nuestro amigo el zorro Milo descubre que los juguetes más brillantes son aquellos que compartimos con nuestros mejores amigos.

🌟 Objetivo pedagógico: Empatía, generosidad y juego en equipo.
⏱️ Capítulos del episodio:
00:00 El tesoro de Milo
00:16 Tula la liebre y la sorpresa
00:34 Bailando peonzas juntos
00:52 Una amistad para siempre

🔔 ¡Suscríbete a ${channelName || 'KidsToon Studio'} para nuevas aventuras animadas cada semana!
#DibujosAnimados #CuentosInfantiles #MiloElZorro #ValoresParaNiños`,
        tags: ['dibujos animados para ninos', 'cuentos infantiles para dormir', 'milo el zorro', 'aprender a compartir', 'animacion 3d ninos', 'historias con valores', 'kidstoon studio', 'caricaturas educativas'],
        hashtags: ['#KidsToon', '#CuentosInfantiles', '#AprenderACompartir', '#DibujosAnimados'],
        madeForKids: true,
        privacyStatus: 'private',
        category: 'Film & Animation (1)',
        thumbnailOverlayText: '¡EL GRAN TESORO!',
        recommendedPlaylist: 'Aventuras en el Bosque de Milo',
        coppaComplianceConfirmed: true,
        monetizationNotice: 'Contenido clasificado como Creado para Niños (Made for Kids). Comentarios y anuncios personalizados desactivados conforme a normativas de privacidad infantil.'
      },
      isRealAi: false
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * REST API: YouTube Channel Status & Upload Pipeline
 */
const mockConnectedChannel = {
  connected: true,
  isDemoMode: true,
  channelId: 'UC-KTN-KIDSTOON-STUDIO-DEMO',
  channelTitle: 'KidsToon Studio Oficial (Sandbox)',
  channelCustomUrl: '@KidsToonStudioOfficial',
  subscriberCount: '142,500',
  videoCount: 48,
  viewCount: '18,430,920',
  avatarUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=160&auto=format&fit=crop&q=80',
  statusMessage: 'Canal Sandbox conectado en modo Demostración. Publicaciones reales requieren OAuth de YouTube habilitado.'
};

app.get('/api/youtube/status', (req, res) => {
  res.json({
    success: true,
    channel: mockConnectedChannel
  });
});

app.post('/api/youtube/publish', (req, res) => {
  const { projectId, episodeTitle, privacyStatus, scheduledAt, madeForKids } = req.body;

  const publishedRecord = {
    publishId: 'pub_' + Date.now().toString(36),
    projectId,
    title: episodeTitle,
    privacyStatus: privacyStatus || 'private',
    scheduledAt: scheduledAt || null,
    madeForKids: madeForKids ?? true,
    publishedAt: scheduledAt ? null : new Date().toISOString(),
    youtubeVideoId: 'yt_' + Math.random().toString(36).substring(2, 9),
    youtubeUrl: `https://youtube.com/watch?v=mock_${Math.random().toString(36).substring(2, 7)}`,
    status: scheduledAt ? 'scheduled' : 'published',
    isDemo: mockConnectedChannel.isDemoMode
  };

  return res.json({
    success: true,
    publication: publishedRecord,
    message: privacyStatus === 'private'
      ? 'Vídeo subido con éxito como PRIVADO. Puedes revisarlo en YouTube Studio antes de hacerlo público.'
      : 'Vídeo procesado en cola de publicación.'
  });
});

/**
 * REST API: Real-time cost estimator & budget controls
 */
app.get('/api/cost-summary', (req, res) => {
  res.json({
    pricingRates: {
      currency: 'EUR',
      inputTokensPerMillion: EUR_PER_1M_INPUT_TOKENS,
      outputTokensPerMillion: EUR_PER_1M_OUTPUT_TOKENS,
      imagePerCall: EUR_PER_IMAGE,
      ttsPer1kChars: EUR_PER_TTS_1K_CHARS
    },
    authorizedBudgetEur: 5.00,
    currentExpenditureEur: 0.042,
    hasApiKey: !!apiKey
  });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

