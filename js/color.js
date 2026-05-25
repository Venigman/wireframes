/* =============================================
   COLOR.JS — OKLCH palette generator
   Converts hex input → 12-step OKLCH scale
   ============================================= */

const Color = (() => {

  // ── Hex → linear sRGB ──────────────────────
  function hexToLinear(hex) {
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;
    return [r,g,b].map(c => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
  }

  // ── Linear sRGB → OKLab ────────────────────
  function linearToOklab(r,g,b) {
    const l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b;
    const m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b;
    const s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b;
    const l_=Math.cbrt(l), m_=Math.cbrt(m), s_=Math.cbrt(s);
    return [
      0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
      1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
      0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_
    ];
  }

  // ── OKLab → OKLCH ──────────────────────────
  function oklabToOklch(L,a,b) {
    const C = Math.sqrt(a*a + b*b);
    const H = (Math.atan2(b,a)*180/Math.PI + 360) % 360;
    return [L, C, H];
  }

  // ── Hex → OKLCH ────────────────────────────
  function hexToOklch(hex) {
    const [r,g,b] = hexToLinear(hex);
    const [L,a,bv] = linearToOklab(r,g,b);
    return oklabToOklch(L,a,bv);
  }

  // ── OKLCH → OKLab ──────────────────────────
  function oklchToOklab(L,C,H) {
    const hr = H*Math.PI/180;
    return [L, C*Math.cos(hr), C*Math.sin(hr)];
  }

  // ── OKLab → linear sRGB ────────────────────
  function oklabToLinear(L,a,b) {
    const l_=L+0.3963377774*a+0.2158037573*b;
    const m_=L-0.1055613458*a-0.0638541728*b;
    const s_=L-0.0894841775*a-1.2914855480*b;
    const l=l_*l_*l_, m=m_*m_*m_, s=s_*s_*s_;
    return [
       4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
      -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
      -0.0041960863*l - 0.7034186147*m + 1.7076147010*s
    ];
  }

  // ── Linear sRGB → sRGB ─────────────────────
  function linearToSrgb(c) {
    if (c<=0) return 0; if (c>=1) return 1;
    return c<=0.0031308 ? 12.92*c : 1.055*Math.pow(c,1/2.4)-0.055;
  }

  // ── OKLCH → hex ────────────────────────────
  function oklchToHex(L,C,H) {
    const [La,a,b] = oklchToOklab(L,C,H);
    const [r,g,bv] = oklabToLinear(La,a,b).map(linearToSrgb).map(c=>Math.max(0,Math.min(255,Math.round(c*255))));
    return '#'+[r,g,bv].map(v=>v.toString(16).padStart(2,'0')).join('');
  }

  // ── Build 12-step scale ─────────────────────
  // Steps 1–12: 1=lightest (bg tint), 12=darkest (text on light)
  // Roles (light theme):
  //  1-2: app backgrounds
  //  3-4: component backgrounds
  //  5-6: borders / subtle fills
  //  7: border emphasis
  //  8: solid bg (subtle)
  //  9: solid bg (accent) ← main button/accent
  //  10: solid hover
  //  11-12: text
  function buildScale(hex, isDark = false) {
    const [,C,H] = hexToOklch(hex);
    const steps = [];

    // Light curve: L values for steps 1–12
    const lightL = [0.985,0.965,0.935,0.895,0.840,0.780,0.700,0.620,0.540,0.490,0.330,0.200];
    // Dark curve (inverted): step 1 is darkest bg, step 12 is lightest text
    const darkL  = [0.150,0.185,0.230,0.280,0.340,0.410,0.490,0.570,0.650,0.720,0.860,0.960];

    const Ls = isDark ? darkL : lightL;

    // Chroma envelope: low at very light/dark ends, peak around accent
    const chromaCurve = [0.01,0.02,0.04,0.06,0.09,0.12,0.15,0.17,0.19,0.18,0.14,0.08];

    for (let i=0; i<12; i++) {
      const l = Ls[i];
      const c = Math.min(C * (chromaCurve[i] / 0.19), C);
      steps.push({ hex: oklchToHex(l,c,H), l, c, h:H });
    }
    return steps;
  }

  // ── Build neutral gray (tinted toward primary) ─
  function buildNeutral(primaryHex, isDark = false) {
    const [,C,H] = hexToOklch(primaryHex);
    // Very low chroma, same hue — perceptually "warm" or "cool" neutral
    const neutralC = Math.min(C * 0.08, 0.015);
    const fakeHex = oklchToHex(0.55, neutralC, H);
    return buildScale(fakeHex, isDark);
  }

  // ── Apply palette as CSS variables ─────────────
  // Sets --color-{name}-{1..12} and semantic aliases
  function applyPalette(tokens, rootEl = document.documentElement) {
    // Nothing — palette is applied to the preview iframe, not the app root
  }

  // ── Generate full CSS variables string for iframe ─
  function generateCSSVars(tokens) {
    const { colors, theme } = tokens;
    const isDark = theme === 'dark';
    const primary = colors.primary || '#2F81F7';

    const scales = { primary: buildScale(primary, isDark) };
    const neutral = buildNeutral(primary, isDark);

    // Named roles
    const n = isDark ? {
      bg:         neutral[1].hex,
      bgCard:     neutral[2].hex,
      bgEl:       neutral[3].hex,
      bgHover:    neutral[4].hex,
      border:     neutral[4].hex,
      borderSub:  neutral[3].hex,
      borderEmph: scales.primary[7].hex,
      text:       neutral[11].hex,
      text2:      neutral[9].hex,
      text3:      neutral[7].hex,
      accent:     scales.primary[8].hex,
      accentHov:  scales.primary[9].hex,
      accentSub:  scales.primary[1].hex,
    } : {
      bg:         neutral[0].hex,
      bgCard:     neutral[1].hex,
      bgEl:       neutral[2].hex,
      bgHover:    neutral[3].hex,
      border:     neutral[4].hex,
      borderSub:  neutral[3].hex,
      borderEmph: scales.primary[8].hex,
      text:       neutral[11].hex,
      text2:      neutral[10].hex,
      text3:      neutral[7].hex,
      accent:     scales.primary[8].hex,
      accentHov:  scales.primary[9].hex,
      accentSub:  scales.primary[1].hex,
    };

    const r = tokens.radius ?? 8;
    const sp = tokens.spacing ?? 1;
    const bw = tokens.borderWidth ?? 1;
    const sh = tokens.shadowLevel ?? 1;

    const shadowMap = {
      0: 'none',
      1: '0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.08)',
      2: '0 4px 12px rgba(0,0,0,.15), 0 2px 4px rgba(0,0,0,.1)',
      3: '0 8px 32px rgba(0,0,0,.2), 0 4px 8px rgba(0,0,0,.12)',
    };
    const shadow = shadowMap[sh] || shadowMap[1];

    return `
      --bg: ${n.bg};
      --bg-card: ${n.bgCard};
      --bg-el: ${n.bgEl};
      --bg-hover: ${n.bgHover};
      --border: ${n.border};
      --border-sub: ${n.borderSub};
      --border-emph: ${n.borderEmph};
      --text: ${n.text};
      --text-2: ${n.text2};
      --text-3: ${n.text3};
      --accent: ${n.accent};
      --accent-h: ${n.accentHov};
      --accent-sub: ${n.accentSub};
      --radius: ${r}px;
      --radius-sm: ${Math.max(2, r-2)}px;
      --radius-lg: ${r+4}px;
      --sp: ${sp};
      --sp-1: ${4*sp}px;
      --sp-2: ${8*sp}px;
      --sp-3: ${16*sp}px;
      --sp-4: ${24*sp}px;
      --sp-5: ${32*sp}px;
      --sp-6: ${48*sp}px;
      --sp-7: ${64*sp}px;
      --border-w: ${bw}px;
      --shadow: ${shadow};
      --container: ${tokens.containerWidth === 'narrow' ? '760px' : tokens.containerWidth === 'wide' ? '1280px' : '1080px'};
    `;
  }

  // ── Color presets ────────────────────────────
  const PRESETS = [
    { name:'Blue',     hex:'#2F81F7' },
    { name:'Purple',   hex:'#8957E5' },
    { name:'Emerald',  hex:'#2DA44E' },
    { name:'Rose',     hex:'#E5534B' },
    { name:'Amber',    hex:'#D29922' },
    { name:'Teal',     hex:'#1B7C83' },
    { name:'Indigo',   hex:'#4F6EF5' },
    { name:'Slate',    hex:'#6B7280' },
  ];

  // ── Scale preview swatches HTML ──────────────
  function renderScaleSwatches(hex, isDark = false) {
    const scale = buildScale(hex, isDark);
    return scale.map((s,i) =>
      `<div class="color-scale-step" style="background:${s.hex}" title="Step ${i+1}: ${s.hex}"></div>`
    ).join('');
  }

  return { hexToOklch, oklchToHex, buildScale, buildNeutral, generateCSSVars, PRESETS, renderScaleSwatches };
})();
