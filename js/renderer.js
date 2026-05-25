/* =============================================
   RENDERER.JS — Generates full iframe HTML from project state
   ============================================= */

const Renderer = (() => {

  // Font pair definitions
  const FONT_PAIRS = {
    'pair-1': {
      label: 'Syne + DM Sans',
      url: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600&display=swap',
      headingFamily: "'Syne', sans-serif",
      bodyFamily:    "'DM Sans', sans-serif",
    },
    'pair-2': {
      label: 'Playfair Display + Source Sans 3',
      url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap',
      headingFamily: "'Playfair Display', serif",
      bodyFamily:    "'Source Sans 3', sans-serif",
    },
    'pair-3': {
      label: 'Space Grotesk + Inter',
      url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap',
      headingFamily: "'Space Grotesk', sans-serif",
      bodyFamily:    "'Inter', sans-serif",
    },
    'pair-4': {
      label: 'Bricolage Grotesque + Outfit',
      url: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Outfit:wght@400;500;600&display=swap',
      headingFamily: "'Bricolage Grotesque', sans-serif",
      bodyFamily:    "'Outfit', sans-serif",
    },
    'pair-5': {
      label: 'Libre Baskerville + Lato',
      url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:wght@400;700&display=swap',
      headingFamily: "'Libre Baskerville', serif",
      bodyFamily:    "'Lato', sans-serif",
    },
    'pair-6': {
      label: 'JetBrains Mono + Inter',
      url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap',
      headingFamily: "'JetBrains Mono', monospace",
      bodyFamily:    "'Inter', sans-serif",
    },
  };

  // Viewport widths
  const VP_WIDTHS = {
    desktop: null,   // full width
    tablet:  768,
    mobile:  390,
  };

  // Layout preset body classes and their CSS tweaks
  const LAYOUT_PRESETS = {
    standard: '',
    compact: `
      section, footer, nav { --sp-3: 12px; --sp-4: 18px; --sp-5: 24px; --sp-6: 36px; }
      section { padding-top: 40px !important; padding-bottom: 40px !important; }
    `,
    spacious: `
      section { padding-top: 96px !important; padding-bottom: 96px !important; }
    `,
    editorial: `
      h1,h2,h3 { letter-spacing: -0.02em; }
      p { max-width: 60ch; }
      section { padding-left: var(--sp-6); padding-right: var(--sp-6); }
    `,
  };

  // Card style overrides
  const CARD_STYLES = {
    border:  '',
    shadow:  'div[style*="border:var(--border-w)"] { border-color: transparent !important; box-shadow: var(--shadow); }',
    flat:    'div[style*="border:var(--border-w)"] { border-color: transparent !important; background: var(--bg-el) !important; }',
    ghost:   '',
  };

  // Button style overrides
  const BUTTON_STYLES = {
    fill:    '',
    outline: `
      button[style*="background:var(--accent)"] { background: transparent !important; color: var(--accent) !important; border: 1.5px solid var(--accent) !important; }
    `,
    soft:    `
      button[style*="background:var(--accent)"] { background: color-mix(in oklch, var(--accent) 22%, var(--bg)) !important; color: var(--accent) !important; }
    `,
  };

  function getFontPair(id) {
    return FONT_PAIRS[id] || FONT_PAIRS['pair-1'];
  }

  function renderPage(project, page) {
    if (!page || !page.sections || page.sections.length === 0) {
      return '<p style="padding:40px;color:var(--text-2);text-align:center;font-size:14px">No sections on this page.</p>';
    }

    return page.sections.map(sec => {
      const sectionDef = Sections.get(sec.sectionId);
      if (!sectionDef) return `<!-- unknown section: ${sec.sectionId} -->`;

      const variantIdx = Math.min(sec.variantIndex || 0, sectionDef.variants.length - 1);
      const variant = sectionDef.variants[variantIdx];
      try {
        return variant.render();
      } catch(e) {
        return `<div style="padding:16px;color:#f85149;font-size:12px">Error rendering ${sec.sectionId}: ${e.message}</div>`;
      }
    }).join('\n');
  }

  function buildHTML(project, page, viewport = 'desktop') {
    const tokens = project.tokens || Storage.defaultTokens();
    const font = getFontPair(tokens.fontPair || 'pair-1');
    const cssVars = Color.generateCSSVars(tokens);
    const ts = tokens.typographyScale ?? 1;
    const tsBody = tokens.bodyScale ?? ts;
    const tsHeading = tokens.headingScale ?? ts;
    const btnScale = tokens.buttonScale ?? 1;
    const layoutCSS = LAYOUT_PRESETS[tokens.layoutPreset] || '';
    const cardCSS = CARD_STYLES[tokens.cardStyle] || '';
    const btnCSS = BUTTON_STYLES[tokens.buttonStyle] || '';

    Sections.setProjectName(project.name);
    const bodyContent = renderPage(project, page);

    // Glass effect overlay
    const glassCSS = tokens.glassEffect ? `
      [style*="background:var(--bg-card)"] {
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        background: rgba(255,255,255,0.04) !important;
        border-color: rgba(255,255,255,0.1) !important;
      }
    ` : '';

    // Contrast boost
    const contrastCSS = tokens.contrast && tokens.contrast > 1 ? `
      :root { filter: contrast(${1 + (tokens.contrast - 1) * 0.15}); }
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${font.url}" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      ${cssVars}
      --font-heading: ${font.headingFamily};
      --font-body: ${font.bodyFamily};
      --ts: ${ts};
      --ts-body: ${tsBody};
      --ts-heading: ${tsHeading};
      --btn-scale: ${btnScale};
    }
    html, body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-size: ${Math.round(14 * ts)}px;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
      overflow-x: clip;
    }
    h1,h2,h3,h4,h5,h6 { font-family: var(--font-heading); }
    img { max-width: 100%; }
    a { color: var(--accent); }
    input, textarea, select, button { font-family: var(--font-body); }
    .container { max-width: var(--container); margin: 0 auto; padding: 0 var(--sp-5); }

    /* ── Responsive grid helpers ─────────────────────────────── */
    /* These fire on real media queries inside the iframe,
       regardless of which viewport button is selected in the app */
    @media (max-width: 900px) {
      [style*="grid-template-columns:repeat(6"] {
        grid-template-columns: repeat(4,1fr) !important;
      }
    }
    @media (max-width: 700px) {
      [style*="grid-template-columns:1fr 1fr"],
      [style*="grid-template-columns:2fr 1fr"],
      [style*="grid-template-columns:1fr 2fr"],
      [style*="grid-template-columns:2fr repeat"],
      [style*="grid-template-columns:1fr repeat"],
      [style*="grid-template-columns:1fr 220px"],
      [style*="grid-template-columns:220px 1fr"],
      [style*="grid-template-columns:100px 1fr"],
      [style*="grid-template-columns:auto 1fr"] {
        grid-template-columns: 1fr !important;
      }
      [style*="grid-template-columns:repeat(3"] {
        grid-template-columns: repeat(2,1fr) !important;
      }
      [style*="grid-template-columns:repeat(6"] {
        grid-template-columns: repeat(3,1fr) !important;
      }
      [style*="grid-template-columns:repeat(4"] {
        grid-template-columns: repeat(2,1fr) !important;
      }
      nav { flex-wrap: wrap !important; }
      nav [style*="gap:24px"], nav [style*="gap:20px"] { display: none !important; }
      nav[style*="grid-template-columns"] { grid-template-columns: auto 1fr !important; }
      .nav-burger { display: flex !important; }
      nav a[style*="font-size:13px"], nav button[style*="padding:6px 14px"] { display: none !important; }
      section, footer { padding-left: var(--sp-3) !important; padding-right: var(--sp-3) !important; }
    }
    @media (max-width: 480px) {
      [style*="grid-template-columns:repeat(3"],
      [style*="grid-template-columns:repeat(4"] {
        grid-template-columns: 1fr !important;
      }
      [style*="font-size:44px"], [style*="font-size:42px"], [style*="font-size:38px"] {
        font-size: 28px !important;
      }
      [style*="font-size:36px"], [style*="font-size:34px"], [style*="font-size:32px"] {
        font-size: 24px !important;
      }
      section, footer { padding-left: var(--sp-2) !important; padding-right: var(--sp-2) !important; }
      /* Flex rows that need to wrap on small screens */
      section [style*="display:flex"][style*="justify-content:space-between"],
      footer [style*="display:flex"][style*="justify-content:space-between"] {
        flex-wrap: wrap !important;
        gap: 12px !important;
      }
      footer [style*="display:flex"][style*="gap:20px"],
      footer [style*="display:flex"][style*="gap:16px"] {
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
    }

    /* ── Viewport preview overrides (applied via JS viewport switcher) ─── */
    ${viewport === 'tablet' ? `
      [style*="grid-template-columns:repeat(3"] { grid-template-columns: repeat(2,1fr) !important; }
      [style*="grid-template-columns:repeat(6"] { grid-template-columns: repeat(4,1fr) !important; }
    ` : ''}
    /* Layout preset */
    ${layoutCSS}
    /* Card style */
    ${cardCSS}
    /* Button style */
    ${btnCSS}
    /* Glass */
    ${glassCSS}
    /* Contrast */
    ${contrastCSS}
    /* Typography scale — body sizes */
    [style*="font-size:11px"]{font-size:calc(11px * var(--ts-body))!important}
    [style*="font-size:12px"]{font-size:calc(12px * var(--ts-body))!important}
    [style*="font-size:13px"]{font-size:calc(13px * var(--ts-body))!important}
    [style*="font-size:14px"]{font-size:calc(14px * var(--ts-body))!important}
    [style*="font-size:15px"]{font-size:calc(15px * var(--ts-body))!important}
    [style*="font-size:16px"]{font-size:calc(16px * var(--ts-body))!important}
    [style*="font-size:17px"]{font-size:calc(17px * var(--ts-body))!important}
    [style*="font-size:18px"]{font-size:calc(18px * var(--ts-body))!important}
    [style*="font-size:20px"]{font-size:calc(20px * var(--ts-body))!important}
    [style*="font-size:22px"]{font-size:calc(22px * var(--ts-body))!important}
    /* Typography scale — heading sizes */
    [style*="font-size:24px"]{font-size:calc(24px * var(--ts-heading))!important}
    [style*="font-size:26px"]{font-size:calc(26px * var(--ts-heading))!important}
    [style*="font-size:28px"]{font-size:calc(28px * var(--ts-heading))!important}
    [style*="font-size:30px"]{font-size:calc(30px * var(--ts-heading))!important}
    [style*="font-size:32px"]{font-size:calc(32px * var(--ts-heading))!important}
    [style*="font-size:34px"]{font-size:calc(34px * var(--ts-heading))!important}
    [style*="font-size:36px"]{font-size:calc(36px * var(--ts-heading))!important}
    [style*="font-size:38px"]{font-size:calc(38px * var(--ts-heading))!important}
    [style*="font-size:40px"]{font-size:calc(40px * var(--ts-heading))!important}
    [style*="font-size:42px"]{font-size:calc(42px * var(--ts-heading))!important}
    [style*="font-size:44px"]{font-size:calc(44px * var(--ts-heading))!important}
    [style*="font-size:48px"]{font-size:calc(48px * var(--ts-heading))!important}
    [style*="font-size:72px"]{font-size:calc(72px * var(--ts-heading))!important}
    [style*="font-size:96px"]{font-size:calc(96px * var(--ts-heading))!important}
    /* Button size scale — targets section CTA buttons by padding, leaves nav (6px 14px) alone */
    section button[style*="padding:10px 20px"] {
      padding: calc(10px * var(--btn-scale)) calc(20px * var(--btn-scale)) !important;
      font-size: calc(14px * var(--btn-scale)) !important;
    }
    section button[style*="padding:12px 24px"] {
      padding: calc(12px * var(--btn-scale)) calc(24px * var(--btn-scale)) !important;
      font-size: calc(14px * var(--btn-scale)) !important;
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
  }

  function render(project, page, viewport = 'desktop') {
    const html = buildHTML(project, page, viewport);
    return html;
  }

  function getActivePage(project) {
    if (!project || !project.pages || project.pages.length === 0) return null;
    return project.pages.find(p => p.id === project.activePageId) || project.pages[0];
  }

  return { render, getActivePage, FONT_PAIRS, VP_WIDTHS };
})();
