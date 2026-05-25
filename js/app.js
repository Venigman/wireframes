/* =============================================
   APP.JS — Main application logic
   Screen routing, CRUD, panel, autosave
   ============================================= */

const App = (() => {

  /* ── State ─────────────────────────────────────────────────────────────── */
  let _project   = null;   // active project object (mutable)
  let _viewport  = 'desktop';
  let _pendingDeleteId = null;
  let _renameTarget    = null; // { type:'project'|'page', id }
  let _saveTimer       = null;

  /* ── DOM refs ───────────────────────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  /* ── Screens ────────────────────────────────────────────────────────────── */
  function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    const el = $(id);
    if (el) el.classList.add('active');
  }

  /* ── Autosave ───────────────────────────────────────────────────────────── */
  function scheduleSave() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      if (_project) Storage.updateProject(_project);
    }, 400);
  }

  function saveNow() {
    clearTimeout(_saveTimer);
    if (_project) Storage.updateProject(_project);
  }

  /* ── Preview render ─────────────────────────────────────────────────────── */
  function renderPreview() {
    if (!_project) return;
    const page = Renderer.getActivePage(_project);
    const html = Renderer.render(_project, page, _viewport);
    const frame = $('preview-frame');
    if (!frame) return;
    frame.srcdoc = html;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     HOME SCREEN
  ───────────────────────────────────────────────────────────────────────── */

  function renderProjectList() {
    const projects = Storage.listProjects();
    const list = $('project-list');
    const empty = $('empty-state');
    if (!list || !empty) return;

    if (projects.length === 0) {
      empty.classList.remove('hidden');
      list.innerHTML = '';
      return;
    }
    empty.classList.add('hidden');

    list.innerHTML = projects.map(p => `
      <div class="project-row" data-id="${p.id}" data-action="open" style="cursor:pointer">
        <div class="project-icon">${escHtml(p.name[0].toUpperCase())}</div>
        <div class="project-info">
          <div class="project-name">${escHtml(p.name)}</div>
          <div class="project-meta">${p.pages.length} page${p.pages.length !== 1 ? 's' : ''} · ${Storage.formatDate(p.updatedAt)}</div>
        </div>
        <button class="btn-icon project-delete-btn" data-action="delete" data-id="${p.id}" title="Delete project" style="flex-shrink:0;color:var(--text-3)">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l8 8M11 3l-8 8"/></svg>
        </button>
      </div>
    `).join('');
  }

  /* ─────────────────────────────────────────────────────────────────────────
     EDITOR — open project
  ───────────────────────────────────────────────────────────────────────── */

  function openProject(id) {
    const p = Storage.getProject(id);
    if (!p) return;
    _project = p;

    // Header
    const nameEl = $('editor-project-name');
    if (nameEl) nameEl.textContent = p.name;

    renderPageList();
    renderSectionList();
    renderSectionLibrary();
    renderDesignPanel();
    renderLayoutPresets();
    activateTab('pages');
    renderPreview();
    showScreen('screen-editor');
  }

  /* ─────────────────────────────────────────────────────────────────────────
     PAGES TAB
  ───────────────────────────────────────────────────────────────────────── */

  function renderPageList() {
    if (!_project) return;
    const list = $('page-list');
    if (!list) return;

    list.innerHTML = _project.pages.map(page => `
      <div class="page-item ${page.id === _project.activePageId ? 'active' : ''}" data-page-id="${page.id}">
        <span class="page-item-icon">${page.icon || '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="10" height="13" rx="1"/><path d="M5 5h4M5 8h2"/></svg>'}</span>
        <span class="page-item-name">${escHtml(page.label)}</span>
        <button class="page-item-del" data-page-id="${page.id}" title="Remove page" style="margin-left:auto">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 2l8 8M10 2l-8 8"/></svg>
        </button>
      </div>
    `).join('');
  }

  function renderPageTypeGrid() {
    const grid = $('page-type-grid');
    if (!grid) return;
    grid.innerHTML = Storage.PAGE_TYPES.map(t => `
      <button class="page-type-btn" data-type-id="${t.id}" title="${t.label}">
        <span class="pt-icon">${t.icon}</span>
        <span style="font-size:11px;color:var(--text-3)">${t.label}</span>
      </button>
    `).join('');
  }

  function activatePage(pageId) {
    if (!_project) return;
    _project.activePageId = pageId;
    renderPageList();
    renderSectionList();
    renderPreview();
    scheduleSave();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     SECTIONS TAB
  ───────────────────────────────────────────────────────────────────────── */

  let _selectedSecId = null;

  function renderSectionList() {
    if (!_project) return;
    const list = $('section-list');
    const hint = $('current-page-hint');
    if (!list) return;

    const page = Renderer.getActivePage(_project);
    if (!page) {
      list.innerHTML = '<p class="panel-hint">No active page.</p>';
      if (hint) hint.textContent = '— select a page';
      return;
    }

    if (hint) hint.textContent = `— ${page.label}`;

    if (page.sections.length === 0) {
      list.innerHTML = '<p class="panel-hint">No sections yet. Add from the library below.</p>';
      return;
    }

    list.innerHTML = page.sections.map((sec) => {
      const def = Sections.get(sec.sectionId);
      const varCount = def ? def.variants.length : 0;
      const varIdx = sec.variantIndex || 0;
      const isSelected = sec.id === _selectedSecId;
      return `
        <div class="section-item ${isSelected ? 'selected' : ''}"
          data-sec-id="${sec.id}"
          draggable="true"
          tabindex="0">
          <span class="section-drag-handle" aria-hidden="true">
            <svg width="10" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h4M3 7h4M3 11h4"/></svg>
          </span>
          <span class="section-name">${def ? def.icon + ' ' + def.label : sec.sectionId}</span>
          ${varCount > 1 ? `<div class="section-variant-btns">
            ${def.variants.map((v, vi) => `
              <button class="section-variant-btn ${vi === varIdx ? 'active' : ''}" data-sec-id="${sec.id}" data-vi="${vi}" title="${v.label}">${vi + 1}</button>
            `).join('')}
          </div>` : ''}
          <button class="section-del-btn" data-sec-delete="${sec.id}" title="Remove">
            <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 2l6 6M8 2l-6 6"/></svg>
          </button>
        </div>
      `;
    }).join('');

    initSectionDrag(list);
  }

  function initSectionDrag(list) {
    let dragSrcId = null;

    function clearDropIndicators() {
      list.querySelectorAll('.section-item').forEach(i => i.classList.remove('drop-before', 'drop-after'));
    }

    list.querySelectorAll('.section-item').forEach(item => {
      item.addEventListener('dragstart', e => {
        dragSrcId = item.dataset.secId;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        clearDropIndicators();
      });
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (item.dataset.secId === dragSrcId) return;
        clearDropIndicators();
        const rect = item.getBoundingClientRect();
        const isAfter = e.clientY > rect.top + rect.height / 2;
        item.classList.add(isAfter ? 'drop-after' : 'drop-before');
      });
      item.addEventListener('drop', e => {
        e.preventDefault();
        const targetId = item.dataset.secId;
        const isAfter = item.classList.contains('drop-after');
        clearDropIndicators();
        if (!dragSrcId || dragSrcId === targetId || !_project) return;
        const page = Renderer.getActivePage(_project);
        if (!page) return;
        const secs = page.sections;
        const fromIdx = secs.findIndex(s => s.id === dragSrcId);
        if (fromIdx < 0) return;
        const [moved] = secs.splice(fromIdx, 1);
        const toIdx = secs.findIndex(s => s.id === targetId);
        if (toIdx < 0) return;
        secs.splice(isAfter ? toIdx + 1 : toIdx, 0, moved);
        renderSectionList();
        renderPreview();
        scheduleSave();
      });
    });
  }

  function renderSectionLibrary() {
    const lib = $('section-library');
    if (!lib) return;

    lib.innerHTML = Sections.list().map(sec => `
      <button class="section-lib-btn" data-add-section="${sec.id}" title="${sec.label}">
        <span class="sec-lib-icon">${sec.icon}</span>
        <span class="sec-lib-label">${sec.label}</span>
      </button>
    `).join('');
  }

  function addSection(sectionId) {
    if (!_project) return;
    const page = Renderer.getActivePage(_project);
    if (!page) return;

    page.sections.push({
      id: uid(),
      sectionId,
      variantIndex: 0,
    });
    renderSectionList();
    renderPreview();
    scheduleSave();
  }

  function removeSection(secId) {
    if (!_project) return;
    const page = Renderer.getActivePage(_project);
    if (!page) return;
    page.sections = page.sections.filter(s => s.id !== secId);
    renderSectionList();
    renderPreview();
    scheduleSave();
  }

  function moveSectionUp(secId) {
    if (!_project) return;
    const page = Renderer.getActivePage(_project);
    if (!page) return;
    const idx = page.sections.findIndex(s => s.id === secId);
    if (idx <= 0) return;
    [page.sections[idx-1], page.sections[idx]] = [page.sections[idx], page.sections[idx-1]];
    renderSectionList();
    renderPreview();
    scheduleSave();
  }

  function moveSectionDown(secId) {
    if (!_project) return;
    const page = Renderer.getActivePage(_project);
    if (!page) return;
    const idx = page.sections.findIndex(s => s.id === secId);
    if (idx < 0 || idx >= page.sections.length - 1) return;
    [page.sections[idx], page.sections[idx+1]] = [page.sections[idx+1], page.sections[idx]];
    renderSectionList();
    renderPreview();
    scheduleSave();
  }

  function setSectionVariant(secId, variantIndex) {
    if (!_project) return;
    const page = Renderer.getActivePage(_project);
    if (!page) return;
    const sec = page.sections.find(s => s.id === secId);
    if (!sec) return;
    sec.variantIndex = variantIndex;
    renderSectionList();
    renderPreview();
    scheduleSave();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     DESIGN TAB
  ───────────────────────────────────────────────────────────────────────── */

  function renderDesignPanel() {
    const inner = $('design-panel-inner');
    if (!inner || !_project) return;
    const t = _project.tokens;
    const isDark = t.theme === 'dark';

    function DG(label, content) {
      return `<div class="design-group"><span class="design-group-label">${label}</span>${content}</div>`;
    }
    function sliderHtml(token, min, max, step, val, display) {
      return `<div class="slider-row">
        <div class="slider-row-label"><span>${display}</span><span id="val-${token}">${display}</span></div>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-token="${token}">
      </div>`;
    }

    inner.innerHTML =
      DG('Primary color', `
        <div class="color-presets">
          ${Color.PRESETS.map(p => `
            <button class="color-preset ${t.colors.primary === p.hex ? 'active' : ''}"
              style="background:${p.hex}" data-color="${p.hex}" title="${p.name}"></button>
          `).join('')}
          <label class="color-preset" style="background:var(--bg-el);display:flex;align-items:center;justify-content:center;cursor:pointer" title="Custom color">
            <input type="color" id="custom-color-input" value="${t.colors.primary}" style="width:0;height:0;opacity:0;position:absolute">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 7h10M6 2l5 5-5 5"/></svg>
          </label>
        </div>
        <div class="color-scale" id="color-scale-preview">${Color.renderScaleSwatches(t.colors.primary, isDark)}</div>
      `) +
      DG('Theme', `
        <div class="option-row" style="grid-template-columns:1fr 1fr">
          <button class="option-btn ${!isDark ? 'active' : ''}" data-token="theme" data-val="light">Light</button>
          <button class="option-btn ${isDark ? 'active' : ''}" data-token="theme" data-val="dark">Dark</button>
        </div>
      `) +
      DG('Font pair', `
        <div class="font-pair-list">
          ${Object.entries(Renderer.FONT_PAIRS).map(([id, pair]) => `
            <button class="font-pair-btn ${t.fontPair === id ? 'active' : ''}" data-token="fontPair" data-val="${id}">
              ${pair.label}
            </button>
          `).join('')}
        </div>
      `) +
      DG('Border radius', sliderHtml('radius', 0, 24, 1, t.radius, t.radius + 'px')) +
      DG('Spacing scale', sliderHtml('spacing', 0.5, 2, 0.1, t.spacing, t.spacing + '×')) +
      DG('Border width', sliderHtml('borderWidth', 0, 3, 0.5, t.borderWidth, t.borderWidth + 'px')) +
      DG('Shadow level', sliderHtml('shadowLevel', 0, 3, 1, t.shadowLevel, t.shadowLevel)) +
      DG('Body scale', sliderHtml('bodyScale', 0.8, 1.4, 0.05, t.bodyScale ?? 1, (t.bodyScale ?? 1) + '×')) +
      DG('Heading scale', sliderHtml('headingScale', 0.8, 1.4, 0.05, t.headingScale ?? 1, (t.headingScale ?? 1) + '×')) +
      DG('Container width', `
        <div class="option-row">
          ${[['narrow','760px'],['medium','1080px'],['wide','1280px']].map(([val, label]) => `
            <button class="option-btn ${t.containerWidth === val ? 'active' : ''}" data-token="containerWidth" data-val="${val}">${label}</button>
          `).join('')}
        </div>
      `) +
      DG('Button style', `
        <div class="option-row">
          ${[['fill','Fill'],['outline','Outline'],['soft','Soft']].map(([val, label]) => `
            <button class="option-btn ${t.buttonStyle === val ? 'active' : ''}" data-token="buttonStyle" data-val="${val}">${label}</button>
          `).join('')}
        </div>
      `) +
      DG('Card style', `
        <div class="option-row">
          ${[['border','Border'],['shadow','Shadow'],['flat','Flat']].map(([val, label]) => `
            <button class="option-btn ${t.cardStyle === val ? 'active' : ''}" data-token="cardStyle" data-val="${val}">${label}</button>
          `).join('')}
        </div>
      `) +
      DG('Effects', `
        <div class="toggle-row">
          <label style="font-size:12px;color:var(--text-2)">Glass effect</label>
          <button class="toggle ${t.glassEffect ? 'on' : ''}" id="toggle-glass" type="button"></button>
        </div>
      `) +
      DG('Button size', sliderHtml('buttonScale', 0.8, 1.4, 0.05, t.buttonScale ?? 1, (t.buttonScale ?? 1) + '×')) +
      DG('Contrast boost', sliderHtml('contrast', 1, 3, 0.5, t.contrast || 1, t.contrast || 1))
    ;

    // Bind slider live preview labels
    inner.querySelectorAll('input[type=range][data-token]').forEach(sl => {
      sl.addEventListener('input', onSliderInput);
    });

    // Bind option buttons
    inner.querySelectorAll('.option-btn[data-token]').forEach(btn => {
      btn.addEventListener('click', onOptionBtn);
    });

    // Bind font pair buttons
    inner.querySelectorAll('.font-pair-btn[data-token]').forEach(btn => {
      btn.addEventListener('click', onOptionBtn);
    });

    // Bind color presets
    inner.querySelectorAll('.color-preset[data-color]').forEach(btn => {
      btn.addEventListener('click', () => setColor(btn.dataset.color));
    });

    // Bind custom color
    const customInput = $('custom-color-input');
    if (customInput) {
      customInput.addEventListener('input', e => setColor(e.target.value));
    }

    // Bind glass toggle (button with .on class)
    const glassToggle = $('toggle-glass');
    if (glassToggle) {
      glassToggle.addEventListener('click', () => {
        _project.tokens.glassEffect = !_project.tokens.glassEffect;
        glassToggle.classList.toggle('on', _project.tokens.glassEffect);
        renderPreview();
        scheduleSave();
      });
    }
  }

  function setColor(hex) {
    if (!_project) return;
    _project.tokens.colors.primary = hex;
    const isDark = _project.tokens.theme === 'dark';
    const scaleEl = $('color-scale-preview');
    if (scaleEl) scaleEl.innerHTML = Color.renderScaleSwatches(hex, isDark);
    // Highlight active preset
    $$('.color-preset[data-color]').forEach(b => b.classList.toggle('active', b.dataset.color === hex));
    renderPreview();
    scheduleSave();
  }

  function onSliderInput(e) {
    if (!_project) return;
    const token = e.target.dataset.token;
    const val = parseFloat(e.target.value);
    _project.tokens[token] = val;
    let display = String(val);
    if (token === 'radius' || token === 'borderWidth') display = val + 'px';
    else if (token === 'spacing' || token === 'typographyScale' || token === 'bodyScale' || token === 'headingScale' || token === 'buttonScale') display = val + '×';
    const labelRow = e.target.closest('.slider-row')?.querySelector('.slider-row-label');
    if (labelRow) {
      const spans = labelRow.querySelectorAll('span');
      if (spans[1]) spans[1].textContent = display;
    }
    renderPreview();
    scheduleSave();
  }

  function onOptionBtn(e) {
    if (!_project) return;
    const btn = e.currentTarget;
    const token = btn.dataset.token;
    const val = btn.dataset.val;
    _project.tokens[token] = val;
    // Deactivate siblings
    btn.closest('.option-row, .font-pair-list').querySelectorAll(`[data-token="${token}"]`)
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // If theme changed, re-render design panel to update scale swatches
    if (token === 'theme') {
      renderDesignPanel();
    }
    renderPreview();
    scheduleSave();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     LAYOUT TAB
  ───────────────────────────────────────────────────────────────────────── */

  function renderLayoutPresets() {
    const container = $('layout-presets');
    if (!container || !_project) return;
    const current = _project.tokens.layoutPreset || 'standard';

    const presets = [
      { id:'standard',  label:'Standard',  desc:'Balanced spacing, neutral composition' },
      { id:'compact',   label:'Compact',   desc:'Tighter sections, denser information' },
      { id:'spacious',  label:'Spacious',  desc:'Generous whitespace, editorial feel' },
      { id:'editorial', label:'Editorial', desc:'Refined type, long-form reading layout' },
    ];

    container.innerHTML = presets.map(p => `
      <button class="layout-preset-btn ${p.id === current ? 'active' : ''}" data-preset="${p.id}">
        <strong>${p.label}</strong>
        <span>${p.desc}</span>
      </button>
    `).join('');

    container.querySelectorAll('.layout-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _project.tokens.layoutPreset = btn.dataset.preset;
        container.querySelectorAll('.layout-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPreview();
        scheduleSave();
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     PANEL TABS
  ───────────────────────────────────────────────────────────────────────── */

  function activateTab(tabId) {
    $$('.panel-tab').forEach(t => t.classList.remove('active'));
    $$('.panel-content').forEach(t => t.classList.remove('active'));
    const tabBtn = document.querySelector(`.panel-tab[data-tab="${tabId}"]`);
    const tabContent = $(`tab-${tabId}`);
    if (tabBtn) tabBtn.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
  }

  /* ─────────────────────────────────────────────────────────────────────────
     DIALOGS
  ───────────────────────────────────────────────────────────────────────── */

  function openRenameDialog(type, id, currentName) {
    _renameTarget = { type, id };
    const input = $('rename-input');
    if (input) { input.value = currentName; }
    $('dialog-rename').classList.remove('hidden');
    if (input) input.select();
  }

  function closeRenameDialog() {
    $('dialog-rename').classList.add('hidden');
    _renameTarget = null;
  }

  function confirmRename() {
    if (!_renameTarget) return;
    const name = $('rename-input').value.trim() || 'Untitled';
    if (_renameTarget.type === 'project') {
      Storage.renameProject(_renameTarget.id, name);
      if (_project && _project.id === _renameTarget.id) {
        _project.name = name;
        const el = $('editor-project-name');
        if (el) el.textContent = name;
      }
      renderProjectList();
    }
    closeRenameDialog();
  }

  function openDeleteDialog(id, name) {
    _pendingDeleteId = id;
    const msg = $('dialog-delete-msg');
    if (msg) msg.textContent = `"${name}" will be permanently deleted.`;
    $('dialog-delete').classList.remove('hidden');
  }

  function closeDeleteDialog() {
    $('dialog-delete').classList.add('hidden');
    _pendingDeleteId = null;
  }

  function confirmDelete() {
    if (!_pendingDeleteId) return;
    Storage.deleteProject(_pendingDeleteId);
    renderProjectList();
    closeDeleteDialog();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────────────────────────────── */

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Generate a unique ID for new sections (reuse storage uid pattern)
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  /* ─────────────────────────────────────────────────────────────────────────
     MOBILE BOTTOM SHEET
  ───────────────────────────────────────────────────────────────────────── */

  function togglePanel(forceClose = false) {
    const panel   = $('editor-panel');
    const overlay = $('panel-overlay');
    const fab     = $('fab-panel');
    if (!panel) return;
    const isOpen = forceClose ? false : !panel.classList.contains('open');
    panel.classList.toggle('open', isOpen);
    if (overlay) overlay.classList.toggle('visible', isOpen);
    if (fab) fab.classList.toggle('panel-open', isOpen);
  }

  function initBottomSheetDrag() {
    const handle = $('panel-handle');
    const panel  = $('editor-panel');
    if (!handle || !panel) return;

    let startY = 0;
    let startH = 0;
    let dragging = false;

    handle.addEventListener('pointerdown', e => {
      dragging = true;
      startY = e.clientY;
      startH = panel.getBoundingClientRect().height;
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dy = startY - e.clientY;
      const newH = Math.max(80, Math.min(window.innerHeight * 0.92, startH + dy));
      panel.style.height = newH + 'px';
    });

    handle.addEventListener('pointerup', () => { dragging = false; });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     EVENT BINDINGS
  ───────────────────────────────────────────────────────────────────────── */

  function init() {
    // ── Home screen ────────────────────────────────────────────────────────
    const btnNew = $('btn-new-project');
    const btnNewEmpty = $('btn-new-project-empty');
    if (btnNew) btnNew.addEventListener('click', () => showScreen('screen-create'));
    if (btnNewEmpty) btnNewEmpty.addEventListener('click', () => showScreen('screen-create'));

    // ── Import ─────────────────────────────────────────────────────────────
    const btnImport = $('btn-import-project');
    const dialogImport = $('dialog-import');
    const importInput = $('import-json-input');
    const importError = $('import-error');

    function openImportDialog() {
      if (!dialogImport) return;
      if (importInput) importInput.value = '';
      if (importError) { importError.style.display = 'none'; importError.textContent = ''; }
      dialogImport.classList.remove('hidden');
      setTimeout(() => importInput && importInput.focus(), 50);
    }
    function closeImportDialog() {
      dialogImport && dialogImport.classList.add('hidden');
    }

    if (btnImport) btnImport.addEventListener('click', openImportDialog);
    $('btn-import-cancel') && $('btn-import-cancel').addEventListener('click', closeImportDialog);
    dialogImport && dialogImport.addEventListener('click', e => { if (e.target === dialogImport) closeImportDialog(); });

    $('btn-import-confirm') && $('btn-import-confirm').addEventListener('click', () => {
      const raw = importInput ? importInput.value.trim() : '';
      if (!raw) { if (importError) { importError.textContent = 'Paste a JSON structure first.'; importError.style.display = 'block'; } return; }
      try {
        const data = JSON.parse(raw);
        const project = Storage.importProject(data);
        closeImportDialog();
        openProject(project.id);
      } catch(err) {
        if (importError) { importError.textContent = 'Invalid JSON: ' + err.message; importError.style.display = 'block'; }
      }
    });

    // ── Create screen ──────────────────────────────────────────────────────
    const btnBackCreate = $('btn-back-from-create');
    const btnCancel = $('btn-cancel-create');
    const btnConfirm = $('btn-confirm-create');
    const nameInput = $('project-name-input');

    if (btnBackCreate) btnBackCreate.addEventListener('click', () => showScreen('screen-home'));
    if (btnCancel) btnCancel.addEventListener('click', () => showScreen('screen-home'));
    if (btnConfirm) btnConfirm.addEventListener('click', () => {
      const name = nameInput ? nameInput.value.trim() : '';
      const project = Storage.createProject(name || 'Untitled');
      if (nameInput) nameInput.value = '';
      openProject(project.id);
    });
    if (nameInput) {
      nameInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') btnConfirm && btnConfirm.click();
        if (e.key === 'Escape') showScreen('screen-home');
      });
    }

    // ── Project list (delegated) ───────────────────────────────────────────
    const projectList = $('project-list');
    if (projectList) {
      projectList.addEventListener('click', e => {
        const delBtn = e.target.closest('.project-delete-btn');
        if (delBtn) {
          e.stopPropagation();
          const id = delBtn.dataset.id;
          const proj = Storage.listProjects().find(p => p.id === id);
          if (proj) openDeleteDialog(id, proj.name);
          return;
        }
        const row = e.target.closest('.project-row[data-id]');
        if (row) openProject(row.dataset.id);
      });
    }

    // ── Editor header ──────────────────────────────────────────────────────
    const btnBack = $('btn-back-from-editor');
    if (btnBack) btnBack.addEventListener('click', () => {
      saveNow();
      renderProjectList();
      showScreen('screen-home');
    });

    // Viewport switcher
    $$('.vp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.vp-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _viewport = btn.dataset.vp;
        const wrapper = $('preview-wrapper');
        if (wrapper) {
          const w = Renderer.VP_WIDTHS[_viewport];
          wrapper.style.maxWidth = w ? w + 'px' : '';
        }
        renderPreview();
      });
    });

    // Theme toggle (preview only)
    const btnTheme = $('btn-toggle-preview-theme');
    if (btnTheme) btnTheme.addEventListener('click', () => {
      if (!_project) return;
      _project.tokens.theme = _project.tokens.theme === 'dark' ? 'light' : 'dark';
      renderDesignPanel();
      renderPreview();
      scheduleSave();
    });

    // Panel toggle (desktop collapse / mobile open)
    const btnPanel = $('btn-panel-toggle');
    if (btnPanel) btnPanel.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        togglePanel();
      } else {
        const panel = $('editor-panel');
        panel.classList.toggle('collapsed');
        const previewArea = document.querySelector('.preview-area');
        if (previewArea) previewArea.classList.toggle('panel-collapsed');
      }
    });

    // FAB (mobile only)
    const fabPanel = $('fab-panel');
    if (fabPanel) fabPanel.addEventListener('click', () => togglePanel());

    // Overlay click closes panel
    const overlay = $('panel-overlay');
    if (overlay) overlay.addEventListener('click', () => togglePanel(true));

    // ── Panel tabs ─────────────────────────────────────────────────────────
    $$('.panel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activateTab(tab.dataset.tab);
      });
    });

    // ── Pages tab ──────────────────────────────────────────────────────────
    const btnAddPage = $('btn-add-page');
    const addPagePanel = $('add-page-panel');
    if (btnAddPage) {
      btnAddPage.addEventListener('click', () => {
        addPagePanel.classList.toggle('hidden');
        if (!addPagePanel.classList.contains('hidden')) renderPageTypeGrid();
      });
    }

    // Page list (delegated)
    const pageList = $('page-list');
    if (pageList) {
      pageList.addEventListener('click', e => {
        const pageItem = e.target.closest('.page-item[data-page-id]');
        const delBtn = e.target.closest('.page-item-del');
        if (delBtn) {
          const pid = delBtn.dataset.pageId;
          if (!_project) return;
          if (_project.pages.length <= 1) return; // don't delete last
          _project.pages = _project.pages.filter(p => p.id !== pid);
          if (_project.activePageId === pid) {
            _project.activePageId = _project.pages[0]?.id || null;
          }
          renderPageList();
          renderSectionList();
          renderPreview();
          scheduleSave();
          return;
        }
        if (pageItem && !delBtn) {
          activatePage(pageItem.dataset.pageId);
          activateTab('sections');
        }
      });
    }

    // Page type grid (delegated)
    const pageTypeGrid = $('page-type-grid');
    if (pageTypeGrid) {
      pageTypeGrid.addEventListener('click', e => {
        const btn = e.target.closest('.page-type-btn');
        if (!btn || !_project) return;
        const page = Storage.createPage(btn.dataset.typeId);
        _project.pages.push(page);
        _project.activePageId = page.id;
        addPagePanel.classList.add('hidden');
        renderPageList();
        renderSectionList();
        renderPreview();
        scheduleSave();
        activateTab('sections');
      });
    }

    // ── Sections tab ───────────────────────────────────────────────────────
    const secList = $('section-list');
    if (secList) {
      secList.addEventListener('click', e => {
        const delBtn  = e.target.closest('[data-sec-delete]');
        const varBtn  = e.target.closest('.section-variant-btn');
        const secItem = e.target.closest('.section-item');
        if (delBtn) { removeSection(delBtn.dataset.secDelete); _selectedSecId = null; return; }
        if (varBtn) { setSectionVariant(varBtn.dataset.secId, parseInt(varBtn.dataset.vi)); return; }
        if (secItem) {
          _selectedSecId = secItem.dataset.secId === _selectedSecId ? null : secItem.dataset.secId;
          secList.querySelectorAll('.section-item').forEach(el =>
            el.classList.toggle('selected', el.dataset.secId === _selectedSecId)
          );
        }
      });
    }

    // Keyboard reorder: arrow keys move selected section
    document.addEventListener('keydown', e => {
      if (!_selectedSecId || !_project) return;
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      if (e.key === 'ArrowUp')   moveSectionUp(_selectedSecId);
      if (e.key === 'ArrowDown') moveSectionDown(_selectedSecId);
      // Re-focus selected item after re-render
      const el = document.querySelector(`.section-item[data-sec-id="${_selectedSecId}"]`);
      if (el) el.focus();
    });

    const secLib = $('section-library');
    if (secLib) {
      secLib.addEventListener('click', e => {
        const btn = e.target.closest('[data-add-section]');
        if (btn) addSection(btn.dataset.addSection);
      });
    }

    // ── Dialogs ────────────────────────────────────────────────────────────
    $('btn-rename-cancel') && $('btn-rename-cancel').addEventListener('click', closeRenameDialog);
    $('btn-rename-confirm') && $('btn-rename-confirm').addEventListener('click', confirmRename);
    $('btn-delete-cancel') && $('btn-delete-cancel').addEventListener('click', closeDeleteDialog);
    $('btn-delete-confirm') && $('btn-delete-confirm').addEventListener('click', confirmDelete);

    const renameInput = $('rename-input');
    if (renameInput) {
      renameInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') confirmRename();
        if (e.key === 'Escape') closeRenameDialog();
      });
    }

    // Close dialogs on backdrop click
    $('dialog-rename') && $('dialog-rename').addEventListener('click', e => {
      if (e.target === $('dialog-rename')) closeRenameDialog();
    });
    $('dialog-delete') && $('dialog-delete').addEventListener('click', e => {
      if (e.target === $('dialog-delete')) closeDeleteDialog();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeRenameDialog();
        closeDeleteDialog();
      }
    });

    // ── Bottom sheet drag ──────────────────────────────────────────────────
    initBottomSheetDrag();

    // ── Init home screen ───────────────────────────────────────────────────
    renderProjectList();
    showScreen('screen-home');
  }

  // Bootstrap on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {};
})();
