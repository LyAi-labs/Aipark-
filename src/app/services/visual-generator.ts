import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisualGenerator {

  /**
   * Generates a stylized 3D-feel cartoon character SVG portrait
   */
  generateCharacterSvg(name: string, species: string, primaryColor = '#EA580C', secondaryColor = '#FEF3C7'): string {
    const isFox = species.toLowerCase().includes('zorro') || species.toLowerCase().includes('fox');
    const isHare = species.toLowerCase().includes('liebre') || species.toLowerCase().includes('conejo') || species.toLowerCase().includes('hare');

    if (isHare) {
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bgHare" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#1E293B"/>
              <stop offset="100%" stop-color="#0F172A"/>
            </radialGradient>
            <radialGradient id="furHare" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#CBD5E1"/>
              <stop offset="70%" stop-color="#94A3B8"/>
              <stop offset="100%" stop-color="#64748B"/>
            </radialGradient>
            <linearGradient id="earInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FDA4AF"/>
              <stop offset="100%" stop-color="#F43F5E"/>
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <rect width="400" height="400" rx="24" fill="url(#bgHare)"/>
          <!-- Light Rim -->
          <circle cx="200" cy="200" r="140" fill="none" stroke="#38BDF8" stroke-width="2" opacity="0.3"/>
          <!-- Hare Ears -->
          <ellipse cx="150" cy="110" rx="26" ry="85" fill="url(#furHare)" transform="rotate(-12 150 110)"/>
          <ellipse cx="150" cy="115" rx="14" ry="65" fill="url(#earInner)" opacity="0.8" transform="rotate(-12 150 115)"/>
          <ellipse cx="250" cy="110" rx="26" ry="85" fill="url(#furHare)" transform="rotate(12 250 110)"/>
          <ellipse cx="250" cy="115" rx="14" ry="65" fill="url(#earInner)" opacity="0.8" transform="rotate(12 250 115)"/>
          <!-- Body & Blue Vest -->
          <ellipse cx="200" cy="340" rx="90" ry="70" fill="url(#furHare)"/>
          <path d="M140 310 Q200 330 260 310 L270 380 Q200 395 130 380 Z" fill="#0284C7"/>
          <circle cx="200" cy="345" r="4" fill="#F8FAFC"/>
          <circle cx="200" cy="365" r="4" fill="#F8FAFC"/>
          <!-- Head -->
          <ellipse cx="200" cy="210" rx="80" ry="70" fill="url(#furHare)"/>
          <!-- Cheeks -->
          <ellipse cx="150" cy="225" rx="18" ry="12" fill="#F43F5E" opacity="0.25"/>
          <ellipse cx="250" cy="225" rx="18" ry="12" fill="#F43F5E" opacity="0.25"/>
          <!-- Big Expressive Eyes -->
          <ellipse cx="165" cy="195" rx="18" ry="24" fill="#0F172A"/>
          <circle cx="170" cy="188" r="7" fill="#FFFFFF"/>
          <circle cx="162" cy="204" r="3" fill="#FFFFFF"/>
          <ellipse cx="235" cy="195" rx="18" ry="24" fill="#0F172A"/>
          <circle cx="240" cy="188" r="7" fill="#FFFFFF"/>
          <circle cx="232" cy="204" r="3" fill="#FFFFFF"/>
          <!-- Nose & Mouth -->
          <path d="M194 220 L206 220 L200 228 Z" fill="#E11D48"/>
          <path d="M200 228 Q200 236 190 238 M200 228 Q200 236 210 238" stroke="#334155" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
      `;
    }

    // Default: Milo the Fox
    return `
      <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#27272A"/>
            <stop offset="100%" stop-color="#09090B"/>
          </radialGradient>
          <radialGradient id="furGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#FB923C"/>
            <stop offset="70%" stop-color="${primaryColor}"/>
            <stop offset="100%" stop-color="#C2410C"/>
          </radialGradient>
          <radialGradient id="muzzleGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#FFFBEB"/>
            <stop offset="100%" stop-color="${secondaryColor}"/>
          </radialGradient>
          <linearGradient id="greenPack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#84CC16"/>
            <stop offset="100%" stop-color="#4D7C0F"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" rx="24" fill="url(#bgGrad)"/>
        <!-- Studio Rim Ambient -->
        <circle cx="200" cy="190" r="145" fill="none" stroke="#F59E0B" stroke-width="2" opacity="0.3"/>
        <!-- Fox Ears -->
        <path d="M130 160 L100 70 Q130 90 170 120 Z" fill="url(#furGrad)"/>
        <path d="M125 145 L108 85 Q128 100 155 125 Z" fill="#FEF3C7" opacity="0.9"/>
        <path d="M270 160 L300 70 Q270 90 230 120 Z" fill="url(#furGrad)"/>
        <path d="M275 145 L292 85 Q272 100 245 125 Z" fill="#FEF3C7" opacity="0.9"/>
        <!-- Green Backpack Straps -->
        <path d="M140 280 L130 380 M260 280 L270 380" stroke="#65A30D" stroke-width="14" stroke-linecap="round"/>
        <rect x="155" y="320" width="90" height="70" rx="14" fill="url(#greenPack)"/>
        <circle cx="200" cy="345" r="7" fill="#FACC15"/>
        <!-- Body -->
        <ellipse cx="200" cy="330" rx="75" ry="60" fill="url(#furGrad)"/>
        <!-- Head -->
        <ellipse cx="200" cy="195" rx="88" ry="76" fill="url(#furGrad)"/>
        <!-- Muzzle -->
        <ellipse cx="200" cy="230" rx="52" ry="36" fill="url(#muzzleGrad)"/>
        <!-- Big Expressive Hazel Eyes -->
        <ellipse cx="160" cy="180" rx="19" ry="25" fill="#1C1917"/>
        <ellipse cx="160" cy="180" rx="15" ry="21" fill="#78350F"/>
        <circle cx="165" cy="172" r="7" fill="#FFFFFF"/>
        <circle cx="156" cy="188" r="3.5" fill="#FFFFFF"/>
        <ellipse cx="240" cy="180" rx="19" ry="25" fill="#1C1917"/>
        <ellipse cx="240" cy="180" rx="15" ry="21" fill="#78350F"/>
        <circle cx="245" cy="172" r="7" fill="#FFFFFF"/>
        <circle cx="236" cy="188" r="3.5" fill="#FFFFFF"/>
        <!-- Cheeks -->
        <circle cx="140" cy="225" r="14" fill="#F97316" opacity="0.3"/>
        <circle cx="260" cy="225" r="14" fill="#F97316" opacity="0.3"/>
        <!-- Nose & Smile -->
        <ellipse cx="200" cy="216" rx="11" ry="8" fill="#18181B"/>
        <path d="M200 224 L200 236 M190 236 Q200 248 210 236" stroke="#27272A" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
    `;
  }

  /**
   * Generates a 16:9 cinematic cartoon scene illustration
   */
  generateSceneSvg(sceneNumber: number, title: string, location: string, timeOfDay: string): string {
    const isSunset = timeOfDay.toLowerCase().includes('tarde') || timeOfDay.toLowerCase().includes('sunset') || timeOfDay.toLowerCase().includes('puesta');
    const isNoon = timeOfDay.toLowerCase().includes('mediodía') || timeOfDay.toLowerCase().includes('claro');

    const skyGradId = `sky_${sceneNumber}`;
    const lightColor = isSunset ? '#F97316' : (isNoon ? '#38BDF8' : '#FBBF24');

    return `
      <svg viewBox="0 0 960 540" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${skyGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            ${isSunset
              ? '<stop offset="0%" stop-color="#4C1D95"/><stop offset="50%" stop-color="#C2410C"/><stop offset="100%" stop-color="#FDE047"/>'
              : (isNoon
                ? '<stop offset="0%" stop-color="#0284C7"/><stop offset="60%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#BAE6FD"/>'
                : '<stop offset="0%" stop-color="#0369A1"/><stop offset="60%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#FEF08A"/>')}
          </linearGradient>
          <radialGradient id="sunGlow_${sceneNumber}" cx="75%" cy="30%" r="50%">
            <stop offset="0%" stop-color="${lightColor}" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="${lightColor}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Sky -->
        <rect width="960" height="540" fill="url(#${skyGradId})"/>
        <circle cx="720" cy="140" r="160" fill="url(#sunGlow_${sceneNumber})"/>
        <circle cx="720" cy="140" r="42" fill="#FEF08A" opacity="0.9"/>
        <!-- Distant Mountains -->
        <path d="M0 380 Q180 260 360 360 T720 320 T960 360 L960 540 L0 540 Z" fill="#064E3B" opacity="0.6"/>
        <path d="M-40 400 Q220 310 480 390 T980 380 L980 540 L-40 540 Z" fill="#047857" opacity="0.8"/>
        <!-- Big Oak Tree on Left -->
        <path d="M60 540 C110 460 80 320 140 260 C120 220 170 170 210 180 C260 150 330 190 320 250 C380 270 380 340 330 380 C360 460 340 540 340 540 Z" fill="#14532D"/>
        <!-- Ground / Meadow -->
        <path d="M0 430 Q240 400 480 440 T960 430 L960 540 L0 540 Z" fill="#15803D"/>
        <!-- Magical Sparkles -->
        <circle cx="480" cy="380" r="18" fill="#FDE047" opacity="0.75" filter="drop-shadow(0 0 8px #FACC15)"/>
        <circle cx="510" cy="360" r="8" fill="#FFFFFF"/>
        <circle cx="450" cy="400" r="12" fill="#38BDF8" opacity="0.8"/>
        <!-- Milo the Fox Character Silhouette/Render in Scene -->
        <g transform="translate(420, 310) scale(0.65)">
          <path d="M40 80 L20 20 Q50 30 70 50 Z" fill="#EA580C"/>
          <path d="M120 80 L140 20 Q110 30 90 50 Z" fill="#EA580C"/>
          <ellipse cx="80" cy="100" rx="46" ry="40" fill="#EA580C"/>
          <ellipse cx="80" cy="115" rx="26" ry="18" fill="#FEF3C7"/>
          <ellipse cx="80" cy="170" rx="40" ry="36" fill="#EA580C"/>
          <rect x="62" y="160" width="36" height="30" rx="8" fill="#65A30D"/>
          <circle cx="68" cy="94" r="7" fill="#1C1917"/>
          <circle cx="70" cy="91" r="2.5" fill="#FFFFFF"/>
          <circle cx="92" cy="94" r="7" fill="#1C1917"/>
          <circle cx="94" cy="91" r="2.5" fill="#FFFFFF"/>
        </g>
        <!-- Overlay Badge: Scene Marker -->
        <rect x="24" y="24" width="160" height="36" rx="8" fill="#09090B" fill-opacity="0.75"/>
        <text x="36" y="47" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#F59E0B">SCENE 0${sceneNumber}</text>
        <text x="110" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#A1A1AA">${timeOfDay.substring(0, 8)}</text>
        <!-- Camera Info Badge -->
        <rect x="24" y="480" width="340" height="36" rx="8" fill="#09090B" fill-opacity="0.8"/>
        <text x="36" y="503" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500" fill="#E4E4E7">${location}</text>
      </svg>
    `;
  }

  /**
   * Generates a 1280x720 YouTube Thumbnail
   */
  generateThumbnailSvg(title: string, overlayText: string): string {
    return `
      <svg viewBox="0 0 1280 720" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="thumbBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="50%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#311042"/>
          </linearGradient>
          <radialGradient id="magicSun" cx="65%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="#EF4444" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#311042" stop-opacity="0"/>
          </radialGradient>
          <filter id="thumbShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.9"/>
          </filter>
        </defs>
        <!-- Background -->
        <rect width="1280" height="720" fill="url(#thumbBg)"/>
        <circle cx="820" cy="320" r="420" fill="url(#magicSun)"/>
        <!-- Cinematic Rim Rays -->
        <path d="M0 720 L400 300 L500 720 Z" fill="#F59E0B" opacity="0.1"/>
        <path d="M200 720 L800 200 L950 720 Z" fill="#F43F5E" opacity="0.15"/>
        <!-- Large Character Hero Focus on Right Side (Milo) -->
        <g transform="translate(680, 160) scale(1.4)" filter="url(#thumbShadow)">
          <!-- Ears -->
          <path d="M120 150 L80 40 Q120 70 170 110 Z" fill="#EA580C"/>
          <path d="M115 130 L95 60 Q120 80 150 115 Z" fill="#FEF3C7"/>
          <path d="M280 150 L320 40 Q280 70 230 110 Z" fill="#EA580C"/>
          <path d="M285 130 L305 60 Q280 80 250 115 Z" fill="#FEF3C7"/>
          <!-- Head -->
          <ellipse cx="200" cy="190" rx="94" ry="84" fill="#EA580C"/>
          <ellipse cx="200" cy="225" rx="55" ry="40" fill="#FEF3C7"/>
          <!-- Expressive Huge Eyes -->
          <ellipse cx="155" cy="175" rx="22" ry="28" fill="#09090B"/>
          <ellipse cx="155" cy="175" rx="17" ry="23" fill="#854D0E"/>
          <circle cx="162" cy="166" r="8" fill="#FFFFFF"/>
          <ellipse cx="245" cy="175" rx="22" ry="28" fill="#09090B"/>
          <ellipse cx="245" cy="175" rx="17" ry="23" fill="#854D0E"/>
          <circle cx="252" cy="166" r="8" fill="#FFFFFF"/>
          <ellipse cx="200" cy="214" rx="12" ry="8" fill="#09090B"/>
          <path d="M188 230 Q200 248 212 230" stroke="#09090B" stroke-width="4" fill="none" stroke-linecap="round"/>
        </g>
        <!-- Luminous Magic Chest In Center -->
        <g transform="translate(560, 440) scale(1.1)" filter="url(#thumbShadow)">
          <rect x="0" y="40" width="160" height="110" rx="16" fill="#78350F" stroke="#F59E0B" stroke-width="4"/>
          <path d="M-10 40 Q80 0 170 40 L160 55 Q80 20 0 55 Z" fill="#9A3412" stroke="#F59E0B" stroke-width="4"/>
          <circle cx="80" cy="85" r="16" fill="#FACC15"/>
          <!-- Beams coming out of box -->
          <polygon points="80,85 10,-80 150,-80" fill="#FEF08A" opacity="0.6"/>
        </g>
        <!-- Huge YouTube Typography on Left (Max 3-5 words) -->
        <g transform="translate(80, 240)">
          <!-- Backdrop for text contrast -->
          <rect x="-24" y="-30" width="560" height="260" rx="20" fill="#09090B" fill-opacity="0.85" stroke="#27272A" stroke-width="2"/>
          <!-- Category badge -->
          <rect x="0" y="0" width="180" height="34" rx="8" fill="#F59E0B"/>
          <text x="14" y="23" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#09090B">KIDSTOON STUDIO</text>
          <!-- Main Catchy Title -->
          <text x="0" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="52" font-weight="800" fill="#FFFFFF" letter-spacing="-1">
            ${overlayText || '¡EL GRAN'}
          </text>
          <text x="0" y="155" font-family="'Plus Jakarta Sans', sans-serif" font-size="52" font-weight="800" fill="#FACC15" letter-spacing="-1">
            ${overlayText ? 'SECRETO!' : 'TESORO!'}
          </text>
          <text x="0" y="200" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="600" fill="#94A3B8">
            Valores · Cuentos Infantiles 3D
          </text>
        </g>
        <!-- Made For Kids Badge -->
        <rect x="1060" y="40" width="160" height="36" rx="8" fill="#0284C7" fill-opacity="0.9"/>
        <text x="1080" y="63" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">YOUTUBE KIDS</text>
      </svg>
    `;
  }
}
