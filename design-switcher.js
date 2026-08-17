(function () {
  const designs = [
    { id: 'professional', label: '01 Professional', desc: 'Current portfolio design' },
    { id: 'premium', label: '02 Premium Creative', desc: 'Luxury, depth and motion' },
    { id: 'executive', label: '03 Executive / Corporate', desc: 'Senior business presentation' }
  ];
  const storageKey = 'amjid-portfolio-design';
  const body = document.body;
  const existingToggle = document.getElementById('themeToggle');

  const polishLink = document.createElement('link');
  polishLink.rel = 'stylesheet';
  polishLink.href = 'designs-polish.css?v=profile-fix-3';
  document.head.appendChild(polishLink);

  function refreshProfessionalWording() {
    const replacements = new Map([
      ['Sales Leader | Web Learner', 'Sales Professional | Web Learner'],
      ['FMCG sales leadership profile', 'FMCG sales professional profile'],
      ['FMCG sales manager with 15+ years of experience', 'FMCG sales professional with 15+ years of experience'],
      ['field force leadership', 'sales team management'],
      ['Business leadership with a technology mindset.', 'Sales expertise with a technology mindset.'],
      ['team leadership, and analytics', 'team management, and analytics'],
      ['Sales leadership across North.', 'Sales experience across North.'],
      ['regional leadership,', 'regional sales experience,'],
      ['FMCG Sales Leadership', 'FMCG Sales Expertise']
    ]);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue;
      replacements.forEach((replacement, source) => {
        value = value.split(source).join(replacement);
      });
      node.nodeValue = value;
    });

    document.querySelectorAll('meta[name="description"]').forEach((meta) => {
      meta.setAttribute('content', 'Muhammad Amjid portfolio, FMCG sales professional profile, digital transformation projects, learning journey, and contact information.');
    });
  }

  function fixSmartSalesLink() {
    const smartSalesUrl = 'http://108.181.168.213:1021/';
    document.querySelectorAll('.project-card, .projects-table').forEach((scope) => {
      scope.querySelectorAll('h3, td').forEach((element) => {
        const text = (element.textContent || '').trim().toLowerCase();
        if (text === 'salespulse') {
          const link = document.createElement('a');
          link.href = smartSalesUrl;
          link.textContent = 'Smart Sales';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.title = 'Open Smart Sales';
          element.textContent = '';
          element.appendChild(link);
        }
      });
    });

    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = (anchor.getAttribute('href') || '').toLowerCase();
      const text = (anchor.textContent || '').trim().toLowerCase();
      if (href.includes('salespulse') || text === 'salespulse') {
        anchor.href = smartSalesUrl;
        anchor.textContent = 'Smart Sales';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.title = 'Open Smart Sales';
      }
    });
  }

  function fixProfilePhotoFrame() {
    const style = document.createElement('style');
    style.id = 'amjid-profile-frame-final-fix';
    style.textContent = `
      .profile-photo-wrap.is-framed {
        width: min(100%, 240px) !important;
        max-width: 240px !important;
        aspect-ratio: 3 / 5 !important;
        height: auto !important;
        margin-inline: auto !important;
        padding: 5px !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: flex-start !important;
        justify-content: center !important;
        box-sizing: border-box !important;
      }
      .profile-photo-wrap.is-framed img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        aspect-ratio: 3 / 5 !important;
        object-fit: contain !important;
        object-position: center top !important;
        margin: 0 auto !important;
        border-radius: 4px !important;
      }
      @media (max-width: 720px) {
        .profile-photo-wrap.is-framed {
          width: min(100%, 220px) !important;
          max-width: 220px !important;
          padding: 5px !important;
        }
      }
      @media (max-width: 430px) {
        .profile-photo-wrap.is-framed {
          width: min(100%, 200px) !important;
          max-width: 200px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getSaved() {
    const saved = localStorage.getItem(storageKey);
    return designs.some((item) => item.id === saved) ? saved : 'professional';
  }

  function applyDesign(id) {
    if (!designs.some((item) => item.id === id)) id = 'professional';
    body.dataset.design = id;
    body.dataset.theme = id === 'executive' ? 'light' : 'dark';
    localStorage.setItem(storageKey, id);
    updateUI();
  }

  const root = document.createElement('div');
  root.className = 'design-switcher';
  root.innerHTML = `
    <div class="design-switcher__panel" hidden>
      <p class="design-switcher__title">Choose portfolio design</p>
      <div class="design-switcher__options"></div>
    </div>
    <button class="design-switcher__toggle" type="button" aria-expanded="false" aria-controls="designSwitcherPanel">
      <span>Design</span>
    </button>
  `;
  const panel = root.querySelector('.design-switcher__panel');
  panel.id = 'designSwitcherPanel';
  const options = root.querySelector('.design-switcher__options');
  const toggle = root.querySelector('.design-switcher__toggle');

  designs.forEach((design) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'design-option';
    button.dataset.designChoice = design.id;
    button.innerHTML = `
      <span class="design-option__swatch design-option__swatch--${design.id}" aria-hidden="true"></span>
      <span><strong>${design.label}</strong><small>${design.desc}</small></span>
      <span class="design-option__check" aria-hidden="true">✓</span>
    `;
    button.addEventListener('click', () => {
      applyDesign(design.id);
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
    options.appendChild(button);
  });

  document.body.appendChild(root);

  function updateUI() {
    const current = body.dataset.design || 'professional';
    const currentDesign = designs.find((item) => item.id === current) || designs[0];
    toggle.querySelector('span').textContent = currentDesign.label;
    if (existingToggle) {
      existingToggle.hidden = true;
      existingToggle.setAttribute('aria-hidden', 'true');
    }
    root.querySelectorAll('.design-option').forEach((button) => {
      const active = button.dataset.designChoice === current;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.title = `Muhammad Amjid | ${currentDesign.label}`;
  }

  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (event) => {
    if (existingToggle && event.target.closest('#themeToggle')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
    }
  }, true);

  refreshProfessionalWording();
  fixSmartSalesLink();
  fixProfilePhotoFrame();
  applyDesign(getSaved());
})();