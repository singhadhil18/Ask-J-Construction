(() => {
  const group = document.querySelector('.services-navigation');
  if (!group) return;
  const toggle = group.querySelector('button');
  const link = group.querySelector('.services-trigger > a');
  const panel = group.querySelector('.services-submenu');
  const desktop = matchMedia('(min-width: 980px) and (hover: hover)');
  let dismissed = false;
  let pointerInside = false;
  document.addEventListener('pointerdown', event => {
    pointerInside = group.contains(event.target);
  }, true);
  document.addEventListener('pointerup', () => { setTimeout(() => { pointerInside = false; }, 0); });
  document.addEventListener('pointercancel', () => { pointerInside = false; });
  const setOpen = open => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    link.setAttribute('aria-expanded', String(open));
  };
  const syncTrigger = () => {
    toggle.hidden = desktop.matches;
    link.hidden = !desktop.matches;
  };
  link.setAttribute('aria-controls', panel.id);
  syncTrigger();
  link.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); dismissed = false; setOpen(true);
      panel.querySelector('a').focus();
    }
  });
  group.classList.add('enhanced');
  setOpen(false);
  toggle.addEventListener('click', () => {
    dismissed = !panel.hidden;
    setOpen(panel.hidden);
  });
  group.addEventListener('pointerenter', () => {
    if (desktop.matches && !dismissed) setOpen(true);
  });
  group.addEventListener('pointerleave', () => {
    if (!desktop.matches) return;
    dismissed = false;
    if (!group.contains(document.activeElement)) setOpen(false);
  });
  group.addEventListener('focusin', event => {
    if (desktop.matches && !dismissed && event.target !== toggle) setOpen(true);
  });
  group.addEventListener('focusout', event => {
    // Safari may focus the header rather than an anchor on pointer-down.
    // Keep the clicked link present until its default navigation has occurred.
    if (!pointerInside && !group.contains(event.relatedTarget) && !(desktop.matches && group.matches(':hover'))) { setOpen(false); dismissed = false; }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      dismissed = true; setOpen(false); (desktop.matches ? link : toggle).focus();
    }
  });
  document.addEventListener('click', event => {
    if (!group.contains(event.target)) { setOpen(false); dismissed = false; }
  });
  // Leave clicked links present until the browser follows them, including Safari.
  window.addEventListener('hashchange', () => setOpen(false));
  desktop.addEventListener('change', () => { syncTrigger(); setOpen(false); dismissed = false; });
})();
