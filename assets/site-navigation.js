(() => {
  const group = document.querySelector('.services-navigation');
  if (!group) return;
  const link = group.querySelector('.services-trigger > a');
  const panel = group.querySelector('.services-submenu');
  const navigation = group.closest('nav');
  const desktop = matchMedia('(hover: hover)');
  let dismissed = false;
  let pointerInside = false;
  document.addEventListener('pointerdown', event => {
    pointerInside = group.contains(event.target);
  }, true);
  document.addEventListener('pointerup', () => { setTimeout(() => { pointerInside = false; }, 0); });
  document.addEventListener('pointercancel', () => { pointerInside = false; });
  const setOpen = open => {
    panel.hidden = !open;
    link.setAttribute('aria-expanded', String(open));
  };
  const syncTrigger = () => {
    if (desktop.matches) link.removeAttribute('role');
    else link.setAttribute('role', 'button');
  };
  link.setAttribute('aria-controls', panel.id);
  syncTrigger();
  link.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); dismissed = false; setOpen(true);
      panel.querySelector('a').focus();
    } else if (!desktop.matches && event.key === ' ') {
      event.preventDefault(); setOpen(panel.hidden);
    }
  });
  group.classList.add('enhanced');
  setOpen(false);
  link.addEventListener('click', event => {
    // Mouse browsers follow the overview link; only touch needs a tap disclosure.
    if (desktop.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dismissed = !panel.hidden;
    setOpen(panel.hidden);
  });
  group.addEventListener('pointerenter', () => {
    if (desktop.matches && !dismissed) setOpen(true);
  });
  navigation.querySelectorAll(':scope > a').forEach(item => {
    item.addEventListener('pointerenter', () => {
      if (!desktop.matches) return;
      dismissed = false;
      setOpen(false);
    });
  });
  const leaveNavigation = event => {
    if (!desktop.matches) return;
    // A wrapped ribbon places the in-flow submenu below other navigation links.
    // Keep it open over gaps; entering another navigation link closes it.
    if (innerWidth < 980 && navigation.contains(event.relatedTarget)) return;
    dismissed = false;
    if (!group.contains(document.activeElement)) setOpen(false);
  };
  group.addEventListener('pointerleave', leaveNavigation);
  navigation.addEventListener('pointerleave', leaveNavigation);
  group.addEventListener('focusin', event => {
    if (desktop.matches && !dismissed && !pointerInside) setOpen(true);
  });
  group.addEventListener('focusout', event => {
    // Safari may focus the header rather than an anchor on pointer-down.
    // Keep the clicked link present until its default navigation has occurred.
    if (!pointerInside && !group.contains(event.relatedTarget) && !(desktop.matches && group.matches(':hover'))) { setOpen(false); dismissed = false; }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      dismissed = true; setOpen(false); link.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!group.contains(event.target)) { setOpen(false); dismissed = false; }
  });
  // Leave clicked links present until the browser follows them, including Safari.
  window.addEventListener('hashchange', () => setOpen(false));
  desktop.addEventListener('change', () => { syncTrigger(); setOpen(false); dismissed = false; });
})();
