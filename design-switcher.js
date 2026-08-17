(function () {
  const designs = [
    { id: 'professional', label: '01 Professional', desc: 'Current portfolio design' },
    { id: 'premium', label: '02 Premium Creative', desc: 'Luxury, depth and motion' },
    { id: 'executive', label: '03 Executive / Corporate', desc: 'Senior leadership presentation' }
  ];
  const storageKey = 'amjid-portfolio-design';
  const body = document.body;
  const existingToggle = document.getElementById('themeToggle');

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

  applyDesign(getSaved());
})();
