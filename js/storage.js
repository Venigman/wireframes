/* =============================================
   STORAGE.JS — localStorage CRUD
   ============================================= */

const Storage = (() => {
  const KEY = 'venigman_wireframes_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  function save(projects) {
    localStorage.setItem(KEY, JSON.stringify(projects));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  // Default design tokens for new projects
  function defaultTokens() {
    return {
      colors: { primary: '#2F81F7' },
      theme: 'dark',
      radius: 8,
      spacing: 1,
      borderWidth: 1,
      shadowLevel: 1,
      fontPair: 'pair-1',
      typographyScale: 1,
      bodyScale: 1,
      headingScale: 1,
      buttonScale: 1,
      containerWidth: 'medium',
      buttonStyle: 'fill',
      cardStyle: 'border',
      glassEffect: false,
      contrast: 1,
      layoutPreset: 'standard',
      designPreset: null,
    };
  }

  // Design system presets
  const DESIGN_PRESETS = [
    { id:'linear',    label:'Linear',    accent:'#5e6ad2', tokens:{ theme:'dark',  colors:{primary:'#5e6ad2'}, fontPair:'pair-3', radius:8,  borderWidth:1,   shadowLevel:1, layoutPreset:'standard',  buttonStyle:'fill',    cardStyle:'border', glassEffect:false } },
    { id:'stripe',    label:'Stripe',    accent:'#533afd', tokens:{ theme:'light', colors:{primary:'#533afd'}, fontPair:'pair-2', radius:4,  borderWidth:1,   shadowLevel:2, layoutPreset:'standard',  buttonStyle:'fill',    cardStyle:'shadow', glassEffect:false } },
    { id:'vercel',    label:'Vercel',    accent:'#0070f3', tokens:{ theme:'dark',  colors:{primary:'#0070f3'}, fontPair:'pair-3', radius:6,  borderWidth:1,   shadowLevel:1, layoutPreset:'standard',  buttonStyle:'fill',    cardStyle:'border', glassEffect:false } },
    { id:'framer',    label:'Framer',    accent:'#0099ff', tokens:{ theme:'dark',  colors:{primary:'#0099ff'}, fontPair:'pair-1', radius:12, borderWidth:1,   shadowLevel:2, layoutPreset:'standard',  buttonStyle:'fill',    cardStyle:'shadow', glassEffect:false } },
    { id:'notion',    label:'Notion',    accent:'#0075de', tokens:{ theme:'light', colors:{primary:'#0075de'}, fontPair:'pair-3', radius:4,  borderWidth:1,   shadowLevel:0, layoutPreset:'editorial', buttonStyle:'fill',    cardStyle:'flat',   glassEffect:false } },
    { id:'supabase',  label:'Supabase',  accent:'#3ecf8e', tokens:{ theme:'dark',  colors:{primary:'#3ecf8e'}, fontPair:'pair-4', radius:8,  borderWidth:1,   shadowLevel:2, layoutPreset:'standard',  buttonStyle:'fill',    cardStyle:'border', glassEffect:false } },
    { id:'github',    label:'GitHub',    accent:'#2F81F7', tokens:{ theme:'dark',  colors:{primary:'#2F81F7'}, fontPair:'pair-6', radius:6,  borderWidth:1,   shadowLevel:1, layoutPreset:'standard',  buttonStyle:'fill',    cardStyle:'border', glassEffect:false } },
    { id:'editorial', label:'Editorial', accent:'#8957E5', tokens:{ theme:'light', colors:{primary:'#8957E5'}, fontPair:'pair-5', radius:2,  borderWidth:1,   shadowLevel:0, layoutPreset:'editorial', buttonStyle:'outline', cardStyle:'border', glassEffect:false } },
    { id:'clay',      label:'Clay',      accent:'#f472b6', tokens:{ theme:'light', colors:{primary:'#f472b6'}, fontPair:'pair-4', radius:20, borderWidth:0,   shadowLevel:3, layoutPreset:'spacious',  buttonStyle:'soft',    cardStyle:'shadow', glassEffect:false } },
    { id:'brutal',    label:'Brutal',    accent:'#E5534B', tokens:{ theme:'light', colors:{primary:'#1a1a1a'}, fontPair:'pair-6', radius:0,  borderWidth:2,   shadowLevel:0, layoutPreset:'standard',  buttonStyle:'outline', cardStyle:'border', glassEffect:false } },
  ];

  // Page types catalogue
  const PAGE_TYPES = [
    { id:'landing',         label:'Landing',          icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 7l6-5 6 5"/><path d="M3 7v5h3v-3h2v3h3V7"/></svg>', defaultSections:['navbar','hero','logos','features-grid','testimonials','pricing','faq','cta-banner','footer'] },
    { id:'pricing',         label:'Pricing',          icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="10" height="9" rx="1"/><path d="M5 3V2M9 3V2M5 7h4M5 10h2"/></svg>', defaultSections:['navbar','hero','pricing','comparison-table','faq','cta-banner','footer'] },
    { id:'about',           label:'About',            icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="5" r="2.5"/><path d="M2 13c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>', defaultSections:['navbar','hero','stats','team','footer'] },
    { id:'contact',         label:'Contact',          icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="12" height="9" rx="1"/><path d="M1 5l6 4 6-4"/></svg>', defaultSections:['navbar','contact','footer'] },
    { id:'auth',            label:'Auth',             icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="8" height="7" rx="1"/><path d="M5 6V4a2 2 0 0 1 4 0v2"/></svg>', defaultSections:['auth'] },
    { id:'404',             label:'404',              icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.5"/><path d="M7 4v4M7 10v.5"/></svg>', defaultSections:['navbar','error-page','footer'] },
    { id:'blog',            label:'Blog',             icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="10" height="13" rx="1"/><path d="M5 5h4M5 8h4M5 11h2"/></svg>', defaultSections:['navbar','hero','blog-teaser','newsletter','footer'] },
    { id:'blog-post',       label:'Blog Post',        icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="10" height="13" rx="1"/><path d="M5 5h4M5 8h3"/></svg>', defaultSections:['navbar','article-body','footer'] },
    { id:'changelog',       label:'Changelog',        icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="10" height="13" rx="1"/><path d="M5 4h4M5 7h4M5 10h4"/></svg>', defaultSections:['navbar','hero','changelog-list','cta-banner','footer'] },
    { id:'changelog-entry', label:'Changelog Entry',  icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 1v5L7 4 4 6V1"/><rect x="2" y="1" width="10" height="13" rx="1"/></svg>', defaultSections:['navbar','article-body','changelog-list','footer'] },
    { id:'privacy',         label:'Privacy Policy',   icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 1L2 3v4c0 3.3 2.2 6 5 7 2.8-1 5-3.7 5-7V3L7 1z"/></svg>', defaultSections:['navbar','legal-body','footer'] },
    { id:'terms',           label:'Terms of Service', icon:'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="10" height="13" rx="1"/><path d="M5 5h4M5 8h4M5 11h2"/></svg>', defaultSections:['navbar','legal-body','footer'] },
  ];

  // Create a page instance
  function createPage(typeId) {
    const type = PAGE_TYPES.find(t=>t.id===typeId) || PAGE_TYPES[0];
    return {
      id: uid(),
      typeId,
      label: type.label,
      icon: type.icon,
      sections: type.defaultSections.map(sId => ({
        id: uid(),
        sectionId: sId,
        variantIndex: 0,
        visualType: 'dashboard',
      })),
    };
  }

  // Create new project
  function createProject(name) {
    const projects = load();
    const project = {
      id: uid(),
      name: name.trim() || 'Untitled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [createPage('landing')],
      tokens: defaultTokens(),
      activePageId: null,
    };
    project.activePageId = project.pages[0].id;
    projects.unshift(project);
    save(projects);
    return project;
  }

  function getProject(id) {
    return load().find(p=>p.id===id) || null;
  }

  function updateProject(project) {
    const projects = load();
    const idx = projects.findIndex(p=>p.id===project.id);
    project.updatedAt = new Date().toISOString();
    if (idx>=0) projects[idx] = project;
    else projects.unshift(project);
    save(projects);
  }

  function deleteProject(id) {
    save(load().filter(p=>p.id!==id));
  }

  function renameProject(id, name) {
    const projects = load();
    const p = projects.find(p=>p.id===id);
    if (p) { p.name = name.trim() || 'Untitled'; p.updatedAt = new Date().toISOString(); }
    save(projects);
  }

  function listProjects() { return load(); }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }

  // Import a project from a plain JSON structure:
  // { name, tokens?, pages: [{ type, label?, sections? }] }
  // If sections omitted → use page type defaultSections
  function importProject(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid JSON');
    const name = (data.name || 'Imported Project').toString().trim().slice(0, 60);

    const pages = (Array.isArray(data.pages) ? data.pages : []).map(p => {
      const typeId = p.type || 'landing';
      const type = PAGE_TYPES.find(t => t.id === typeId) || PAGE_TYPES[0];
      const sectionIds = Array.isArray(p.sections) ? p.sections : type.defaultSections;
      return {
        id: uid(),
        typeId: type.id,
        label: (p.label || type.label).toString().slice(0, 40),
        icon: type.icon,
        sections: sectionIds.map(sId => ({
          id: uid(),
          sectionId: sId,
          variantIndex: 0,
          visualType: 'dashboard',
        })),
      };
    });

    if (pages.length === 0) pages.push(createPage('landing'));

    const tokens = Object.assign(defaultTokens(), data.tokens || {});
    if (data.tokens?.colors) tokens.colors = Object.assign(defaultTokens().colors, data.tokens.colors);

    const project = {
      id: uid(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages,
      tokens,
      activePageId: pages[0].id,
    };

    const projects = load();
    projects.unshift(project);
    save(projects);
    return project;
  }

  return { createProject, importProject, getProject, updateProject, deleteProject, renameProject, listProjects, createPage, PAGE_TYPES, defaultTokens, DESIGN_PRESETS, formatDate };
})();
