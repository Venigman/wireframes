/* =============================================
   VISUALS.JS — Product visual renderers
   All rendered in HTML/CSS/SVG, responsive,
   colored by CSS variables (palette)
   ============================================= */

const Visuals = (() => {

  // Registry: id → { label, render(tokens) → HTML }
  const registry = {};

  function register(id, label, renderFn) {
    registry[id] = { id, label, render: renderFn };
  }

  function get(id) { return registry[id] || registry['dashboard']; }
  function list() { return Object.values(registry); }

  // ── Shared mini UI helpers ──────────────────
  const BAR = (w, color='var(--accent)') =>
    `<div style="height:8px;border-radius:4px;background:${color};width:${w}%;margin-bottom:4px;"></div>`;

  const STAT = (label, val) =>
    `<div style="background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;flex:1;min-width:0;">
      <div style="font-size:11px;color:var(--text-3);margin-bottom:4px;">${label}</div>
      <div style="font-size:18px;font-weight:700;font-family:var(--font-mono,monospace);color:var(--text);">${val}</div>
    </div>`;

  const WINDOW = (title, content) =>
    `<div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--bg-el);border-bottom:var(--border-w) solid var(--border);">
        <span style="width:10px;height:10px;border-radius:50%;background:#F85149;display:inline-block;"></span>
        <span style="width:10px;height:10px;border-radius:50%;background:#D29922;display:inline-block;"></span>
        <span style="width:10px;height:10px;border-radius:50%;background:#3FB950;display:inline-block;"></span>
        <span style="flex:1;background:var(--bg);border-radius:4px;height:18px;margin-left:4px;"></span>
        <span style="font-size:10px;color:var(--text-3);font-family:var(--font-mono,monospace);">${title}</span>
      </div>
      <div style="padding:12px;">${content}</div>
    </div>`;

  // ── 1. Dashboard ─────────────────────────────
  register('dashboard','Dashboard', () => `
    ${WINDOW('app.umbra.io/dashboard', `
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        ${STAT('Visitors','12,847')}${STAT('Views','38,291')}${STAT('Bounce','42.1%')}
      </div>
      <div style="background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:10px;margin-bottom:10px;height:80px;position:relative;overflow:hidden;">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" style="position:absolute;inset:8px 8px 0;width:calc(100% - 16px);height:52px;">
          <defs><linearGradient id="vg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".3"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
          <path d="M0,45 C60,40 100,18 160,20 C220,22 260,36 310,26 C350,18 380,8 400,5" fill="none" stroke="var(--accent)" stroke-width="2"/>
          <path d="M0,45 C60,40 100,18 160,20 C220,22 260,36 310,26 C350,18 380,8 400,5 L400,60 L0,60Z" fill="url(#vg1)"/>
        </svg>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div style="background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);overflow:hidden;">
          <div style="padding:6px 10px;border-bottom:var(--border-w) solid var(--border);font-size:11px;color:var(--text-3);">Top pages</div>
          <div style="padding:4px 10px;font-size:11px;color:var(--text-2);">/home <span style="float:right;font-family:var(--font-mono,monospace);color:var(--text);">4,210</span></div>
          <div style="padding:4px 10px;font-size:11px;color:var(--text-2);">/pricing <span style="float:right;font-family:var(--font-mono,monospace);color:var(--text);">1,843</span></div>
        </div>
        <div style="background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);overflow:hidden;">
          <div style="padding:6px 10px;border-bottom:var(--border-w) solid var(--border);font-size:11px;color:var(--text-3);">Countries</div>
          <div style="padding:4px 10px;font-size:11px;color:var(--text-2);">🇺🇸 US <span style="float:right;font-family:var(--font-mono,monospace);color:var(--text);">38%</span></div>
          <div style="padding:4px 10px;font-size:11px;color:var(--text-2);">🇩🇪 DE <span style="float:right;font-family:var(--font-mono,monospace);color:var(--text);">14%</span></div>
        </div>
      </div>
    `)}`);

  // ── 2. Chart ─────────────────────────────────
  register('chart','Chart', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px;">
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px;">Monthly Revenue</div>
      <div style="font-size:24px;font-weight:700;font-family:var(--font-mono,monospace);color:var(--text);margin-bottom:16px;">$48,392 <span style="font-size:13px;color:#3FB950;font-weight:500;">↑ 12.4%</span></div>
      <svg viewBox="0 0 360 120" style="width:100%;height:120px;">
        <defs><linearGradient id="vg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".25"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
        <path d="M0,90 L40,80 L80,60 L120,65 L160,40 L200,35 L240,20 L280,25 L320,10 L360,5" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
        <path d="M0,90 L40,80 L80,60 L120,65 L160,40 L200,35 L240,20 L280,25 L320,10 L360,5 L360,120 L0,120Z" fill="url(#vg2)"/>
        <circle cx="360" cy="5" r="4" fill="var(--accent)"/>
      </svg>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-3);margin-top:6px;padding:0 2px;">
        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span>
      </div>
    </div>`);

  // ── 3. Data table ─────────────────────────────
  register('data-table','Data table', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:8px 12px;background:var(--bg-el);border-bottom:var(--border-w) solid var(--border);">
        <span style="font-size:11px;font-weight:600;color:var(--text-3);">Name</span>
        <span style="font-size:11px;font-weight:600;color:var(--text-3);">Status</span>
        <span style="font-size:11px;font-weight:600;color:var(--text-3);">Amount</span>
        <span style="font-size:11px;font-weight:600;color:var(--text-3);">Date</span>
      </div>
      ${[['Lena Kraft','Active','$240','Jan 12'],['Marcus T.','Pending','$180','Jan 11'],['Sofia R.','Active','$320','Jan 10'],['Aryan S.','Cancelled','$0','Jan 9']].map(([n,s,a,d])=>`
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:8px 12px;border-bottom:var(--border-w) solid var(--border-sub);align-items:center;">
        <span style="font-size:12px;color:var(--text);">${n}</span>
        <span style="font-size:11px;padding:2px 7px;border-radius:20px;display:inline-block;background:${s==='Active'?'rgba(63,185,80,.15)':s==='Pending'?'rgba(210,153,34,.15)':'rgba(248,81,73,.12)'};color:${s==='Active'?'#3FB950':s==='Pending'?'#D29922':'#F85149'};">${s}</span>
        <span style="font-size:12px;font-family:var(--font-mono,monospace);color:var(--text);">${a}</span>
        <span style="font-size:11px;color:var(--text-3);">${d}</span>
      </div>`).join('')}
    </div>`);

  // ── 4. Metric cards ───────────────────────────
  register('metric-cards','Metric cards', () => `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      ${[['MRR','$48.3K','↑ 12%','#3FB950'],['Active Users','12,847','↑ 8%','#3FB950'],['Churn','2.4%','↓ 0.3%','#3FB950'],['Tickets','32','↓ 5','#3FB950']].map(([l,v,d,c])=>`
      <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:14px;">
        <div style="font-size:11px;color:var(--text-3);margin-bottom:6px;">${l}</div>
        <div style="font-size:22px;font-weight:700;font-family:var(--font-mono,monospace);color:var(--text);">${v}</div>
        <div style="font-size:11px;color:${c};margin-top:4px;">${d} vs last month</div>
      </div>`).join('')}
    </div>`);

  // ── 5. Progress / gauges ─────────────────────
  register('progress','Progress', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px;">
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:14px;">Goal completion</div>
      ${[['Revenue target','78%','#3FB950'],['User signups','55%','var(--accent)'],['Feature delivery','90%','var(--accent)'],['Support SLA','44%','#D29922']].map(([l,p,c])=>`
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2);margin-bottom:5px;"><span>${l}</span><span style="font-family:var(--font-mono,monospace);color:var(--text);">${p}</span></div>
        <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;"><div style="height:100%;width:${p};background:${c};border-radius:3px;"></div></div>
      </div>`).join('')}
    </div>`);

  // ── 6. App window ────────────────────────────
  register('app-window','App window', () =>
    WINDOW('app.yourproduct.com', `
      <div style="display:flex;gap:8px;height:140px;">
        <div style="width:100px;flex-shrink:0;display:flex;flex-direction:column;gap:4px;">
          ${['Dashboard','Analytics','Users','Settings'].map((t,i)=>`<div style="padding:6px 10px;border-radius:var(--radius-sm);font-size:12px;background:${i===0?'var(--accent-sub)':'transparent'};color:${i===0?'var(--accent)':'var(--text-2)'};">${t}</div>`).join('')}
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <div style="height:28px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);"></div>
          <div style="flex:1;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);"></div>
        </div>
      </div>`));

  // ── 7. Notification feed ─────────────────────
  register('notifications','Notifications', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="padding:10px 14px;border-bottom:var(--border-w) solid var(--border);font-size:13px;font-weight:600;color:var(--text);">Activity</div>
      ${[['🟢','New signup','Jonas Reeve just signed up for Pro','2m ago'],['💳','Payment received','$49 from Mara Quill','14m ago'],['⚠️','Alert','CPU usage above 80%','32m ago'],['✅','Deploy complete','v2.4.1 deployed to production','1h ago']].map(([ic,t,d,ts])=>`
      <div style="display:flex;gap:10px;padding:10px 14px;border-bottom:var(--border-w) solid var(--border-sub);align-items:flex-start;">
        <span style="font-size:14px;flex-shrink:0;">${ic}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:600;color:var(--text);">${t}</div>
          <div style="font-size:11px;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d}</div>
        </div>
        <span style="font-size:11px;color:var(--text-3);flex-shrink:0;">${ts}</span>
      </div>`).join('')}
    </div>`);

  // ── 8. Form / settings ───────────────────────
  register('form','Form / Settings', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px;">
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:14px;">Account settings</div>
      ${[['Full name','Jonas Reeve'],['Email','hello@driftwave.io'],['Company','Driftwave']].map(([l,v])=>`
      <div style="margin-bottom:12px;">
        <div style="font-size:11px;color:var(--text-3);margin-bottom:5px;">${l}</div>
        <div style="padding:8px 10px;background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);font-size:12px;color:var(--text-2);">${v}</div>
      </div>`).join('')}
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
        <div style="padding:7px 14px;border-radius:var(--radius-sm);border:var(--border-w) solid var(--border);font-size:12px;color:var(--text-2);">Cancel</div>
        <div style="padding:7px 14px;border-radius:var(--radius-sm);background:var(--accent);font-size:12px;color:#fff;">Save changes</div>
      </div>
    </div>`);

  // ── 9. Code snippet ───────────────────────────
  register('code','Code snippet', () =>
    WINDOW('terminal', `
      <pre style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:12px;line-height:1.8;color:var(--text-2);overflow:auto;">
<span style="color:#7EE787">// Install Umbra</span>
<span style="color:var(--accent)">npm install</span> umbra-analytics

<span style="color:#7EE787">// Add to your app</span>
<span style="color:var(--accent)">import</span> { umbra } <span style="color:var(--accent)">from</span> <span style="color:#A5D6FF">'umbra-analytics'</span>

umbra.<span style="color:#FFA657">init</span>({ siteId: <span style="color:#A5D6FF">'abc123'</span> })
umbra.<span style="color:#FFA657">track</span>(<span style="color:#A5D6FF">'signup'</span>, { plan: <span style="color:#A5D6FF">'pro'</span> })</pre>`));

  // ── 10. Terminal ─────────────────────────────
  register('terminal','Terminal / CLI', () =>
    WINDOW('bash', `
      <div style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:12px;line-height:2;color:var(--text-2);">
        <div><span style="color:#3FB950;">user@server</span>:<span style="color:var(--accent);">~/app</span>$ npm run deploy</div>
        <div style="color:var(--text-3);">  Building for production...</div>
        <div style="color:var(--text-3);">  ✓ 284 modules transformed</div>
        <div style="color:var(--text-3);">  ✓ bundle size: 98.2 kB gzip</div>
        <div style="color:#3FB950;">  ✓ Deployed to edge in 1.4s</div>
        <div><span style="color:#3FB950;">user@server</span>:<span style="color:var(--accent);">~/app</span>$ <span style="animation:blink 1s infinite">_</span></div>
      </div>`));

  // ── 11. Chat / AI ────────────────────────────
  register('chat','Chat / AI', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="padding:10px 14px;border-bottom:var(--border-w) solid var(--border);font-size:13px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:8px;">
        <span style="width:8px;height:8px;border-radius:50%;background:#3FB950;display:inline-block;"></span>
        AI Assistant
      </div>
      <div style="padding:12px;display:flex;flex-direction:column;gap:10px;max-height:180px;overflow:hidden;">
        <div style="display:flex;gap:8px;"><div style="width:26px;height:26px;border-radius:50%;background:var(--accent-sub);color:var(--accent);font-size:11px;font-weight:700;flex-shrink:0;display:flex;align-items:center;justify-content:center;">U</div><div style="background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:8px 10px;font-size:12px;color:var(--text-2);">How do I add a custom event to Umbra?</div></div>
        <div style="display:flex;gap:8px;flex-direction:row-reverse;"><div style="width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;font-size:11px;font-weight:700;flex-shrink:0;display:flex;align-items:center;justify-content:center;">AI</div><div style="background:var(--accent-sub);border:var(--border-w) solid rgba(47,129,247,.2);border-radius:var(--radius-sm);padding:8px 10px;font-size:12px;color:var(--text);">Call <code style="background:var(--bg-el);padding:1px 5px;border-radius:3px;">umbra.track('event-name', payload)</code> anywhere in your code. No setup needed.</div></div>
      </div>
      <div style="padding:8px;border-top:var(--border-w) solid var(--border);">
        <div style="background:var(--bg-el);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:8px 10px;font-size:12px;color:var(--text-3);">Type a message...</div>
      </div>
    </div>`);

  // ── 12. Kanban ───────────────────────────────
  register('kanban','Kanban', () => `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
      ${[['To do',['Auth flow','Pricing page'],'var(--border)'],['In progress',['Dashboard v2'],'#D29922'],['Done',['Landing page','SEO fixes'],'#3FB950']].map(([col,tasks,cc])=>`
      <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
        <div style="padding:8px 10px;border-bottom:var(--border-w) solid var(--border);display:flex;align-items:center;gap:6px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${cc};display:inline-block;"></span>
          <span style="font-size:11px;font-weight:600;color:var(--text-2);">${col}</span>
          <span style="margin-left:auto;font-size:10px;color:var(--text-3);">${tasks.length}</span>
        </div>
        <div style="padding:6px;">
          ${tasks.map(t=>`<div style="background:var(--bg-el);border:var(--border-w) solid var(--border-sub);border-radius:var(--radius-sm);padding:8px 10px;margin-bottom:4px;font-size:12px;color:var(--text);">${t}</div>`).join('')}
        </div>
      </div>`).join('')}
    </div>`);

  // ── 13. Calendar ─────────────────────────────
  register('calendar','Calendar', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="padding:10px 14px;border-bottom:var(--border-w) solid var(--border);display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;font-weight:600;color:var(--text);">January 2024</span>
        <div style="display:flex;gap:4px;">
          <div style="width:24px;height:24px;border-radius:4px;border:var(--border-w) solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:12px;">‹</div>
          <div style="width:24px;height:24px;border-radius:4px;border:var(--border-w) solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:12px;">›</div>
        </div>
      </div>
      <div style="padding:8px;display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">
        ${['M','T','W','T','F','S','S'].map(d=>`<div style="font-size:10px;color:var(--text-3);text-align:center;padding:4px;">${d}</div>`).join('')}
        ${Array.from({length:31},(_, i)=>{const n=i+1;const today=n===15;return`<div style="font-size:11px;text-align:center;padding:5px 2px;border-radius:4px;background:${today?'var(--accent)':'transparent'};color:${today?'#fff':n%7===0||n%7===6?'var(--text-3)':'var(--text-2)'};">${n}</div>`}).join('')}
      </div>
    </div>`);

  // ── 14. Map ───────────────────────────────────
  register('map','Map / Geo', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="height:160px;background:var(--bg-el);position:relative;overflow:hidden;">
        <svg viewBox="0 0 400 180" style="position:absolute;inset:0;width:100%;height:100%;opacity:.25;">
          <!-- Simplified world map paths -->
          <path d="M60,60 C70,55 90,50 110,52 C130,54 145,65 150,70 C155,75 148,85 140,88 C130,91 115,88 105,82 C95,76 75,80 65,72 Z" fill="var(--text-3)"/>
          <path d="M155,55 C175,48 220,50 240,58 C260,66 265,80 255,90 C245,100 220,105 200,100 C180,95 160,85 155,75 Z" fill="var(--text-3)"/>
          <path d="M200,105 C215,100 235,102 240,110 C245,118 235,128 220,130 C205,132 195,122 200,112 Z" fill="var(--text-3)"/>
          <path d="M265,60 C280,55 310,58 320,65 C330,72 325,85 315,90 C305,95 280,90 270,80 Z" fill="var(--text-3)"/>
          <path d="M290,100 C300,95 315,98 318,106 C321,114 312,122 300,120 C288,118 284,108 290,100 Z" fill="var(--text-3)"/>
          <!-- Pins -->
          <circle cx="180" cy="70" r="4" fill="var(--accent)"/>
          <circle cx="230" cy="112" r="4" fill="var(--accent)" opacity=".7"/>
          <circle cx="305" cy="75" r="4" fill="var(--accent)" opacity=".5"/>
        </svg>
        <div style="position:absolute;bottom:8px;right:8px;background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius-sm);padding:4px 8px;font-size:11px;color:var(--text-2);">3 regions</div>
      </div>
      <div style="padding:10px 12px;display:flex;gap:16px;">
        ${[['🇺🇸','North America','38%'],['🇩🇪','Europe','29%'],['🌏','Asia','18%']].map(([f,r,p])=>`<div style="font-size:11px;color:var(--text-2);">${f} ${r} <span style="font-family:var(--font-mono,monospace);color:var(--text);">${p}</span></div>`).join('')}
      </div>
    </div>`);

  // ── 15. Avatars / team ───────────────────────
  register('avatars','Avatars / Team', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);padding:16px;">
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:14px;">Active users <span style="font-family:var(--font-mono,monospace);font-size:12px;color:var(--text-3);margin-left:6px;">24 online</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${[['LK','#2F81F7'],['MT','#8957E5'],['SR','#2DA44E'],['JH','#E5534B'],['AB','#D29922'],['TP','#1B7C83'],['KM','#4F6EF5'],['RS','#6B7280']].map(([i,c])=>`
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <div style="width:40px;height:40px;border-radius:50%;background:${c}22;border:2px solid ${c};color:${c};font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;">${i}</div>
          <div style="width:8px;height:8px;border-radius:50%;background:#3FB950;border:2px solid var(--bg-card);"></div>
        </div>`).join('')}
      </div>
    </div>`);

  // ── 16. Video player ─────────────────────────
  register('video','Video player', () => `
    <div style="background:var(--bg-card);border:var(--border-w) solid var(--border);border-radius:var(--radius);overflow:hidden;">
      <div style="height:160px;background:linear-gradient(135deg,var(--bg-el),var(--bg));position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);border:2px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M7 4.5l12 6.5-12 6.5V4.5z" fill="white"/></svg>
        </div>
        <div style="position:absolute;bottom:8px;left:12px;right:12px;">
          <div style="height:3px;background:rgba(255,255,255,.2);border-radius:2px;"><div style="width:38%;height:100%;background:var(--accent);border-radius:2px;"></div></div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:10px;color:rgba(255,255,255,.5);"><span>1:24</span><span>3:45</span></div>
        </div>
      </div>
      <div style="padding:10px 12px;font-size:12px;color:var(--text-2);">Product walkthrough — 3:45 min</div>
    </div>`);

  // ── 17. None (text only) ─────────────────────
  register('none','Text only', () => ``);

  return { get, list };
})();
