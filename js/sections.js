/* =============================================
   SECTIONS.JS — Section library + HTML renderers
   Each section has 2-3 genuinely different layout variants.
   All output uses CSS vars from design tokens.
   ============================================= */

const Sections = (() => {

  const _sections = {};

  function register(id, label, icon, variants) {
    _sections[id] = { id, label, icon, variants };
  }

  function get(id) { return _sections[id] || null; }
  function list() { return Object.values(_sections); }

  // ─── Shared helpers ────────────────────────────────────────────────────────

  const NAV_LINKS = `<a href="#" style="color:var(--text-2);font-size:13px;text-decoration:none">Product</a>
    <a href="#" style="color:var(--text-2);font-size:13px;text-decoration:none">Pricing</a>
    <a href="#" style="color:var(--text-2);font-size:13px;text-decoration:none">Docs</a>
    <a href="#" style="color:var(--text-2);font-size:13px;text-decoration:none">Blog</a>`;

  const NAV_CTA = `<button style="background:var(--accent);color:#fff;border:none;padding:6px 14px;border-radius:var(--radius-sm);font-size:13px;cursor:pointer">Get started</button>`;
  const NAV_BURGER = `<button class="nav-burger" style="display:none;background:transparent;border:none;cursor:pointer;color:var(--text);padding:4px;align-items:center;justify-content:center"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="2" y1="5" x2="18" y2="5"/><line x1="2" y1="10" x2="18" y2="10"/><line x1="2" y1="15" x2="18" y2="15"/></svg></button>`;

  let _projectName = 'Brand';
  const LOGO = () => `<span style="font-weight:700;font-size:16px;color:var(--text)">${_projectName}</span>`;

  function BADGE(text) {
    return `<span style="display:inline-flex;align-items:center;gap:6px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:999px;padding:4px 12px;font-size:11px;color:var(--text-2);margin-bottom:12px">${text}</span>`;
  }

  function HEADING(text, size = 36) {
    return `<h2 style="margin:0 0 12px;font-size:${size}px;font-weight:700;line-height:1.2;color:var(--text)">${text}</h2>`;
  }

  function SUBTEXT(text) {
    return `<p style="margin:0 0 24px;font-size:15px;color:var(--text-2);line-height:1.6;max-width:480px">${text}</p>`;
  }

  function PILL(text, active = false) {
    return `<span style="padding:4px 12px;border-radius:999px;font-size:12px;background:${active ? 'var(--accent)' : 'var(--bg-el)'};color:${active ? '#fff' : 'var(--text-2)'};border:var(--border-w) solid ${active ? 'transparent' : 'var(--border)'}">${text}</span>`;
  }

  function CARD(content, extra = '') {
    return `<div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);${extra}">${content}</div>`;
  }

  function BTN_PRIMARY(text = 'Get started') {
    return `<button style="background:var(--accent);color:#fff;border:none;padding:10px 20px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer">${text}</button>`;
  }

  function BTN_GHOST(text = 'Learn more') {
    return `<button style="background:transparent;color:var(--text-2);border:var(--border-w) solid var(--border);padding:10px 20px;border-radius:var(--radius-sm);font-size:14px;cursor:pointer">${text}</button>`;
  }

  function ICON_BOX(icon) {
    return `<div style="width:36px;height:36px;border-radius:var(--radius-sm);background:var(--accent-sub);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent)">${icon}</div>`;
  }

  function AVATAR(initials, color = 'var(--accent)') {
    return `<div style="width:36px;height:36px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;flex-shrink:0">${initials}</div>`;
  }

  function BAR(w, h = 6, color = 'var(--accent)') {
    return `<div style="height:${h}px;border-radius:999px;background:var(--bg-el);overflow:hidden"><div style="height:100%;width:${w}%;background:${color};border-radius:999px"></div></div>`;
  }

  function MINI_CHART() {
    const pts = [28,48,35,62,45,72,55,80,60,85];
    const w = 160, h = 48;
    const maxV = Math.max(...pts);
    const coords = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / maxV) * h}`).join(' ');
    const fill = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / maxV) * h}`).join(' ') + ` ${w},${h} 0,${h}`;
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="48" preserveAspectRatio="none" style="display:block">
      <polygon points="${fill}" fill="var(--accent)" opacity=".15"/>
      <polyline points="${coords}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function DASH_CARD(label, val, change) {
    return `<div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:12px 14px">
      <div style="font-size:11px;color:var(--text-3);margin-bottom:4px">${label}</div>
      <div style="font-size:20px;font-weight:700;color:var(--text)">${val}</div>
      <div style="font-size:11px;color:${change.startsWith('+') ? '#3fb950' : '#f85149'};margin-top:2px">${change}</div>
    </div>`;
  }

  // ─── SECTION: Navbar ───────────────────────────────────────────────────────

  register('navbar', 'Navbar', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 4h12M1 8h8M1 12h5"/></svg>', [
    {
      label: 'Standard',
      preview: '│logo  links  cta│',
      render: () => `
        <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px var(--sp-5);background:var(--bg);border-bottom:var(--border-w) solid var(--border);gap:16px;position:sticky;top:0;z-index:100">
          ${LOGO()}
          <div style="display:flex;gap:24px;align-items:center">${NAV_LINKS}</div>
          <div style="display:flex;gap:8px;align-items:center">
            <a href="#" style="color:var(--text-2);font-size:13px;text-decoration:none">Sign in</a>
            ${NAV_CTA}
            ${NAV_BURGER}
          </div>
        </nav>`
    },
    {
      label: 'Centered logo',
      preview: 'links│LOGO│cta',
      render: () => `
        <nav style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:14px var(--sp-5);background:var(--bg);border-bottom:var(--border-w) solid var(--border);position:sticky;top:0;z-index:100">
          <div style="display:flex;gap:20px;align-items:center">${NAV_LINKS}</div>
          ${LOGO()}
          <div style="display:flex;gap:8px;align-items:center;justify-content:flex-end">
            <a href="#" style="color:var(--text-2);font-size:13px;text-decoration:none">Sign in</a>
            ${NAV_CTA}
            ${NAV_BURGER}
          </div>
        </nav>`
    },
    {
      label: 'Floating pill',
      preview: '  ╭logo links cta╮  ',
      render: () => `
        <div style="padding:12px var(--sp-5);position:sticky;top:0;z-index:100;isolation:isolate">
          <div style="position:absolute;inset:0;pointer-events:none;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);mask-image:linear-gradient(to bottom,black 0%,black 30%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,black 0%,black 30%,transparent 100%)"></div>
          <nav style="position:relative;display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:color-mix(in srgb,var(--bg) 65%,transparent);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid color-mix(in srgb,var(--border) 60%,transparent);border-radius:var(--radius-lg);max-width:900px;margin:0 auto;gap:16px">
            ${LOGO()}
            <div style="display:flex;gap:20px;align-items:center">${NAV_LINKS}</div>
            <div style="display:flex;gap:8px;align-items:center">
              <a href="#" style="color:var(--text-2);font-size:13px;text-decoration:none">Sign in</a>
              ${NAV_CTA}
              ${NAV_BURGER}
            </div>
          </nav>
        </div>`
    },
  ]);

  // ─── SECTION: Hero ────────────────────────────────────────────────────────

  register('hero', 'Hero', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="12" height="9" rx="1"/><path d="M4 6h6M4 9h4"/></svg>', [
    {
      label: 'Centered',
      preview: '  [badge]\n  heading\n  sub\n [btn][btn]',
      render: () => `
        <section style="text-align:center;padding:72px var(--sp-5) 64px;background:var(--bg)">
          ${BADGE('Now in public beta')}
          ${HEADING('Privacy-first analytics<br>for modern teams', 44)}
          <p style="margin:0 auto 28px;font-size:16px;color:var(--text-2);max-width:520px;line-height:1.6">Track what matters without compromising your users. GDPR-ready, cookieless, and blazing fast.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${BTN_PRIMARY('Start free trial')}
            ${BTN_GHOST('See how it works')}
          </div>
          <p style="margin:16px 0 0;font-size:12px;color:var(--text-3)">No credit card required · 14-day free trial</p>
        </section>`
    },
    {
      label: 'Split — text + visual',
      preview: 'text left | visual right',
      render: () => `
        <section style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-6);align-items:center;padding:64px var(--sp-5);background:var(--bg);max-width:var(--container);margin:0 auto">
          <div>
            ${BADGE('v2.0 just shipped')}
            ${HEADING('Know your users.<br>Respect their privacy.', 38)}
            ${SUBTEXT('Real-time insights without cookies or personal data collection. Works everywhere, complies everywhere.')}
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              ${BTN_PRIMARY('Get started free')}
              ${BTN_GHOST('View demo')}
            </div>
          </div>
          <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:20px;display:flex;flex-direction:column;gap:10px">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
              ${DASH_CARD('Visitors','24.8k','+12%')}
              ${DASH_CARD('Sessions','41.2k','+8%')}
              ${DASH_CARD('Bounce','34%','-3%')}
            </div>
            <div style="border-radius:var(--radius-sm);overflow:hidden;padding:4px 0">${MINI_CHART()}</div>
          </div>
        </section>`
    },
    {
      label: 'Text top + large visual',
      preview: 'heading + sub\n[────────────]',
      render: () => `
        <section style="padding:64px var(--sp-5) 0;background:var(--bg);text-align:center;max-width:var(--container);margin:0 auto">
          ${BADGE('Trusted by 2,400+ teams')}
          ${HEADING('Analytics that respect privacy', 42)}
          <p style="margin:0 auto 32px;font-size:16px;color:var(--text-2);max-width:540px;line-height:1.6">Stop tracking users like criminals. Umbra gives you everything you need, nothing you shouldn't have.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:40px">
            ${BTN_PRIMARY('Try for free')}
            ${BTN_GHOST('Watch 2 min demo')}
          </div>
          <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-top-left-radius:var(--radius);border-top-right-radius:var(--radius);padding:24px;min-height:180px">
            <div style="display:flex;gap:8px;margin-bottom:16px">
              <div style="width:10px;height:10px;border-radius:50%;background:#f85149;opacity:.7"></div>
              <div style="width:10px;height:10px;border-radius:50%;background:#e3b341;opacity:.7"></div>
              <div style="width:10px;height:10px;border-radius:50%;background:#3fb950;opacity:.7"></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:12px">
              ${DASH_CARD('Pageviews','128.4k','+22%')}
              ${DASH_CARD('Uniques','38.9k','+15%')}
              ${DASH_CARD('Avg. time','3m 42s','+4%')}
              ${DASH_CARD('Conv. rate','4.2%','+0.8%')}
            </div>
            ${MINI_CHART()}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Logos / trust bar ───────────────────────────────────────────

  register('logos', 'Logos / trust bar', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="5" width="4" height="4" rx="1"/><rect x="5.5" y="5" width="3" height="4" rx="1"/><rect x="9" y="5" width="4" height="4" rx="1"/></svg>', [
    {
      label: 'Inline strip',
      preview: 'Trusted by: A  B  C  D  E',
      render: () => `
        <section style="padding:32px var(--sp-5);border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border);background:var(--bg)">
          <div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap;justify-content:center;max-width:var(--container);margin:0 auto">
            <span style="font-size:12px;color:var(--text-3);white-space:nowrap">Trusted by teams at</span>
            ${['Stripe','Notion','Linear','Vercel','Loom','Figma'].map(n=>`<span style="font-size:15px;font-weight:600;color:var(--text-3);letter-spacing:-.3px">${n}</span>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Grid with frames',
      preview: '┌──┐ ┌──┐ ┌──┐\n│A │ │B │ │C │',
      render: () => `
        <section style="padding:40px var(--sp-5);background:var(--bg)">
          <p style="text-align:center;font-size:12px;color:var(--text-3);margin:0 0 20px;text-transform:uppercase;letter-spacing:1px">Trusted by world-class teams</p>
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;max-width:var(--container);margin:0 auto">
            ${['Stripe','Notion','Linear','Vercel','Loom','Figma'].map(n=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:14px;display:flex;align-items:center;justify-content:center">
                <span style="font-size:13px;font-weight:600;color:var(--text-3)">${n}</span>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Big numbers row',
      preview: '2,400  40%  <50ms  99.9%',
      render: () => `
        <section style="padding:40px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border)">
          <p style="text-align:center;font-size:12px;color:var(--text-3);margin:0 0 28px;text-transform:uppercase;letter-spacing:1px">Trusted by 2,400+ teams</p>
          <div style="display:flex;gap:0;max-width:var(--container);margin:0 auto;flex-wrap:wrap">
            ${[['2,400+','customers'],['40%','less churn'],['<50ms','p99 latency'],['99.9%','uptime SLA']].map(([v,l],i,arr)=>`
              <div style="flex:1;min-width:140px;text-align:center;padding:0 var(--sp-4)${i<arr.length-1?';border-right:var(--border-w) solid var(--border)':''}">
                <div style="font-size:28px;font-weight:700;color:var(--text);line-height:1">${v}</div>
                <div style="font-size:12px;color:var(--text-3);margin-top:6px">${l}</div>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Features grid ───────────────────────────────────────────────

  const FEATURES = [
    { icon:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2L4 10h5l-1 5 6-8H9l1-5z"/></svg>', title:'Real-time', desc:'See visitors the moment they land, with sub-second latency.' },
    { icon:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 11a4 4 0 1 0-8 0"/><path d="M8 7V3M5 4l1.5 1.5M11 4l-1.5 1.5"/></svg>', title:'Cookieless', desc:'No consent banners needed. Fully GDPR & PECR compliant.' },
    { icon:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="10" height="8" rx="1"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>', title:'Private by design', desc:'No PII, no fingerprinting, no cross-site tracking.' },
    { icon:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12l3-4 3 2 3-5 3 3"/></svg>', title:'Custom events', desc:'Track any interaction with a single line of JS.' },
    { icon:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 3-2 9 0 12M8 2c2 3 2 9 0 12"/></svg>', title:'Geo & device', desc:'Country, browser, OS breakdowns without selling data.' },
    { icon:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 9a3 3 0 0 0 4.24.06l2-2a3 3 0 0 0-4.24-4.24l-1.14 1.14"/><path d="M9 7a3 3 0 0 0-4.24-.06l-2 2a3 3 0 0 0 4.24 4.24l1.13-1.13"/></svg>', title:'Integrations', desc:'Connect to Slack, Notion, Zapier and 40+ tools.' },
  ];

  register('features-grid', 'Features grid', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>', [
    {
      label: '3-col card grid',
      preview: '┌─┐┌─┐┌─┐\n└─┘└─┘└─┘',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Features')}
            ${HEADING('Everything you need', 34)}
            ${SUBTEXT('A full analytics suite without the privacy compromises.')}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:var(--container);margin:0 auto">
            ${FEATURES.map(f=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                ${ICON_BOX(f.icon)}
                <h3 style="margin:12px 0 6px;font-size:15px;font-weight:600;color:var(--text)">${f.title}</h3>
                <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">${f.desc}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Zigzag alternating',
      preview: '●  ▌\n▌  ●',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg);max-width:var(--container);margin:0 auto">
          <div style="text-align:center;margin-bottom:48px">
            ${BADGE('Features')}
            ${HEADING('Built different', 34)}
          </div>
          ${FEATURES.slice(0,4).map((f,i)=>`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-5);align-items:center;margin-bottom:48px;direction:${i%2===1?'rtl':'ltr'}">
              <div style="direction:ltr">
                ${ICON_BOX(f.icon)}
                <h3 style="margin:12px 0 8px;font-size:20px;font-weight:600;color:var(--text)">${f.title}</h3>
                <p style="margin:0;font-size:14px;color:var(--text-2);line-height:1.6">${f.desc} Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.</p>
              </div>
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);min-height:120px;direction:ltr;display:flex;align-items:center;justify-content:center">
                <span style="font-size:40px">${f.icon}</span>
              </div>
            </div>`).join('')}
        </section>`
    },
    {
      label: 'Bento mixed grid',
      preview: '┌──┬─┐\n├─┬┴─┤\n└─┴──┘',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Features')}
            ${HEADING('Every tool in one place', 34)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:160px;gap:12px;max-width:var(--container);margin:0 auto">
            <div style="grid-column:span 2;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:flex-end">
              ${ICON_BOX(FEATURES[0].icon)}
              <h3 style="margin:10px 0 4px;font-size:16px;font-weight:600;color:var(--text)">${FEATURES[0].title}</h3>
              <p style="margin:0;font-size:12px;color:var(--text-2)">${FEATURES[0].desc}</p>
            </div>
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:flex-end">
              ${ICON_BOX(FEATURES[1].icon)}
              <h3 style="margin:10px 0 4px;font-size:15px;font-weight:600;color:var(--text)">${FEATURES[1].title}</h3>
              <p style="margin:0;font-size:12px;color:var(--text-2)">${FEATURES[1].desc}</p>
            </div>
            ${FEATURES.slice(2,5).map(f=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:flex-end">
                ${ICON_BOX(f.icon)}
                <h3 style="margin:10px 0 4px;font-size:14px;font-weight:600;color:var(--text)">${f.title}</h3>
                <p style="margin:0;font-size:12px;color:var(--text-2)">${f.desc}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Feature spotlight ───────────────────────────────────────────

  register('feature-spotlight', 'Feature spotlight', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="3"/><path d="M7 1v1M7 12v1M1 7h1M12 7h1M3.2 3.2l.7.7M10.1 10.1l.7.7M3.2 10.8l.7-.7M10.1 3.9l.7-.7"/></svg>', [
    {
      label: 'Text left, visual right',
      preview: '≡≡≡  |  [visual]',
      render: () => `
        <section style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-6);align-items:center;padding:72px var(--sp-5);background:var(--bg);max-width:var(--container);margin:0 auto">
          <div>
            ${BADGE('Spotlight')}
            ${HEADING('See exactly where users go', 32)}
            <p style="margin:0 0 20px;font-size:14px;color:var(--text-2);line-height:1.6">Heatmaps, session replays, and funnel analysis — all without collecting a single byte of personal data. Every interaction anonymised at the edge.</p>
            <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px">
              ${['Click & scroll heatmaps','Funnel drop-off analysis','Source attribution'].map(t=>`<li style="display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text-2)"><svg width="12" height="12" fill="none" stroke="var(--accent)" stroke-width="2.5" style="flex-shrink:0"><path d="M2 6l3 3 5-5"/></svg>${t}</li>`).join('')}
            </ul>
          </div>
          <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:20px">
            <div style="font-size:12px;color:var(--text-3);margin-bottom:12px">Funnel — this week</div>
            ${[['Visited landing','100%',100],['Started signup','68%',68],['Completed form','41%',41],['Activated','24%',24]].map(([l,v,w])=>`
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2);margin-bottom:4px"><span>${l}</span><span>${v}</span></div>
                ${BAR(w, 8)}
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Text right, visual left',
      preview: '[visual]  |  ≡≡≡',
      render: () => `
        <section style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-6);align-items:center;padding:72px var(--sp-5);background:var(--bg);max-width:var(--container);margin:0 auto">
          <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:20px">
            <div style="font-size:12px;color:var(--text-3);margin-bottom:12px">Top pages — 7 days</div>
            ${[['/pricing','4,201 views'],['/ (home)','3,890 views'],['/blog/privacy','2,150 views'],['/docs','1,740 views']].map(([p,v])=>`
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:var(--border-w) solid var(--border-sub);font-size:12px">
                <span style="color:var(--text-2)">${p}</span>
                <span style="color:var(--text-3)">${v}</span>
              </div>`).join('')}
          </div>
          <div>
            ${BADGE('Deep insight')}
            ${HEADING('Know your best content', 32)}
            <p style="margin:0 0 20px;font-size:14px;color:var(--text-2);line-height:1.6">Instantly see which pages drive conversions, where users bounce, and what content earns them back — no data science degree required.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              ${BTN_PRIMARY('Explore docs')}
              ${BTN_GHOST('See demo')}
            </div>
          </div>
        </section>`
    },
    {
      label: 'Centered with icon grid',
      preview: '  heading\n[i][i][i]\n  [btn]',
      render: () => `
        <section style="padding:72px var(--sp-5);background:var(--bg);text-align:center">
          <div style="max-width:var(--container);margin:0 auto">
            ${BADGE('Features')}
            ${HEADING('Everything you need, nothing you don\'t', 34)}
            <p style="font-size:15px;color:var(--text-2);max-width:500px;margin:0 auto 48px;line-height:1.6">Built for teams that care about speed, privacy, and clarity.</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:40px">
              ${[
                ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2L4 10h5l-1 5 6-8H9l1-5z"/></svg>','Instant results','Data appears the moment your user clicks.'],
                ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="14" height="8" rx="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>','Private by default','Zero PII, zero compliance headaches.'],
                ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 3-2 9 0 12M8 2c2 3 2 9 0 12"/></svg>','Global edge','Under 50ms latency in 40+ regions.'],
              ].map(([icon,title,desc])=>`
                <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                  <div style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:var(--radius-sm);background:var(--accent-sub);margin:0 auto 14px;color:var(--accent)">${icon}</div>
                  <h3 style="margin:0 0 6px;font-size:15px;font-weight:600;color:var(--text)">${title}</h3>
                  <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">${desc}</p>
                </div>`).join('')}
            </div>
            <div style="display:flex;gap:12px;justify-content:center">
              ${BTN_PRIMARY('Start free')}
              ${BTN_GHOST('See all features')}
            </div>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: How it works ────────────────────────────────────────────────

  const STEPS = [
    { n:'01', title:'Install the snippet', desc:'One script tag. Works with any framework or plain HTML.' },
    { n:'02', title:'Data flows in', desc:'Events arrive in real-time, stripped of all PII at the edge.' },
    { n:'03', title:'Explore your dashboard', desc:'Instantly see traffic, sources, devices, and conversions.' },
  ];

  register('how-it-works', 'How it works', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="3" cy="7" r="1.5"/><circle cx="7" cy="7" r="1.5"/><circle cx="11" cy="7" r="1.5"/><path d="M4.5 7h1M8.5 7h1"/></svg>', [
    {
      label: 'Horizontal steps',
      preview: '① ─── ② ─── ③',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:48px">
            ${BADGE('How it works')}
            ${HEADING('Up and running in 3 steps', 32)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp-4);max-width:var(--container);margin:0 auto;position:relative">
            ${STEPS.map((s,i)=>`
              <div style="text-align:center;padding:var(--sp-4)">
                <div style="width:44px;height:44px;border-radius:50%;background:var(--accent);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">${s.n}</div>
                <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;color:var(--text)">${s.title}</h3>
                <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">${s.desc}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Vertical timeline',
      preview: '①\n│\n②\n│\n③',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:48px">
            ${BADGE('How it works')}
            ${HEADING('From zero to insight', 32)}
          </div>
          <div style="max-width:560px;margin:0 auto;position:relative">
            <div style="position:absolute;left:21px;top:44px;bottom:44px;width:2px;background:var(--border)"></div>
            ${STEPS.map((s,i)=>`
              <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:36px;position:relative">
                <div style="width:44px;height:44px;border-radius:50%;background:var(--accent);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1">${s.n}</div>
                <div style="padding-top:10px">
                  <h3 style="margin:0 0 6px;font-size:15px;font-weight:600;color:var(--text)">${s.title}</h3>
                  <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">${s.desc}</p>
                </div>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Numbered card grid',
      preview: '┌─┐┌─┐┌─┐\n│1││2││3│',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('How it works')}
            ${HEADING('Three steps to clarity', 32)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:var(--container);margin:0 auto">
            ${STEPS.map((s,i)=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                <div style="font-size:40px;font-weight:800;color:var(--accent);opacity:.3;line-height:1;margin-bottom:16px">${s.n}</div>
                <h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:var(--text)">${s.title}</h3>
                <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">${s.desc}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Stats / metrics ────────────────────────────────────────────

  const STATS = [
    { val:'2.4k+', label:'Companies' },
    { val:'98%', label:'Uptime SLA' },
    { val:'< 1s', label:'Data latency' },
    { val:'40+', label:'Integrations' },
  ];

  register('stats', 'Stats / metrics', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 11l3-4 3 2 3-5 3 3"/></svg>', [
    {
      label: '4-col highlight',
      preview: '[2.4k][98%][<1s][40+]',
      render: () => `
        <section style="padding:48px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border)">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--sp-4);max-width:var(--container);margin:0 auto;text-align:center">
            ${STATS.map(s=>`
              <div>
                <div style="font-size:36px;font-weight:800;color:var(--accent);line-height:1">${s.val}</div>
                <div style="font-size:13px;color:var(--text-3);margin-top:6px">${s.label}</div>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Card row with icon',
      preview: '[val][val][val]',
      render: () => `
        <section style="padding:48px var(--sp-5);background:var(--bg)">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:var(--container);margin:0 auto">
            ${STATS.map(s=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);text-align:center">
                <div style="font-size:32px;font-weight:800;color:var(--text);line-height:1">${s.val}</div>
                <div style="font-size:12px;color:var(--text-3);margin-top:6px;text-transform:uppercase;letter-spacing:.5px">${s.label}</div>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Accent dark banner',
      preview: '▓ val  val  val  val ▓',
      render: () => `
        <section style="padding:56px var(--sp-5);background:linear-gradient(135deg,var(--accent),var(--accent-h))">
          <div style="max-width:var(--container);margin:0 auto">
            <p style="text-align:center;font-size:12px;color:rgba(255,255,255,.7);margin:0 0 32px;text-transform:uppercase;letter-spacing:1px">By the numbers</p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;text-align:center">
              ${STATS.map((s,i,arr)=>`
                <div style="padding:0 var(--sp-4)${i<arr.length-1?';border-right:1px solid rgba(255,255,255,.2)':''}">
                  <div style="font-size:40px;font-weight:800;color:#fff;line-height:1">${s.val}</div>
                  <div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:8px">${s.label}</div>
                </div>`).join('')}
            </div>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Testimonials ────────────────────────────────────────────────

  const TESTIMONIALS = [
    { name:'Sarah K.', role:'Head of Growth, Vercel', text:'Umbra replaced GA4 overnight. Our legal team finally stopped asking questions.' },
    { name:'Marcus T.', role:'CTO, Linear', text:'We\'ve tried everything. Umbra is the only tool that works behind an adblocker.' },
    { name:'Priya N.', role:'Product Lead, Notion', text:'The dashboard is gorgeous. My team actually looks at analytics now.' },
    { name:'Tom W.', role:'Founder, Loom', text:'Setup took 5 minutes. We had data within seconds. Absolutely wild.' },
    { name:'Anna B.', role:'Engineer, Stripe', text:'Clean API, great docs, zero drama. Ship it.' },
    { name:'Diego R.', role:'Designer, Figma', text:'Finally an analytics tool that doesn\'t look like it was designed in 2008.' },
  ];

  register('testimonials', 'Testimonials', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 2h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4l-3 2V3a1 1 0 0 1 1-1z"/></svg>', [
    {
      label: 'Card grid',
      preview: '┌─┐┌─┐┌─┐\n│"││"││"│',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Testimonials')}
            ${HEADING('Loved by teams worldwide', 32)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:var(--container);margin:0 auto">
            ${TESTIMONIALS.map(t=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                <p style="margin:0 0 16px;font-size:13px;color:var(--text-2);line-height:1.6">"${t.text}"</p>
                <div style="display:flex;align-items:center;gap:10px">
                  ${AVATAR(t.name[0])}
                  <div>
                    <div style="font-size:13px;font-weight:600;color:var(--text)">${t.name}</div>
                    <div style="font-size:11px;color:var(--text-3)">${t.role}</div>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Big quote',
      preview: '"  ─────  "',
      render: () => `
        <section style="padding:80px var(--sp-5);background:var(--bg);text-align:center">
          <div style="max-width:680px;margin:0 auto">
            <div style="font-size:48px;color:var(--accent);line-height:1;margin-bottom:8px">"</div>
            <blockquote style="margin:0 0 32px;font-size:22px;font-weight:500;color:var(--text);line-height:1.5">${TESTIMONIALS[0].text}</blockquote>
            <div style="display:flex;align-items:center;justify-content:center;gap:12px">
              ${AVATAR(TESTIMONIALS[0].name[0])}
              <div style="text-align:left">
                <div style="font-size:14px;font-weight:600;color:var(--text)">${TESTIMONIALS[0].name}</div>
                <div style="font-size:12px;color:var(--text-3)">${TESTIMONIALS[0].role}</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;justify-content:center;margin-top:32px">
              ${TESTIMONIALS.map((t,i)=>`<div style="width:8px;height:8px;border-radius:50%;background:${i===0?'var(--accent)':'var(--border)'}"></div>`).join('')}
            </div>
          </div>
        </section>`
    },
    {
      label: 'Scrolling marquee',
      preview: '▶ A  B  C  D ▶',
      render: () => `
        <section style="padding:48px 0;background:var(--bg);overflow:hidden">
          <p style="text-align:center;font-size:12px;color:var(--text-3);margin:0 0 24px;text-transform:uppercase;letter-spacing:1px">What people say</p>
          <div style="display:flex;gap:16px;overflow:hidden">
            <div style="display:flex;gap:16px;flex-shrink:0">
              ${TESTIMONIALS.map(t=>`
                <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:20px;min-width:280px;max-width:280px">
                  <p style="margin:0 0 12px;font-size:13px;color:var(--text-2);line-height:1.6">"${t.text}"</p>
                  <div style="display:flex;align-items:center;gap:8px">
                    ${AVATAR(t.name[0])}
                    <div>
                      <div style="font-size:12px;font-weight:600;color:var(--text)">${t.name}</div>
                      <div style="font-size:11px;color:var(--text-3)">${t.role}</div>
                    </div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Pricing ─────────────────────────────────────────────────────

  const PLANS = [
    {
      name:'Starter', price:'$0', period:'/mo',
      desc:'Perfect for personal projects.',
      features:['Up to 10k pageviews','1 website','7-day data retention','Community support'],
      cta:'Get started free', accent:false,
    },
    {
      name:'Pro', price:'$29', period:'/mo',
      desc:'For growing startups and teams.',
      features:['Unlimited pageviews','5 websites','12-month retention','Priority support','Custom events','Team access'],
      cta:'Start free trial', accent:true,
    },
    {
      name:'Enterprise', price:'Custom', period:'',
      desc:'For large-scale deployments.',
      features:['Unlimited everything','SLA guarantee','SSO / SAML','Dedicated support','Custom contracts'],
      cta:'Talk to sales', accent:false,
    },
  ];

  register('pricing', 'Pricing', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 2v10M4.5 4.5h4a1.5 1.5 0 0 1 0 3H5a1.5 1.5 0 0 0 0 3h4.5"/></svg>', [
    {
      label: '3 plan cards',
      preview: '┌─┐┌█┐┌─┐\n│S││P││E│',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Pricing')}
            ${HEADING('Simple, transparent pricing', 32)}
            <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
              ${PILL('Monthly',true)}${PILL('Annual — save 20%')}
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:var(--container);margin:0 auto;align-items:start">
            ${PLANS.map(p=>`
              <div style="background:${p.accent?'var(--accent)':'var(--bg-card)'};border:${p.accent?'2px solid transparent':'var(--border-w) solid var(--border)'};border-radius:var(--radius);padding:var(--sp-4);${p.accent?'box-shadow:0 0 0 3px var(--accent-sub)':''}">
                <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:${p.accent?'rgba(255,255,255,.8)':'var(--text-3)'};margin-bottom:8px">${p.name}</div>
                <div style="display:flex;align-items:baseline;gap:2px;margin-bottom:8px">
                  <span style="font-size:32px;font-weight:800;color:${p.accent?'#fff':'var(--text)'}">${p.price}</span>
                  <span style="font-size:13px;color:${p.accent?'rgba(255,255,255,.7)':'var(--text-3)'}">${p.period}</span>
                </div>
                <p style="margin:0 0 16px;font-size:12px;color:${p.accent?'rgba(255,255,255,.7)':'var(--text-3)'}">${p.desc}</p>
                <button style="width:100%;padding:10px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer;background:${p.accent?'rgba(255,255,255,.2)':'var(--accent)'};color:#fff;border:${p.accent?'1px solid rgba(255,255,255,.3)':'none'};margin-bottom:16px">${p.cta}</button>
                <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px">
                  ${p.features.map(f=>`<li style="display:flex;align-items:center;gap:8px;font-size:12px;color:${p.accent?'rgba(255,255,255,.85)':'var(--text-2)'}"><svg width="11" height="11" fill="none" stroke="${p.accent?'rgba(255,255,255,.7)':'var(--accent)'}" stroke-width="2.5" style="flex-shrink:0"><path d="M2 5.5l2.5 2.5 4.5-4.5"/></svg>${f}</li>`).join('')}
                </ul>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Comparison table',
      preview: '  S | P | E\n──────────\n✓ | ✓ | ✓',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Compare plans')}
            ${HEADING('Pick the right plan', 32)}
          </div>
          <div style="max-width:800px;margin:0 auto;overflow:hidden;border-radius:var(--radius);border:var(--border-w) solid var(--border)">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--bg-card)">
                  <th style="padding:14px 16px;text-align:left;color:var(--text-3);font-weight:500">Feature</th>
                  ${PLANS.map(p=>`<th style="padding:14px 16px;text-align:center;color:${p.accent?'var(--accent)':'var(--text)'};font-weight:600">${p.name}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${[['Pageviews','10k','Unlimited','Unlimited'],['Websites','1','5','Unlimited'],['Data retention','7 days','12 months','Unlimited'],['Custom events','—','✓','✓'],['Priority support','—','✓','✓'],['SSO','—','—','✓']].map(([feat,...vals],i)=>`
                  <tr style="border-top:var(--border-w) solid var(--border-sub);background:${i%2===0?'transparent':'var(--bg-card)'}">
                    <td style="padding:12px 16px;color:var(--text-2)">${feat}</td>
                    ${vals.map((v,j)=>`<td style="padding:12px 16px;text-align:center;color:${v==='✓'?'var(--accent)':v==='—'?'var(--text-3)':'var(--text-2)'}">${v}</td>`).join('')}
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>`
    },
    {
      label: 'Single highlighted plan',
      preview: '  ╔══════╗\n  ║  Pro ║',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg);text-align:center">
          <div style="margin-bottom:32px">
            ${BADGE('Pricing')}
            ${HEADING('One plan. Everything included.', 32)}
            <p style="font-size:14px;color:var(--text-2);max-width:480px;margin:0 auto">No tiers, no feature gates, no nasty surprises. Pay once, use it all.</p>
          </div>
          <div style="max-width:440px;margin:0 auto;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:36px">
            <div style="font-size:13px;color:var(--text-3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Pro plan</div>
            <div style="font-size:48px;font-weight:800;color:var(--text);margin-bottom:4px">$29<span style="font-size:16px;font-weight:400;color:var(--text-3)">/month</span></div>
            <p style="font-size:13px;color:var(--text-3);margin:0 0 24px">Billed annually · $348/year</p>
            <button style="width:100%;padding:12px;border-radius:var(--radius-sm);font-size:14px;font-weight:600;cursor:pointer;background:var(--accent);color:#fff;border:none;margin-bottom:24px">Start 14-day free trial</button>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left">
              ${['Unlimited pageviews','5 websites','12-month retention','Custom events','Team access','Priority support'].map(f=>`<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2)"><svg width="11" height="11" fill="none" stroke="var(--accent)" stroke-width="2.5" style="flex-shrink:0"><path d="M2 5.5l2.5 2.5 4.5-4.5"/></svg>${f}</div>`).join('')}
            </div>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: FAQ ─────────────────────────────────────────────────────────

  const FAQS = [
    { q:'Is Umbra really GDPR compliant?', a:'Yes. We collect no personal data, set no cookies, and store no IP addresses. No consent banner required.' },
    { q:'How does cookieless tracking work?', a:'We use a privacy-preserving technique that assigns statistical identifiers without storing anything in the browser.' },
    { q:'Can I use Umbra on multiple sites?', a:'Yes. Pro and Enterprise plans support multiple sites under one account.' },
    { q:'What happens when I hit my pageview limit?', a:'We\'ll notify you. We won\'t cut off your data — just ask you to upgrade.' },
    { q:'Do you offer a free trial?', a:'Yes, 14 days free on any paid plan. No credit card required.' },
  ];

  register('faq', 'FAQ', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.5"/><path d="M5.5 5.5a1.5 1.5 0 0 1 3 .8c0 1-1.5 1.7-1.5 2.7"/><path d="M7 11v.5"/></svg>', [
    {
      label: 'Accordion list',
      preview: '▼ Q1\n  A1\n▶ Q2\n▶ Q3',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('FAQ')}
            ${HEADING('Frequently asked questions', 32)}
          </div>
          <div style="max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:0">
            ${FAQS.map((f,i)=>`
              <div style="border-top:var(--border-w) solid var(--border);padding:16px 0${i===FAQS.length-1?';border-bottom:var(--border-w) solid var(--border)':''}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                  <span style="font-size:14px;font-weight:500;color:var(--text)">${f.q}</span>
                  <span style="color:var(--text-3);flex-shrink:0">${i===0?'−':'+'}</span>
                </div>
                ${i===0?`<p style="margin:10px 0 0;font-size:13px;color:var(--text-2);line-height:1.6">${f.a}</p>`:''}
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: '2-col Q&A grid',
      preview: 'Q─A  Q─A\nQ─A  Q─A',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('FAQ')}
            ${HEADING('Got questions?', 32)}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:var(--container);margin:0 auto">
            ${FAQS.map(f=>`
              <div style="padding:var(--sp-3) 0;border-top:var(--border-w) solid var(--border)">
                <h4 style="margin:0 0 8px;font-size:14px;font-weight:600;color:var(--text)">${f.q}</h4>
                <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">${f.a}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Sidebar categories',
      preview: '[Cat] | ▼ Q\n      |   A\n      | ▶ Q',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('FAQ')}
            ${HEADING('Help center', 32)}
          </div>
          <div style="display:grid;grid-template-columns:220px 1fr;gap:var(--sp-5);max-width:var(--container);margin:0 auto;align-items:start">
            <div style="display:flex;flex-direction:column;gap:4px">
              ${[['General','All basics'],['Billing','Plans & pricing'],['Privacy','GDPR & cookies'],['API','Integrations']].map(([cat,sub],i)=>`
                <div style="padding:10px 14px;border-radius:var(--radius-sm);background:${i===0?'var(--accent-sub)':'transparent'};cursor:pointer">
                  <div style="font-size:13px;font-weight:500;color:${i===0?'var(--accent)':'var(--text-2)'}">${cat}</div>
                  <div style="font-size:11px;color:var(--text-3)">${sub}</div>
                </div>`).join('')}
            </div>
            <div style="display:flex;flex-direction:column;gap:0">
              ${FAQS.slice(0,4).map((f,i)=>`
                <div style="border-top:var(--border-w) solid var(--border);padding:16px 0${i===3?';border-bottom:var(--border-w) solid var(--border)':''}">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                    <span style="font-size:14px;font-weight:500;color:var(--text)">${f.q}</span>
                    <span style="color:var(--text-3);flex-shrink:0">${i===0?'−':'+'}</span>
                  </div>
                  ${i===0?`<p style="margin:10px 0 0;font-size:13px;color:var(--text-2);line-height:1.6">${f.a}</p>`:''}
                </div>`).join('')}
            </div>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: CTA banner ──────────────────────────────────────────────────

  register('cta-banner', 'CTA banner', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="12" height="7" rx="1"/><path d="M5 7.5h4M8 6l1.5 1.5L8 9"/></svg>', [
    {
      label: 'Centered dark',
      preview: '█████████\n heading \n [btn]',
      render: () => `
        <section style="padding:72px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border);text-align:center">
          ${HEADING('Ready to get started?', 36)}
          <p style="font-size:15px;color:var(--text-2);margin:0 0 28px;max-width:420px;margin-left:auto;margin-right:auto">Join 2,400+ teams shipping better products with privacy-first analytics.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${BTN_PRIMARY('Start free trial')}
            ${BTN_GHOST('Schedule a demo')}
          </div>
          <p style="margin:16px 0 0;font-size:12px;color:var(--text-3)">14-day free trial · No credit card</p>
        </section>`
    },
    {
      label: 'Accent gradient band',
      preview: '▓▓▓▓▓▓▓\n  CTA  \n▓▓▓▓▓▓▓',
      render: () => `
        <section style="padding:64px var(--sp-5);background:linear-gradient(135deg,var(--accent),var(--accent-h));text-align:center">
          <h2 style="margin:0 0 12px;font-size:34px;font-weight:700;line-height:1.2;color:#fff">Start measuring what matters</h2>
          <p style="font-size:15px;color:rgba(255,255,255,.8);margin:0 0 28px;max-width:440px;margin-left:auto;margin-right:auto">Get actionable insights without tracking your users like criminals.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <button style="background:#fff;color:var(--accent);border:none;padding:12px 24px;border-radius:var(--radius-sm);font-size:14px;font-weight:600;cursor:pointer">Try it free</button>
            <button style="background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.3);padding:12px 24px;border-radius:var(--radius-sm);font-size:14px;cursor:pointer">Talk to sales</button>
          </div>
        </section>`
    },
    {
      label: 'Split text + email input',
      preview: 'text  |  [email][btn]',
      render: () => `
        <section style="padding:56px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-5);align-items:center;max-width:var(--container);margin:0 auto">
            <div>
              ${HEADING('Start your free trial today', 28)}
              <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.6">No credit card, no setup fees. Cancel any time.</p>
            </div>
            <div style="display:flex;gap:8px">
              <input type="email" placeholder="you@company.com" style="flex:1;padding:10px 14px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none">
              <button style="background:var(--accent);color:#fff;border:none;padding:10px 20px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap">Get started</button>
            </div>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Footer ──────────────────────────────────────────────────────

  register('footer', 'Footer', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 10h12M1 7h8M1 4h5"/></svg>', [
    {
      label: 'Standard multi-col',
      preview: 'logo text | cols | cols',
      render: () => `
        <footer style="padding:48px var(--sp-5) 24px;background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:var(--sp-5);max-width:var(--container);margin:0 auto 32px">
            <div>
              ${LOGO()}
              <p style="margin:10px 0 0;font-size:12px;color:var(--text-3);line-height:1.6;max-width:220px">Privacy-first analytics for modern product teams.</p>
            </div>
            ${[['Product',['Dashboard','Pricing','Changelog','Roadmap']],['Company',['About','Blog','Careers','Press']],['Legal',['Privacy','Terms','Cookies','DPA']]].map(([col,links])=>`
              <div>
                <div style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">${col}</div>
                <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px">
                  ${links.map(l=>`<li><a href="#" style="font-size:12px;color:var(--text-3);text-decoration:none">${l}</a></li>`).join('')}
                </ul>
              </div>`).join('')}
          </div>
          <div style="border-top:var(--border-w) solid var(--border-sub);padding-top:20px;display:flex;justify-content:space-between;align-items:center;max-width:var(--container);margin:0 auto">
            <span style="font-size:11px;color:var(--text-3)">© 2025 ${_projectName}, Inc. All rights reserved.</span>
            <div style="display:flex;gap:16px">
              ${['Twitter','GitHub','Discord'].map(n=>`<a href="#" style="font-size:11px;color:var(--text-3);text-decoration:none">${n}</a>`).join('')}
            </div>
          </div>
        </footer>`
    },
    {
      label: 'Minimal single row',
      preview: 'logo  ·  links  ·  ©',
      render: () => `
        <footer style="padding:24px var(--sp-5);background:var(--bg);border-top:var(--border-w) solid var(--border)">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;max-width:var(--container);margin:0 auto">
            ${LOGO()}
            <div style="display:flex;gap:20px">
              ${['Product','Pricing','Docs','Blog','Privacy','Terms'].map(l=>`<a href="#" style="font-size:12px;color:var(--text-3);text-decoration:none">${l}</a>`).join('')}
            </div>
            <span style="font-size:11px;color:var(--text-3)">© 2025 ${_projectName}</span>
          </div>
        </footer>`
    },
    {
      label: 'CTA + links',
      preview: '  CTA blurb\n  [btn]\n─────────────',
      render: () => `
        <footer style="padding:48px var(--sp-5) 24px;background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="text-align:center;margin-bottom:40px">
            <h3 style="margin:0 0 10px;font-size:22px;font-weight:700;color:var(--text)">Start building today</h3>
            <p style="margin:0 0 20px;font-size:13px;color:var(--text-3)">Free tier available. No credit card required.</p>
            ${BTN_PRIMARY('Try Umbra free')}
          </div>
          <div style="border-top:var(--border-w) solid var(--border-sub);padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;max-width:var(--container);margin:0 auto">
            <span style="font-size:11px;color:var(--text-3)">© 2025 ${_projectName}. All rights reserved.</span>
            <div style="display:flex;gap:16px">
              ${['Privacy','Terms','Twitter','GitHub'].map(l=>`<a href="#" style="font-size:11px;color:var(--text-3);text-decoration:none">${l}</a>`).join('')}
            </div>
          </div>
        </footer>`
    },
  ]);

  // ─── SECTION: Integrations ────────────────────────────────────────────────

  const INTEGRATIONS = ['Slack','Notion','Zapier','Segment','HubSpot','Salesforce','Stripe','Intercom','GitHub','Vercel','Netlify','Figma'];

  register('integrations', 'Integrations', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="4" cy="7" r="2"/><circle cx="10" cy="7" r="2"/><path d="M6 7h2"/></svg>', [
    {
      label: 'Icon grid',
      preview: '□□□□\n□□□□',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Integrations')}
            ${HEADING('Works with your stack', 32)}
            <p style="font-size:14px;color:var(--text-2);margin:0 auto;max-width:440px">Connect Umbra to 40+ tools in minutes. No middleware, no fuss.</p>
          </div>
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;max-width:var(--container);margin:0 auto">
            ${INTEGRATIONS.map(n=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;align-items:center;gap:8px">
                <div style="width:32px;height:32px;border-radius:var(--radius-sm);background:var(--bg-el);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--accent)">${n[0]}</div>
                <span style="font-size:11px;color:var(--text-3)">${n}</span>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Featured + grid',
      preview: '[big card]  [grid]',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Integrations')}
            ${HEADING('Your workflow, connected', 32)}
          </div>
          <div style="display:grid;grid-template-columns:1fr 2fr;gap:16px;max-width:var(--container);margin:0 auto">
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
              <div style="font-size:28px;margin-bottom:12px;color:var(--accent)">◎</div>
              <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;color:var(--text)">Slack alerts</h3>
              <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">Get notified instantly when traffic spikes, goals are hit, or anomalies are detected.</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
              ${INTEGRATIONS.slice(1,9).map(n=>`
                <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:14px;display:flex;align-items:center;gap:8px">
                  <div style="width:24px;height:24px;border-radius:4px;background:var(--bg-el);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--accent)">${n[0]}</div>
                  <span style="font-size:12px;color:var(--text-2)">${n}</span>
                </div>`).join('')}
            </div>
          </div>
        </section>`
    },
    {
      label: 'API & webhooks focus',
      preview: '[docs] [code] [connect]',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="text-align:center;margin-bottom:48px">
            ${BADGE('Developer-friendly')}
            ${HEADING('Built for your stack', 32)}
            <p style="font-size:14px;color:var(--text-2);max-width:440px;margin:0 auto">REST API, webhooks, SDKs for every major language. Works anywhere.</p>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:var(--container);margin:0 auto">
            ${[
              ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 8l3 3-3 3"/><path d="M11 14h2"/></svg>','REST API','Full CRUD access to all your data. OpenAPI spec included.'],
              ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12s1.5-3 4-3 4 3 4 3"/><path d="M9 9V4M7 5l2-2 2 2"/></svg>','Webhooks','Push events to any endpoint. Configurable filters and retry logic.'],
              ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="12" height="16" rx="1.5"/><path d="M8 7h4M8 11h4M8 15h2"/></svg>','SDKs','Native libraries for JS, Python, Go, Ruby, and PHP.'],
            ].map(([icon,title,desc])=>`
              <div style="background:var(--bg);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                <div style="color:var(--accent);margin-bottom:12px">${icon}</div>
                <h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:var(--text)">${title}</h3>
                <p style="margin:0 0 16px;font-size:13px;color:var(--text-2);line-height:1.5">${desc}</p>
                <a href="#" style="font-size:12px;color:var(--accent);text-decoration:none">View docs →</a>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Comparison table ────────────────────────────────────────────

  register('comparison-table', 'Comparison table', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 2v10M2 4h10M2 7h10M2 10h10"/></svg>', [
    {
      label: 'Umbra vs competitors',
      preview: '  Us | GA4 | Mix\n──────────────\n  ✓  | ✗  | ✗',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Compare')}
            ${HEADING('Why teams choose Umbra', 32)}
          </div>
          <div style="max-width:760px;margin:0 auto;border-radius:var(--radius);border:var(--border-w) solid var(--border);overflow:hidden">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--bg-card)">
                  <th style="padding:14px 16px;text-align:left;color:var(--text-3);font-weight:400;width:40%">Feature</th>
                  <th style="padding:14px 16px;text-align:center;color:var(--accent);font-weight:700">Umbra</th>
                  <th style="padding:14px 16px;text-align:center;color:var(--text-3);font-weight:500">GA4</th>
                  <th style="padding:14px 16px;text-align:center;color:var(--text-3);font-weight:500">Mixpanel</th>
                </tr>
              </thead>
              <tbody>
                ${[
                  ['No cookies required','✓','✗','✗'],
                  ['GDPR out of the box','✓','~','~'],
                  ['Real-time data','✓','✓','✓'],
                  ['No data sampling','✓','✗','✗'],
                  ['5-min setup','✓','✗','✗'],
                  ['Transparent pricing','✓','free/complex','$$$'],
                ].map(([f,...vs],i)=>`
                  <tr style="border-top:var(--border-w) solid var(--border-sub);background:${i%2===0?'transparent':'var(--bg-card)'}">
                    <td style="padding:12px 16px;color:var(--text-2)">${f}</td>
                    ${vs.map((v,j)=>`<td style="padding:12px 16px;text-align:center;color:${v==='✓'?'#3fb950':v==='✗'?'#f85149':'var(--text-3)'}">${v}</td>`).join('')}
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>`
    },
    {
      label: 'Plan cards side by side',
      preview: '[Free][Pro][Ent]',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Compare plans')}
            ${HEADING('Choose what fits you', 32)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:820px;margin:0 auto">
            ${[
              {name:'Free',price:'$0',features:['5k events/mo','1 site','7-day retention','Community support']},
              {name:'Pro',price:'$19',features:['500k events/mo','10 sites','12-month retention','Email support','Custom events'],highlight:true},
              {name:'Enterprise',price:'Custom',features:['Unlimited events','Unlimited sites','Unlimited retention','Dedicated support','SLA & DPA']},
            ].map(p=>`
              <div style="background:${p.highlight?'var(--accent)':'var(--bg-card)'};border:${p.highlight?'none':'var(--border-w) solid var(--border)'};border-radius:var(--radius);padding:var(--sp-4)">
                <div style="font-size:13px;font-weight:600;color:${p.highlight?'rgba(255,255,255,.8)':'var(--text-3)'};margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">${p.name}</div>
                <div style="font-size:32px;font-weight:800;color:${p.highlight?'#fff':'var(--text)'};line-height:1;margin-bottom:20px">${p.price}<span style="font-size:14px;font-weight:400">${p.price!=='Custom'?'/mo':''}</span></div>
                <ul style="list-style:none;margin:0 0 20px;padding:0;display:flex;flex-direction:column;gap:8px">
                  ${p.features.map(f=>`<li style="display:flex;align-items:center;gap:8px;font-size:13px;color:${p.highlight?'rgba(255,255,255,.85)':'var(--text-2)'}"><svg width="12" height="12" fill="none" stroke="${p.highlight?'#fff':'var(--accent)'}" stroke-width="2.5"><path d="M2 6l3 3 5-5"/></svg>${f}</li>`).join('')}
                </ul>
                <button style="width:100%;background:${p.highlight?'rgba(255,255,255,.2)':'var(--accent)'};color:#fff;border:${p.highlight?'1px solid rgba(255,255,255,.3)':'none'};padding:10px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer">Get started</button>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Feature checklist table',
      preview: 'Feature | Free | Pro\n────────|──────|────',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Full comparison')}
            ${HEADING('Every feature, every plan', 32)}
          </div>
          <div style="max-width:760px;margin:0 auto;border-radius:var(--radius);border:var(--border-w) solid var(--border);overflow:hidden;background:var(--bg)">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--bg-card)">
                  <th style="padding:16px;text-align:left;color:var(--text-3);font-weight:400;border-bottom:var(--border-w) solid var(--border)">Feature</th>
                  ${['Free','Pro','Enterprise'].map(p=>`<th style="padding:16px;text-align:center;color:var(--text);font-weight:600;border-bottom:var(--border-w) solid var(--border)">${p}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${[
                  ['Events per month','5k','500k','Unlimited'],
                  ['Custom domains','1','10','Unlimited'],
                  ['Data retention','7 days','12 months','Unlimited'],
                  ['Custom events','✗','✓','✓'],
                  ['API access','✗','✓','✓'],
                  ['SSO / SAML','✗','✗','✓'],
                  ['Dedicated support','✗','✗','✓'],
                ].map(([f,...vs],i)=>`
                  <tr style="border-top:var(--border-w) solid var(--border-sub)">
                    <td style="padding:12px 16px;color:var(--text-2)">${f}</td>
                    ${vs.map(v=>`<td style="padding:12px 16px;text-align:center;color:${v==='✓'?'#3fb950':v==='✗'?'#f85149':'var(--text-2)'}">${v}</td>`).join('')}
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Team ────────────────────────────────────────────────────────

  const TEAM = [
    { name:'Alex Morgan', role:'CEO & Co-founder', color:'#2F81F7' },
    { name:'Jamie Chen', role:'CTO', color:'#8957E5' },
    { name:'Sam Rivera', role:'Head of Design', color:'#2DA44E' },
    { name:'Jordan Lee', role:'Engineering Lead', color:'#E5534B' },
    { name:'Taylor Kim', role:'Head of Growth', color:'#D29922' },
    { name:'Casey Park', role:'Developer Advocate', color:'#1B7C83' },
  ];

  register('team', 'Team', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="5" r="2"/><circle cx="9" cy="5" r="2"/><path d="M1 13c0-2.2 1.8-4 4-4M7 9c1.1 0 2 .4 2.8 1"/><path d="M9 9c2.2 0 4 1.8 4 4"/></svg>', [
    {
      label: '3-col cards',
      preview: '◉  ◉  ◉\n◉  ◉  ◉',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Team')}
            ${HEADING('The people behind Umbra', 32)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:var(--container);margin:0 auto">
            ${TEAM.map(m=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);text-align:center">
                <div style="width:64px;height:64px;border-radius:50%;background:${m.color};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;margin:0 auto 14px">${m.name.split(' ').map(n=>n[0]).join('')}</div>
                <h3 style="margin:0 0 4px;font-size:15px;font-weight:600;color:var(--text)">${m.name}</h3>
                <p style="margin:0;font-size:12px;color:var(--text-3)">${m.role}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Horizontal list',
      preview: '◉ name  ◉ name\n◉ name  ◉ name',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Team')}
            ${HEADING('Meet the team', 32)}
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;max-width:660px;margin:0 auto">
            ${TEAM.map(m=>`
              <div style="display:flex;align-items:center;gap:16px;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px 20px">
                <div style="width:44px;height:44px;border-radius:50%;background:${m.color};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0">${m.name.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div style="font-size:14px;font-weight:600;color:var(--text)">${m.name}</div>
                  <div style="font-size:12px;color:var(--text-3)">${m.role}</div>
                </div>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Founder-focused row',
      preview: '◉◉◉ — names + bios',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="text-align:center;margin-bottom:48px">
            ${BADGE('Founders')}
            ${HEADING('Built by builders', 32)}
            <p style="font-size:14px;color:var(--text-2);max-width:440px;margin:0 auto">Three engineers who got tired of analytics tools that felt like surveillance software.</p>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:840px;margin:0 auto">
            ${TEAM.slice(0,3).map(m=>`
              <div style="text-align:center">
                <div style="width:80px;height:80px;border-radius:50%;background:${m.color};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;margin:0 auto 16px">${m.name.split(' ').map(n=>n[0]).join('')}</div>
                <h3 style="margin:0 0 4px;font-size:16px;font-weight:600;color:var(--text)">${m.name}</h3>
                <p style="margin:0 0 10px;font-size:12px;color:var(--accent)">${m.role}</p>
                <p style="margin:0;font-size:13px;color:var(--text-2);line-height:1.5">Building privacy-first infrastructure for the next generation of product teams.</p>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Blog teaser ─────────────────────────────────────────────────

  const POSTS = [
    { tag:'Privacy', title:'Why cookieless analytics is the future', date:'May 12, 2025', read:'5 min' },
    { tag:'Product', title:'Introducing real-time alerts for traffic spikes', date:'Apr 28, 2025', read:'3 min' },
    { tag:'Engineering', title:'How we built sub-second event ingestion at scale', date:'Apr 10, 2025', read:'8 min' },
  ];

  register('blog-teaser', 'Blog teaser', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="6" height="8" rx="1"/><path d="M9 4h4M9 7h4M9 10h2"/></svg>', [
    {
      label: '3-col card grid',
      preview: '┌─┐┌─┐┌─┐\n└─┘└─┘└─┘',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:32px;max-width:var(--container);margin-left:auto;margin-right:auto">
            <div>
              ${BADGE('Blog')}
              ${HEADING('From the blog', 28)}
            </div>
            <a href="#" style="font-size:13px;color:var(--accent);text-decoration:none">All posts →</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:var(--container);margin:0 auto">
            ${POSTS.map(p=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden">
                <div style="height:120px;background:var(--bg-el);display:flex;align-items:center;justify-content:center">
                  <div style="width:80%;height:60%;background:var(--bg-hover);border-radius:var(--radius-sm)"></div>
                </div>
                <div style="padding:16px">
                  ${PILL(p.tag, true)}
                  <h3 style="margin:8px 0 8px;font-size:14px;font-weight:600;color:var(--text);line-height:1.4">${p.title}</h3>
                  <div style="font-size:11px;color:var(--text-3)">${p.date} · ${p.read} read</div>
                </div>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Featured + list',
      preview: '┌────┐ ┌─┐\n│    │ ├─┤\n└────┘ └─┘',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="margin-bottom:32px;max-width:var(--container);margin-left:auto;margin-right:auto">
            ${BADGE('Blog')}
            ${HEADING('Latest from the blog', 28)}
          </div>
          <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;max-width:var(--container);margin:0 auto">
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden">
              <div style="height:180px;background:var(--bg-el);display:flex;align-items:center;justify-content:center">
                <div style="width:70%;height:60%;background:var(--bg-hover);border-radius:var(--radius-sm)"></div>
              </div>
              <div style="padding:20px">
                ${PILL(POSTS[0].tag, true)}
                <h3 style="margin:10px 0 8px;font-size:18px;font-weight:600;color:var(--text);line-height:1.4">${POSTS[0].title}</h3>
                <div style="font-size:12px;color:var(--text-3)">${POSTS[0].date} · ${POSTS[0].read} read</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px">
              ${POSTS.slice(1).map(p=>`
                <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px">
                  ${PILL(p.tag, true)}
                  <h3 style="margin:8px 0 6px;font-size:14px;font-weight:600;color:var(--text);line-height:1.4">${p.title}</h3>
                  <div style="font-size:11px;color:var(--text-3)">${p.date} · ${p.read} read</div>
                </div>`).join('')}
            </div>
          </div>
        </section>`
    },
    {
      label: 'Minimal link list',
      preview: '→ title  date\n→ title  date',
      render: () => `
        <section style="padding:56px var(--sp-5);background:var(--bg)">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:32px;max-width:680px;margin-left:auto;margin-right:auto">
            <div>
              ${BADGE('Blog')}
              ${HEADING('Recent writing', 28)}
            </div>
            <a href="#" style="font-size:13px;color:var(--accent);text-decoration:none">All posts →</a>
          </div>
          <div style="max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:0">
            ${POSTS.concat(POSTS).slice(0,5).map((p,i,arr)=>`
              <a href="#" style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;border-top:var(--border-w) solid var(--border);${i===arr.length-1?'border-bottom:var(--border-w) solid var(--border)':''}text-decoration:none">
                <div style="display:flex;align-items:center;gap:12px;min-width:0">
                  ${PILL(p.tag)}
                  <span style="font-size:14px;color:var(--text);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</span>
                </div>
                <span style="font-size:12px;color:var(--text-3);white-space:nowrap;flex-shrink:0">${p.read} read</span>
              </a>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Newsletter ──────────────────────────────────────────────────

  register('newsletter', 'Newsletter', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="12" height="9" rx="1"/><path d="M1 5l6 4 6-4"/></svg>', [
    {
      label: 'Centered form',
      preview: '  heading\n[email][btn]',
      render: () => `
        <section style="padding:56px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border);text-align:center">
          ${HEADING('Stay in the loop', 28)}
          <p style="font-size:13px;color:var(--text-2);margin:0 0 20px">Get product updates, privacy news, and tips — no spam.</p>
          <div style="display:flex;gap:8px;justify-content:center;max-width:420px;margin:0 auto">
            <input type="email" placeholder="your@email.com" style="flex:1;padding:10px 14px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none">
            ${BTN_PRIMARY('Subscribe')}
          </div>
          <p style="margin:12px 0 0;font-size:11px;color:var(--text-3)">Join 3,200 readers · Unsubscribe anytime</p>
        </section>`
    },
    {
      label: 'Split — copy + form',
      preview: 'copy left  |  form right',
      render: () => `
        <section style="padding:56px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-5);align-items:center;max-width:var(--container);margin:0 auto">
            <div>
              ${HEADING('The Umbra newsletter', 26)}
              <p style="font-size:13px;color:var(--text-2);margin:0;line-height:1.6">Privacy, analytics, and product engineering. Weekly. No fluff.</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div style="display:flex;gap:8px">
                <input type="email" placeholder="you@company.com" style="flex:1;padding:10px 14px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none">
                ${BTN_PRIMARY('Subscribe')}
              </div>
              <p style="margin:0;font-size:11px;color:var(--text-3)">3,200 subscribers · No spam · Unsubscribe any time</p>
            </div>
          </div>
        </section>`
    },
    {
      label: 'Full-width + social proof',
      preview: '  heading\n  [email][btn]\n  ── 3,200 readers ──',
      render: () => `
        <section style="padding:64px var(--sp-5);background:linear-gradient(180deg,var(--bg-card) 0%,var(--bg) 100%);border-top:var(--border-w) solid var(--border);text-align:center">
          ${BADGE('Newsletter')}
          ${HEADING('The privacy-first product digest', 30)}
          <p style="font-size:14px;color:var(--text-2);margin:0 auto 28px;max-width:420px;line-height:1.6">Insights on analytics, GDPR, and building products people trust. Every Tuesday.</p>
          <div style="display:flex;gap:8px;justify-content:center;max-width:400px;margin:0 auto 20px">
            <input type="email" placeholder="you@example.com" style="flex:1;padding:11px 14px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none">
            ${BTN_PRIMARY('Subscribe free')}
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:-6px">
              ${['AM','JC','SR'].map((i,idx)=>`<div style="width:26px;height:26px;border-radius:50%;background:var(--accent);border:2px solid var(--bg-card);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;margin-left:${idx>0?'-8px':'0'}">${i}</div>`).join('')}
            </div>
            <span style="font-size:12px;color:var(--text-3)">3,200+ readers · No spam · Cancel anytime</span>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Bento grid ──────────────────────────────────────────────────

  register('bento-grid', 'Bento grid', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="7" height="7" rx="1"/><rect x="10" y="1" width="3" height="7" rx="1"/><rect x="1" y="10" width="3" height="3" rx="1"/><rect x="6" y="10" width="7" height="3" rx="1"/></svg>', [
    {
      label: 'Mixed spans',
      preview: '┌──┬─┐\n├─┬┴─┤\n└─┴──┘',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Platform')}
            ${HEADING('One platform, complete visibility', 32)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:160px;gap:12px;max-width:var(--container);margin:0 auto">
            <div style="grid-column:span 2;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:space-between">
              <div>
                <div style="font-size:12px;color:var(--text-3);margin-bottom:6px">Visitors — last 30 days</div>
                <div style="font-size:28px;font-weight:700;color:var(--text)">24,891</div>
              </div>
              ${MINI_CHART()}
            </div>
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:flex-end">
              <div style="margin-bottom:8px;color:var(--accent)"><svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 17a8 8 0 1 0-14.4-4"/><path d="M14 10V6M10 7l2 2M11 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" stroke="none"/></svg></div>
              <h3 style="margin:0 0 4px;font-size:14px;font-weight:600;color:var(--text)">Cookieless</h3>
              <p style="margin:0;font-size:12px;color:var(--text-3)">Zero consent banners</p>
            </div>
            ${[
              ['<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L7 14h6l-1 8 8-12h-6l1-8z"/></svg>','Real-time','Sub-second data flow'],
              ['<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>','Private','No PII ever collected'],
              ['<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 4-3 14 0 18M12 3c3 4 3 14 0 18"/></svg>','Global','Edge network, 40+ regions'],
            ].map(([e,t,d])=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:flex-end">
                <div style="margin-bottom:8px;color:var(--accent)">${e}</div>
                <h3 style="margin:0 0 4px;font-size:14px;font-weight:600;color:var(--text)">${t}</h3>
                <p style="margin:0;font-size:12px;color:var(--text-3)">${d}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: '4-col uniform grid',
      preview: '┌─┬─┬─┬─┐\n└─┴─┴─┴─┘',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('Platform')}
            ${HEADING('Built different, built better', 32)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:var(--container);margin:0 auto">
            <div style="grid-column:span 2;background:var(--accent);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:space-between;min-height:200px">
              <div>
                <div style="font-size:12px;color:rgba(255,255,255,.7);margin-bottom:6px">Active visitors right now</div>
                <div style="font-size:40px;font-weight:800;color:#fff;line-height:1">1,247</div>
              </div>
              <div style="opacity:.5">${MINI_CHART()}</div>
            </div>
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:space-between;min-height:200px">
              <div style="font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:.5px">Bounce rate</div>
              <div>
                <div style="font-size:36px;font-weight:700;color:var(--text);line-height:1">24%</div>
                <div style="font-size:12px;color:#3fb950;margin-top:4px">↓ 8% vs last week</div>
              </div>
            </div>
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;justify-content:space-between;min-height:200px">
              <div style="font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:.5px">Avg session</div>
              <div>
                <div style="font-size:36px;font-weight:700;color:var(--text);line-height:1">4:32</div>
                <div style="font-size:12px;color:#3fb950;margin-top:4px">↑ 12% vs last week</div>
              </div>
            </div>
            ${[
              ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L7 14h6l-1 8 8-12h-6l1-8z"/></svg>','Real-time events'],
              ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="14" height="8" rx="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>','Zero PII collected'],
              ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 3-2 9 0 12M8 2c2 3 2 9 0 12"/></svg>','40+ edge regions'],
              ['<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 9a3 3 0 0 0 4.24.06l2-2a3 3 0 0 0-4.24-4.24l-1.14 1.14"/><path d="M9 7a3 3 0 0 0-4.24-.06l-2 2a3 3 0 0 0 4.24 4.24l1.13-1.13"/></svg>','Custom integrations'],
            ].map(([icon,title])=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;align-items:center;gap:12px">
                <div style="color:var(--accent);flex-shrink:0">${icon}</div>
                <span style="font-size:13px;font-weight:500;color:var(--text)">${title}</span>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Stats + feature rows',
      preview: '[ big stat card  ]\n[feat][feat][feat]',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="text-align:center;margin-bottom:40px">
            ${BADGE('By the numbers')}
            ${HEADING('Metrics that matter', 30)}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:var(--container);margin:0 auto 12px">
            ${[['24,891','Unique visitors last month'],['99.9%','Uptime over past 12 months']].map(([v,l])=>`
              <div style="background:var(--bg);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                <div style="font-size:40px;font-weight:800;color:var(--accent);line-height:1;margin-bottom:8px">${v}</div>
                <div style="font-size:13px;color:var(--text-2)">${l}</div>
              </div>`).join('')}
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:var(--container);margin:0 auto">
            ${STATS.map(s=>`
              <div style="background:var(--bg);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px;text-align:center">
                <div style="font-size:22px;font-weight:700;color:var(--text);line-height:1">${s.val}</div>
                <div style="font-size:11px;color:var(--text-3);margin-top:6px">${s.label}</div>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Video ───────────────────────────────────────────────────────

  register('video', 'Video', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="9" height="9" rx="1"/><path d="M10 5.5l3-2v7l-3-2"/></svg>', [
    {
      label: 'Centered player',
      preview: '  ┌─────────┐\n  │  ▶  │\n  └─────────┘',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg);text-align:center">
          <div style="margin-bottom:32px">
            ${BADGE('See it in action')}
            ${HEADING('Watch the 2-minute demo', 32)}
            <p style="font-size:14px;color:var(--text-2);max-width:420px;margin:0 auto">See how Umbra works from install to first insight.</p>
          </div>
          <div style="max-width:760px;margin:0 auto;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;position:relative">
            <div style="padding-top:56.25%;background:var(--bg-el);position:relative">
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
                <div style="width:64px;height:64px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </section>`
    },
    {
      label: 'Split — text + player',
      preview: 'text  |  ▶ player',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-5);align-items:center;max-width:var(--container);margin:0 auto">
            <div>
              ${BADGE('Demo')}
              ${HEADING('See it in 2 minutes', 30)}
              <p style="font-size:14px;color:var(--text-2);margin:0 0 20px;line-height:1.6">A quick walkthrough from install to live dashboard. No slides, no fluff.</p>
              ${BTN_PRIMARY('Watch now')}
            </div>
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden">
              <div style="padding-top:56.25%;background:var(--bg-el);position:relative">
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
                  <div style="width:56px;height:56px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>`
    },
    {
      label: 'Video + testimonial',
      preview: '▶ player\n"quote" — name',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg-card);border-top:var(--border-w) solid var(--border)">
          <div style="text-align:center;margin-bottom:32px">
            ${BADGE('Product tour')}
            ${HEADING('See it live', 32)}
          </div>
          <div style="max-width:680px;margin:0 auto">
            <div style="background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:24px">
              <div style="padding-top:52%;position:relative">
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
                  <div style="width:60px;height:60px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
            </div>
            <div style="background:var(--bg);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:20px;display:flex;gap:16px;align-items:flex-start">
              ${AVATAR('SK')}
              <div>
                <p style="margin:0 0 8px;font-size:13px;color:var(--text-2);line-height:1.6;font-style:italic">"${TESTIMONIALS[0].text}"</p>
                <div style="font-size:12px;font-weight:500;color:var(--text)">${TESTIMONIALS[0].name}</div>
                <div style="font-size:11px;color:var(--text-3)">${TESTIMONIALS[0].role}</div>
              </div>
            </div>
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Contact ─────────────────────────────────────────────────────

  register('contact', 'Contact', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="12" height="9" rx="1"/><path d="M1 5l6 4 6-4"/></svg>', [
    {
      label: 'Form + info split',
      preview: 'form  |  info',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-5);max-width:var(--container);margin:0 auto">
            <div>
              ${BADGE('Contact')}
              ${HEADING('Get in touch', 30)}
              <p style="font-size:14px;color:var(--text-2);margin:0 0 28px;line-height:1.6">Have a question? We typically reply within 2 business hours.</p>
              ${[['Email','hello@umbra.io'],['Chat','Available in-app, 9–5 ET'],['Phone','Enterprise customers only']].map(([k,v])=>`
                <div style="margin-bottom:16px">
                  <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:2px">${k}</div>
                  <div style="font-size:13px;color:var(--text-3)">${v}</div>
                </div>`).join('')}
            </div>
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);display:flex;flex-direction:column;gap:14px">
              ${[['Name','Your name'],['Email','your@email.com'],['Subject','How can we help?']].map(([l,p])=>`
                <div>
                  <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:6px">${l}</label>
                  <input placeholder="${p}" style="width:100%;padding:10px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;box-sizing:border-box">
                </div>`).join('')}
              <div>
                <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:6px">Message</label>
                <textarea placeholder="Tell us more..." style="width:100%;padding:10px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;resize:vertical;min-height:80px;box-sizing:border-box;font-family:inherit"></textarea>
              </div>
              ${BTN_PRIMARY('Send message')}
            </div>
          </div>
        </section>`
    },
    {
      label: 'Centered form',
      preview: '   heading\n  [─form─]',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg);text-align:center">
          <div style="margin-bottom:32px">
            ${BADGE('Contact')}
            ${HEADING('Send us a message', 30)}
          </div>
          <div style="max-width:480px;margin:0 auto;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4);text-align:left;display:flex;flex-direction:column;gap:14px">
            ${[['Name','Your name'],['Email','your@email.com']].map(([l,p])=>`
              <div>
                <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:6px">${l}</label>
                <input placeholder="${p}" style="width:100%;padding:10px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;box-sizing:border-box">
              </div>`).join('')}
            <div>
              <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:6px">Message</label>
              <textarea placeholder="How can we help?" style="width:100%;padding:10px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;resize:vertical;min-height:100px;box-sizing:border-box;font-family:inherit"></textarea>
            </div>
            <button style="width:100%;background:var(--accent);color:#fff;border:none;padding:11px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer">Send message</button>
          </div>
        </section>`
    },
    {
      label: 'Support channels',
      preview: '[chat][email][docs]',
      render: () => `
        <section style="padding:64px var(--sp-5);background:var(--bg)">
          <div style="text-align:center;margin-bottom:48px">
            ${BADGE('Support')}
            ${HEADING('We\'re here to help', 32)}
            <p style="font-size:14px;color:var(--text-2);max-width:400px;margin:0 auto">Reach out through any channel. We typically respond within 2 hours during business hours.</p>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:820px;margin:0 auto 48px">
            ${[
              ['<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 2h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-4 3V3a1 1 0 0 1 1-1z"/></svg>','Live chat','Chat with the team in-app. Available weekdays 9–5 ET.','Start chat'],
              ['<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="18" height="14" rx="1.5"/><path d="M2 7l9 6 9-6"/></svg>','Email support','Drop us a line. Reply within one business day.','hello@umbra.io'],
              ['<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="14" height="18" rx="1.5"/><path d="M8 8h6M8 12h6M8 16h3"/></svg>','Documentation','Self-serve answers, guides, and API reference.','Browse docs'],
            ].map(([icon,title,desc,cta])=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                <div style="color:var(--accent);margin-bottom:14px">${icon}</div>
                <h3 style="margin:0 0 6px;font-size:15px;font-weight:600;color:var(--text)">${title}</h3>
                <p style="margin:0 0 16px;font-size:13px;color:var(--text-2);line-height:1.5">${desc}</p>
                <a href="#" style="font-size:13px;color:var(--accent);text-decoration:none;font-weight:500">${cta} →</a>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  // ─── SECTION: Auth ────────────────────────────────────────────────────────

  register('auth', 'Auth', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="8" height="7" rx="1"/><path d="M5 6V4a2 2 0 0 1 4 0v2"/></svg>', [
    {
      label: 'Centered card',
      preview: '  ╔════╗\n  ║auth║\n  ╚════╝',
      render: () => `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:var(--sp-4)">
          <div style="width:100%;max-width:380px;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-5)">
            <div style="text-align:center;margin-bottom:24px">
              ${LOGO()}
              <h2 style="margin:12px 0 4px;font-size:20px;font-weight:600;color:var(--text)">Sign in to Umbra</h2>
              <p style="margin:0;font-size:13px;color:var(--text-3)">Welcome back</p>
            </div>
            <button style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);font-size:13px;color:var(--text);cursor:pointer;margin-bottom:16px">
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9L37 9.9C33.2 6.5 28.8 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11 0 20.5-8 20.5-20 0-1.3-.1-2.7-.5-5.5z"/></svg>
              Continue with Google
            </button>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
              <div style="flex:1;height:1px;background:var(--border)"></div>
              <span style="font-size:11px;color:var(--text-3)">or</span>
              <div style="flex:1;height:1px;background:var(--border)"></div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px">
              <div>
                <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:5px">Email</label>
                <input placeholder="you@company.com" style="width:100%;padding:9px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;box-sizing:border-box">
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                  <label style="font-size:12px;color:var(--text-2)">Password</label>
                  <a href="#" style="font-size:12px;color:var(--accent);text-decoration:none">Forgot?</a>
                </div>
                <input type="password" placeholder="••••••••" style="width:100%;padding:9px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;box-sizing:border-box">
              </div>
              <button style="width:100%;background:var(--accent);color:#fff;border:none;padding:10px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer">Sign in</button>
            </div>
            <p style="text-align:center;margin:16px 0 0;font-size:12px;color:var(--text-3)">Don't have an account? <a href="#" style="color:var(--accent);text-decoration:none">Sign up</a></p>
          </div>
        </div>`
    },
    {
      label: 'Sign up card',
      preview: '  ╔══════╗\n  ║signup║\n  ╚══════╝',
      render: () => `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:var(--sp-4)">
          <div style="width:100%;max-width:400px;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-5)">
            <div style="text-align:center;margin-bottom:24px">
              ${LOGO()}
              <h2 style="margin:12px 0 4px;font-size:20px;font-weight:600;color:var(--text)">Create your account</h2>
              <p style="margin:0;font-size:13px;color:var(--text-3)">14-day free trial · No credit card</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                ${[['First name','Alex'],['Last name','Morgan']].map(([l,p])=>`
                  <div>
                    <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:5px">${l}</label>
                    <input placeholder="${p}" style="width:100%;padding:9px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;box-sizing:border-box">
                  </div>`).join('')}
              </div>
              ${[['Work email','you@company.com'],['Password','Create a password']].map(([l,p])=>`
                <div>
                  <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:5px">${l}</label>
                  <input placeholder="${p}" style="width:100%;padding:9px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;box-sizing:border-box">
                </div>`).join('')}
            </div>
            <button style="width:100%;background:var(--accent);color:#fff;border:none;padding:11px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer;margin-bottom:12px">Start free trial</button>
            <p style="text-align:center;margin:0;font-size:12px;color:var(--text-3)">By signing up you agree to our <a href="#" style="color:var(--accent);text-decoration:none">Terms</a> & <a href="#" style="color:var(--accent);text-decoration:none">Privacy Policy</a></p>
            <div style="border-top:var(--border-w) solid var(--border);margin-top:16px;padding-top:14px;text-align:center">
              <p style="margin:0;font-size:12px;color:var(--text-3)">Already have an account? <a href="#" style="color:var(--accent);text-decoration:none">Sign in</a></p>
            </div>
          </div>
        </div>`
    },
    {
      label: 'Split hero + form',
      preview: 'promo  |  form',
      render: () => `
        <div style="min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:var(--bg)">
          <div style="background:var(--accent);padding:var(--sp-6);display:flex;flex-direction:column;justify-content:center">
            <div style="margin-bottom:40px">${LOGO()}</div>
            ${HEADING('Analytics that respects your users', 34)}
            <p style="font-size:15px;color:rgba(255,255,255,.8);margin:0 0 32px;line-height:1.6">Real-time insights, zero tracking, no consent banners. Join 2,400+ teams who made the switch.</p>
            ${STATS.slice(0,2).map(s=>`
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
                <div style="font-size:24px;font-weight:700;color:#fff;min-width:60px">${s.val}</div>
                <div style="font-size:13px;color:rgba(255,255,255,.7)">${s.label}</div>
              </div>`).join('')}
          </div>
          <div style="display:flex;align-items:center;justify-content:center;padding:var(--sp-6)">
            <div style="width:100%;max-width:340px">
              <h2 style="font-size:22px;font-weight:600;color:var(--text);margin:0 0 6px">Create your account</h2>
              <p style="font-size:13px;color:var(--text-3);margin:0 0 24px">14-day free trial · No credit card required</p>
              <div style="display:flex;flex-direction:column;gap:12px">
                ${[['Email','you@company.com'],['Password','Create a password']].map(([l,p])=>`
                  <div>
                    <label style="display:block;font-size:12px;color:var(--text-2);margin-bottom:5px">${l}</label>
                    <input placeholder="${p}" style="width:100%;padding:10px 12px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;outline:none;box-sizing:border-box">
                  </div>`).join('')}
                <button style="background:var(--accent);color:#fff;border:none;padding:11px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer">Get started free</button>
                <p style="text-align:center;margin:0;font-size:12px;color:var(--text-3)">Already have an account? <a href="#" style="color:var(--accent);text-decoration:none">Sign in</a></p>
              </div>
            </div>
          </div>
        </div>`
    },
  ]);

  // ─── SECTION: Error page (404 / 500 etc.) ────────────────────────────────

  register('error-page', 'Error page', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.5"/><path d="M7 4v4M7 10v.5"/></svg>', [
    {
      label: 'Centered 404',
      preview: '  404\n  oops\n [btn]',
      render: () => `
        <section style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px var(--sp-5);background:var(--bg);text-align:center">
          <div style="font-size:96px;font-weight:800;line-height:1;color:var(--text);opacity:.08;user-select:none;margin-bottom:16px">404</div>
          <div style="margin-top:-72px">
            ${HEADING('Page not found', 32)}
            <p style="font-size:14px;color:var(--text-2);margin:0 0 28px;max-width:380px">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              ${BTN_PRIMARY('Back to home')}
              ${BTN_GHOST('Contact support')}
            </div>
          </div>
        </section>`
    },
    {
      label: 'Illustrated split',
      preview: 'art left | text right',
      render: () => `
        <section style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-6);align-items:center;padding:80px var(--sp-5);background:var(--bg);max-width:var(--container);margin:0 auto">
          <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);min-height:260px;display:flex;align-items:center;justify-content:center">
            <div style="text-align:center;padding:var(--sp-4)">
              <div style="font-size:72px;font-weight:800;color:var(--accent);opacity:.2;line-height:1">404</div>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:16px;opacity:.3">
                ${Array(8).fill(0).map(()=>`<div style="height:6px;border-radius:3px;background:var(--border)"></div>`).join('')}
              </div>
            </div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--accent);margin-bottom:12px">Error 404</div>
            ${HEADING('Looks like you got lost', 28)}
            <p style="font-size:14px;color:var(--text-2);margin:0 0 24px;line-height:1.6">This page doesn't exist. It may have been moved, renamed, or deleted.</p>
            <div style="display:flex;flex-direction:column;gap:8px;max-width:280px">
              ${BTN_PRIMARY('Take me home')}
              ${BTN_GHOST('Search the docs')}
            </div>
          </div>
        </section>`
    },
    {
      label: 'Minimal 500 error',
      preview: '  500\n  server error\n  [btn]',
      render: () => `
        <section style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px var(--sp-5);background:var(--bg);text-align:center">
          <div style="width:64px;height:64px;border-radius:var(--radius);background:var(--bg-card);border:var(--border-w) solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:24px">
            <svg width="28" height="28" fill="none" stroke="var(--text-3)" stroke-width="1.5"><circle cx="14" cy="14" r="10"/><path d="M14 9v6M14 17v2"/></svg>
          </div>
          <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-3);margin-bottom:8px">500 — Server Error</div>
          ${HEADING('Something went wrong on our end', 28)}
          <p style="font-size:14px;color:var(--text-2);margin:0 0 24px;max-width:360px;line-height:1.6">Our team has been notified and we're working to fix it. Please try again in a few minutes.</p>
          <div style="display:flex;gap:10px;justify-content:center">
            ${BTN_PRIMARY('Try again')}
            ${BTN_GHOST('Check status page')}
          </div>
          <p style="margin:20px 0 0;font-size:12px;color:var(--text-3)">Status: <a href="#" style="color:var(--accent);text-decoration:none">status.umbra.io</a></p>
        </section>`
    },
  ]);

  // ─── SECTION: Article body (blog post, docs) ──────────────────────────────

  register('article-body', 'Article body', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4h10M2 7h10M2 10h6"/><rect x="2" y="1" width="10" height="13" rx="1" opacity=".3"/></svg>', [
    {
      label: 'Single column',
      preview: 'tag — date\nHeading\n────────',
      render: () => `
        <article style="max-width:680px;margin:0 auto;padding:56px var(--sp-5)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
            ${PILL('Engineering', true)}
            <span style="font-size:12px;color:var(--text-3)">May 12, 2025</span>
            <span style="font-size:12px;color:var(--text-3)">·</span>
            <span style="font-size:12px;color:var(--text-3)">8 min read</span>
          </div>
          <h1 style="font-size:32px;font-weight:700;line-height:1.25;color:var(--text);margin-bottom:12px">How we built sub-second event ingestion at scale</h1>
          <p style="font-size:15px;color:var(--text-2);margin-bottom:24px;line-height:1.6">A deep dive into our edge processing architecture and the lessons learned getting to p99 < 50ms globally.</p>
          <div style="display:flex;align-items:center;gap:10px;padding:16px 0;border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border);margin-bottom:32px">
            ${AVATAR('JC','#8957E5')}
            <div>
              <div style="font-size:13px;font-weight:500;color:var(--text)">Jamie Chen</div>
              <div style="font-size:11px;color:var(--text-3)">CTO at Umbra</div>
            </div>
          </div>
          <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:28px;aspect-ratio:16/6;display:flex;align-items:center;justify-content:center">
            <span style="font-size:13px;color:var(--text-3)">Cover image</span>
          </div>
          ${[
            'When we first started building Umbra, we assumed event ingestion was a solved problem. We were wrong.',
            'The challenge wasn\'t throughput — it was latency. Our users expected their dashboards to update the moment an event occurred. That meant processing at the edge, not in a central data center.',
            'We evaluated a dozen approaches before landing on a hybrid model that combines edge workers for initial processing with a regional aggregation layer before writing to our main store.',
          ].map(p=>`<p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:18px">${p}</p>`).join('')}
          <h2 style="font-size:22px;font-weight:600;color:var(--text);margin:36px 0 14px">The edge processing layer</h2>
          ${[
            'Each edge worker handles validation, deduplication, and initial enrichment. This reduces the data volume hitting our regional tier by 40%.',
            'We use consistent hashing to route events from the same session to the same worker, which makes deduplication trivial without coordination overhead.',
          ].map(p=>`<p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:18px">${p}</p>`).join('')}
          <div style="background:var(--bg-el);border-left:3px solid var(--accent);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:16px 20px;margin:28px 0">
            <p style="font-size:14px;color:var(--text-2);line-height:1.6;margin:0;font-style:italic">"The key insight was treating the edge layer as a filter, not a processor. Do the minimum needed to make the data trustworthy, nothing more."</p>
          </div>
        </article>`
    },
    {
      label: 'With sidebar TOC',
      preview: 'content  | TOC',
      render: () => `
        <div style="display:grid;grid-template-columns:1fr 220px;gap:var(--sp-6);max-width:960px;margin:0 auto;padding:56px var(--sp-5);align-items:start">
          <article>
            <div style="display:flex;gap:8px;margin-bottom:16px">${PILL('Engineering',true)}<span style="font-size:12px;color:var(--text-3);padding-top:4px">May 12 · 8 min</span></div>
            <h1 style="font-size:28px;font-weight:700;color:var(--text);margin-bottom:12px;line-height:1.3">How we built sub-second event ingestion at scale</h1>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;padding-bottom:20px;border-bottom:var(--border-w) solid var(--border)">
              ${AVATAR('JC','#8957E5')}
              <span style="font-size:13px;color:var(--text-2)">Jamie Chen, CTO</span>
            </div>
            ${['Overview','The edge layer','Regional aggregation','Results'].map((h,i)=>`
              <h2 style="font-size:18px;font-weight:600;color:var(--text);margin:28px 0 10px">${h}</h2>
              <p style="font-size:14px;color:var(--text-2);line-height:1.7;margin-bottom:14px">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.</p>
            `).join('')}
          </article>
          <aside style="position:sticky;top:20px;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px">
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-3);margin-bottom:12px">On this page</div>
            ${['Overview','The edge layer','Regional aggregation','Results','Conclusion'].map((h,i)=>`
              <div style="padding:5px 8px;border-radius:var(--radius-sm);${i===0?'background:var(--accent-sub);':''}">
                <a href="#" style="font-size:12px;color:${i===0?'var(--accent)':'var(--text-3)'};text-decoration:none">${h}</a>
              </div>`).join('')}
          </aside>
        </div>`
    },
    {
      label: 'Docs layout',
      preview: '[nav] | content',
      render: () => `
        <div style="display:grid;grid-template-columns:220px 1fr;gap:0;max-width:1080px;margin:0 auto;min-height:80vh">
          <nav style="border-right:var(--border-w) solid var(--border);padding:32px 20px;background:var(--bg-card)">
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-3);margin-bottom:12px">Getting started</div>
            ${['Introduction','Quick start','Installation','Configuration'].map((h,i)=>`
              <a href="#" style="display:block;padding:7px 10px;border-radius:var(--radius-sm);font-size:13px;color:${i===0?'var(--accent)':'var(--text-2)'};background:${i===0?'var(--accent-sub)':'transparent'};text-decoration:none;margin-bottom:2px">${h}</a>`).join('')}
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-3);margin:20px 0 12px">Guides</div>
            ${['Custom events','Funnels','Integrations','API reference'].map(h=>`
              <a href="#" style="display:block;padding:7px 10px;border-radius:var(--radius-sm);font-size:13px;color:var(--text-2);text-decoration:none;margin-bottom:2px">${h}</a>`).join('')}
          </nav>
          <article style="padding:40px var(--sp-5)">
            <div style="display:flex;gap:6px;margin-bottom:24px;font-size:12px;color:var(--text-3)">
              <span>Docs</span><span>/</span><span>Getting started</span><span>/</span><span style="color:var(--text-2)">Introduction</span>
            </div>
            <h1 style="font-size:28px;font-weight:700;color:var(--text);margin:0 0 16px;line-height:1.3">Introduction to Umbra</h1>
            <p style="font-size:15px;color:var(--text-2);margin:0 0 24px;line-height:1.7">Umbra is a privacy-first analytics platform that gives you complete visibility into how users interact with your product — without collecting personal data or requiring consent banners.</p>
            <div style="background:var(--accent-sub);border:var(--border-w) solid var(--accent);border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:24px">
              <p style="margin:0;font-size:13px;color:var(--accent);line-height:1.6"><strong>Quick start:</strong> Add one script tag and you'll have data in under 60 seconds.</p>
            </div>
            <h2 style="font-size:18px;font-weight:600;color:var(--text);margin:0 0 12px">How it works</h2>
            <p style="font-size:14px;color:var(--text-2);margin:0 0 16px;line-height:1.7">When a user visits your site, Umbra's edge worker captures the event — page view, click, conversion — strips any identifiable information at the network layer, and writes an anonymised event to your dashboard in real time.</p>
            <div style="display:flex;justify-content:space-between;padding-top:24px;border-top:var(--border-w) solid var(--border);margin-top:8px">
              <span style="font-size:13px;color:var(--text-3)">← Previous</span>
              <a href="#" style="font-size:13px;color:var(--accent);text-decoration:none">Quick start →</a>
            </div>
          </article>
        </div>`
    },
  ]);

  // ─── SECTION: Legal body (privacy, terms) ─────────────────────────────────

  register('legal-body', 'Legal body', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="10" height="13" rx="1"/><path d="M5 5h4M5 8h4M5 11h2"/></svg>', [
    {
      label: 'Document layout',
      preview: '# heading\n  text\n  text',
      render: () => `
        <div style="max-width:720px;margin:0 auto;padding:56px var(--sp-5)">
          <div style="margin-bottom:40px;padding-bottom:24px;border-bottom:var(--border-w) solid var(--border)">
            ${HEADING('Privacy Policy', 30)}
            <p style="font-size:13px;color:var(--text-3);margin:8px 0 0">Last updated: May 12, 2025 · Effective: June 1, 2025</p>
          </div>
          <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px 20px;margin-bottom:32px">
            <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin:0">We take your privacy seriously. This policy explains what data we collect, why we collect it, and how you can control it. Umbra is designed to be privacy-first — we collect the minimum data necessary to provide you with a great analytics experience.</p>
          </div>
          ${[
            ['1. Information We Collect', 'We collect information you provide directly (name, email, billing details) and data about how you use our service (pages visited, features used, performance metrics). We do not collect personal data about your end-users through our analytics tracking code.'],
            ['2. How We Use Your Data', 'We use your data to provide and improve the service, send you product updates and billing notifications, and troubleshoot issues. We never sell your data to third parties or use it for advertising.'],
            ['3. Data Retention', 'We retain your account data for as long as you maintain an account with us. Analytics data is retained according to your plan (7 days on Free, 12 months on Pro, unlimited on Enterprise).'],
            ['4. Your Rights', 'You have the right to access, correct, or delete your personal data at any time. You can export your data from your account settings or contact us at privacy@umbra.io.'],
          ].map(([title, text])=>`
            <div style="margin-bottom:28px">
              <h2 style="font-size:17px;font-weight:600;color:var(--text);margin:0 0 10px">${title}</h2>
              <p style="font-size:14px;color:var(--text-2);line-height:1.75;margin:0">${text}</p>
            </div>`).join('')}
          <div style="padding-top:24px;border-top:var(--border-w) solid var(--border);margin-top:16px">
            <p style="font-size:13px;color:var(--text-3)">Questions? Contact us at <a href="#" style="color:var(--accent)">privacy@umbra.io</a></p>
          </div>
        </div>`
    },
    {
      label: 'Two-column layout',
      preview: '[TOC] | doc text',
      render: () => `
        <div style="display:grid;grid-template-columns:220px 1fr;gap:var(--sp-6);max-width:920px;margin:0 auto;padding:56px var(--sp-5);align-items:start">
          <aside style="position:sticky;top:20px">
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-3);margin-bottom:10px">Contents</div>
              ${['1. Information We Collect','2. How We Use Data','3. Data Retention','4. Your Rights'].map((h,i)=>`
                <a href="#" style="display:block;padding:4px 0;font-size:12px;color:${i===0?'var(--accent)':'var(--text-3)'};text-decoration:none;margin-bottom:2px">${h}</a>`).join('')}
            </div>
            <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px">
              <div style="font-size:12px;color:var(--text-3);line-height:1.5">Last updated: May 12, 2025</div>
              <div style="font-size:12px;color:var(--text-3);margin-top:4px">Effective: June 1, 2025</div>
            </div>
          </aside>
          <div>
            <div style="margin-bottom:32px;padding-bottom:20px;border-bottom:var(--border-w) solid var(--border)">
              <h1 style="font-size:28px;font-weight:700;color:var(--text);margin:0 0 8px">Privacy Policy</h1>
              <p style="font-size:13px;color:var(--text-3);margin:0">Umbra Analytics Ltd · Registered in Ireland</p>
            </div>
            ${[
              ['1. Information We Collect', 'We collect information you provide directly (name, email, billing details) and data about how you use our service. We do not collect personal data about your end-users through our analytics tracking code.'],
              ['2. How We Use Your Data', 'We use your data to provide and improve the service, send you product updates and billing notifications, and troubleshoot issues. We never sell your data to third parties.'],
              ['3. Data Retention', 'Analytics data is retained according to your plan: 7 days on Free, 12 months on Pro, unlimited on Enterprise.'],
              ['4. Your Rights', 'Access, correct, or delete your data at any time via account settings or by emailing privacy@umbra.io.'],
            ].map(([title, text])=>`
              <div style="margin-bottom:28px">
                <h2 style="font-size:16px;font-weight:600;color:var(--text);margin:0 0 8px">${title}</h2>
                <p style="font-size:14px;color:var(--text-2);line-height:1.75;margin:0">${text}</p>
              </div>`).join('')}
          </div>
        </div>`
    },
    {
      label: 'Minimal full-page',
      preview: 'Policy name\n──────────\n text text',
      render: () => `
        <div style="max-width:640px;margin:0 auto;padding:56px var(--sp-5)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:var(--border-w) solid var(--border)">
            <h1 style="font-size:24px;font-weight:700;color:var(--text);margin:0">Terms of Service</h1>
            <span style="font-size:12px;color:var(--text-3)">v2.1 · May 2025</span>
          </div>
          ${[
            ['Acceptance of Terms', 'By accessing or using Umbra, you agree to be bound by these Terms. If you disagree with any part, you may not access the service.'],
            ['Description of Service', 'Umbra provides privacy-first web analytics for product teams. We collect anonymised event data on your behalf as a data processor under GDPR Article 28.'],
            ['Intellectual Property', 'The service and its original content, features, and functionality are and will remain the exclusive property of Umbra Analytics Ltd.'],
            ['Limitation of Liability', 'In no event shall Umbra, its directors, employees, or agents be liable for any indirect, incidental, or consequential damages arising from your use of the service.'],
          ].map(([title, text])=>`
            <div style="margin-bottom:24px">
              <h2 style="font-size:14px;font-weight:600;color:var(--text);margin:0 0 6px;text-transform:uppercase;letter-spacing:.3px">${title}</h2>
              <p style="font-size:14px;color:var(--text-2);line-height:1.7;margin:0">${text}</p>
            </div>`).join('')}
          <div style="padding-top:20px;border-top:var(--border-w) solid var(--border)">
            <p style="font-size:12px;color:var(--text-3)">Questions? <a href="#" style="color:var(--accent)">legal@umbra.io</a></p>
          </div>
        </div>`
    },
  ]);

  // ─── SECTION: Changelog list ──────────────────────────────────────────────

  register('changelog-list', 'Changelog list', '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="10" height="13" rx="1"/><path d="M5 4h4M5 7h4M5 10h4"/></svg>', [
    {
      label: 'Timeline entries',
      preview: '● v2.1 — date\n  changes\n● v2.0 — date',
      render: () => `
        <section style="max-width:680px;margin:0 auto;padding:56px var(--sp-5)">
          <div style="margin-bottom:48px">
            ${BADGE('Changelog')}
            ${HEADING('What\'s new', 30)}
            <p style="font-size:14px;color:var(--text-2);margin:0">Updates, improvements, and fixes — newest first.</p>
          </div>
          ${[
            { version:'v2.1.0', date:'May 12, 2025', tag:'Feature', title:'Real-time alert webhooks', changes:['Send HTTP webhooks when traffic goals are hit','Configurable retry logic with exponential backoff','New alert management dashboard'] },
            { version:'v2.0.4', date:'Apr 28, 2025', tag:'Fix', title:'Dashboard performance improvements', changes:['30% faster initial load on large datasets','Fixed memory leak in live visitor counter','Corrected timezone handling for EU users'] },
            { version:'v2.0.0', date:'Apr 10, 2025', tag:'Major', title:'Complete dashboard redesign', changes:['New data visualization engine','Custom event builder with no-code interface','Funnel analysis with up to 10 steps','Dark and light theme support'] },
          ].map(entry=>`
            <div style="display:grid;grid-template-columns:100px 1fr;gap:var(--sp-4);margin-bottom:40px;padding-bottom:40px;border-bottom:var(--border-w) solid var(--border-sub)">
              <div style="padding-top:3px">
                <div style="font-size:12px;font-weight:600;color:var(--text-3)">${entry.version}</div>
                <div style="font-size:11px;color:var(--text-3);margin-top:2px">${entry.date}</div>
              </div>
              <div>
                <div style="margin-bottom:10px">
                  ${PILL(entry.tag, entry.tag==='Major')}
                </div>
                <h3 style="font-size:16px;font-weight:600;color:var(--text);margin:0 0 12px">${entry.title}</h3>
                <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px">
                  ${entry.changes.map(c=>`<li style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--text-2)"><span style="color:var(--accent);margin-top:1px;flex-shrink:0">+</span>${c}</li>`).join('')}
                </ul>
              </div>
            </div>`).join('')}
        </section>`
    },
    {
      label: 'Card grid',
      preview: '┌v2.1┐┌v2.0┐\n└────┘└────┘',
      render: () => `
        <section style="padding:56px var(--sp-5);max-width:var(--container);margin:0 auto">
          <div style="margin-bottom:40px">
            ${BADGE('Changelog')}
            ${HEADING('Release history', 30)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
            ${[
              {v:'v2.1.0',date:'May 12',tag:'Feature',desc:'Real-time alert webhooks with configurable retry logic.'},
              {v:'v2.0.4',date:'Apr 28',tag:'Fix',desc:'Dashboard performance improvements and bug fixes.'},
              {v:'v2.0.0',date:'Apr 10',tag:'Major',desc:'Complete dashboard redesign with new visualization engine.'},
            ].map(e=>`
              <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:var(--sp-4)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                  <span style="font-size:13px;font-weight:600;color:var(--text)">${e.v}</span>
                  ${PILL(e.tag, e.tag==='Major')}
                </div>
                <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin:0 0 12px">${e.desc}</p>
                <div style="font-size:11px;color:var(--text-3)">${e.date}</div>
              </div>`).join('')}
          </div>
        </section>`
    },
    {
      label: 'Feed style',
      preview: '◉ date · tag · title\n◉ date · tag · title',
      render: () => `
        <section style="max-width:660px;margin:0 auto;padding:56px var(--sp-5)">
          <div style="margin-bottom:40px">
            ${BADGE('Changelog')}
            ${HEADING('Updates', 28)}
            <p style="font-size:14px;color:var(--text-2);margin:0">Latest changes, newest first.</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:0">
            ${[
              { version:'v2.1.0', date:'May 12', tag:'Feature', title:'Real-time alert webhooks', summary:'Send HTTP webhooks when traffic goals are hit. Configurable retry logic and delay included.' },
              { version:'v2.0.4', date:'Apr 28', tag:'Fix', title:'Dashboard performance improvements', summary:'30% faster initial load on large datasets. Fixed memory leak in live visitor counter.' },
              { version:'v2.0.3', date:'Apr 15', tag:'Fix', title:'Timezone handling for EU users', summary:'Corrected UTC offset bugs affecting sessions spanning midnight in European timezones.' },
              { version:'v2.0.0', date:'Apr 10', tag:'Major', title:'Complete dashboard redesign', summary:'New data visualization engine, custom event builder, funnel analysis up to 10 steps.' },
            ].map((e,i,arr)=>`
              <div style="padding:20px 0;${i>0?'border-top:var(--border-w) solid var(--border)':''}">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                  <span style="font-size:11px;color:var(--text-3)">${e.date} 2025</span>
                  <span style="color:var(--border)">·</span>
                  ${PILL(e.tag, e.tag==='Major')}
                  <span style="font-size:12px;font-weight:500;color:var(--text-3)">${e.version}</span>
                </div>
                <h3 style="font-size:15px;font-weight:600;color:var(--text);margin:0 0 6px">${e.title}</h3>
                <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin:0">${e.summary}</p>
              </div>`).join('')}
          </div>
        </section>`
    },
  ]);

  function setProjectName(name) { _projectName = name || 'Brand'; }

  return { get, list, setProjectName };
})();
