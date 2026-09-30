(() => {
  const header = document.querySelector('#SITE_HEADER');
  const drawer = document.querySelector('#mobile-navigation');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.recovered-nav');
  const compact = matchMedia('(max-width: 979px)');
  if (header && drawer && toggle && nav) {
    let savedScroll = null;
    const close = () => {
      if (drawer.open) drawer.close();
      toggle.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-open');
      if (savedScroll !== null) {
        if (compact.matches) toggle.focus({preventScroll: true});
        window.scrollTo({top: savedScroll, behavior: 'instant'});
        savedScroll = null;
        document.documentElement.style.removeProperty('--menu-scroll-top');
      }
    };
    const placeNavigation = () => {
      close();
      if (compact.matches) drawer.append(nav);
      else header.insertBefore(nav, header.querySelector('.header-quote'));
      // A resize must not leave keyboard focus inside the hidden drawer.
      if (!compact.matches && document.activeElement === toggle) nav.querySelector('a').focus();
    };
    toggle.addEventListener('click', () => {
      savedScroll = window.scrollY;
      document.documentElement.style.setProperty('--menu-scroll-top', `-${savedScroll}px`);
      document.documentElement.classList.add('menu-open');
      drawer.showModal();
      toggle.setAttribute('aria-expanded', 'true');
    });
    drawer.querySelector('.menu-close').addEventListener('click', close);
    drawer.addEventListener('close', close);
    drawer.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const items = [...drawer.querySelectorAll('a[href], button')].filter(item => item.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    let outsidePointer = false;
    const outside = event => {
      const rect = drawer.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    drawer.addEventListener('pointerdown', event => { outsidePointer = outside(event); });
    drawer.addEventListener('click', event => {
      if (event.target === drawer && outsidePointer && outside(event)) close();
      const link = event.target.closest('a');
      if (link && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) close();
    });
    compact.addEventListener('change', placeNavigation);
    window.addEventListener('pagehide', close);
    placeNavigation();
  }
  const group = document.querySelector('.services-navigation');
  if (!group) return;
  const link = group.querySelector('.services-trigger > a');
  const serviceToggle = group.querySelector('.services-toggle');
  const panel = group.querySelector('.services-submenu');
  const navigation = group.closest('nav');
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
    link.setAttribute('aria-expanded', String(open));
    serviceToggle.setAttribute('aria-expanded', String(open));
    serviceToggle.setAttribute('aria-label', open ? 'Collapse service links' : 'Expand service links');
  };
  link.setAttribute('aria-controls', panel.id);
  link.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); dismissed = false; setOpen(true);
      panel.querySelector('a').focus();
    }
  });
  group.classList.add('enhanced');
  setOpen(false);
  serviceToggle.addEventListener('click', () => {
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
      event.preventDefault();
      dismissed = true; setOpen(false); link.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!group.contains(event.target)) { setOpen(false); dismissed = false; }
  });
  // Leave clicked links present until the browser follows them, including Safari.
  window.addEventListener('hashchange', () => setOpen(false));
  desktop.addEventListener('change', () => { setOpen(false); dismissed = false; });

  // Re-selecting the current page returns to its top without reloading it.
  // This bubbles after drawer dismissal, so its saved scroll position is restored.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = 0;
  const cancelScroll = () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  };
  const scrollToTop = () => {
    cancelScroll();
    // Allow restored mobile scroll offsets to settle before starting the animation.
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = requestAnimationFrame(() => {
        const from = window.scrollY;
        if (reducedMotion.matches || from < 1) {
          window.scrollTo({top: 0, behavior: 'instant'});
          scrollFrame = 0;
          return;
        }
        const started = performance.now();
        const step = now => {
          const progress = Math.min((now - started) / 1100, 1);
          const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
          window.scrollTo({top: from * (1 - eased), behavior: 'instant'});
          scrollFrame = progress < 1 ? requestAnimationFrame(step) : 0;
        };
        scrollFrame = requestAnimationFrame(step);
      });
    });
  };
  const pagePath = url => url.pathname.replace(/\/index\.html$/, '/');
  header.addEventListener('click', event => {
    const target = event.target.closest('a[href]');
    if (!target || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || target.hasAttribute('download') || (target.target && target.target !== '_self')) return;
    const destination = new URL(target.href);
    const current = new URL(location.href);
    if (destination.origin !== current.origin || pagePath(destination) !== pagePath(current) || destination.search !== current.search || destination.hash) return;
    event.preventDefault();
    dismissed = true;
    setOpen(false);
    if (current.hash) history.replaceState(history.state, '', current.pathname + current.search);
    scrollToTop();
  });
  // Visitors can interrupt the animation with their usual scrolling controls.
  window.addEventListener('wheel', cancelScroll, {passive: true});
  window.addEventListener('touchstart', cancelScroll, {passive: true});
  window.addEventListener('pointerdown', cancelScroll, {passive: true});
  window.addEventListener('keydown', event => {
    if (['Escape', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelScroll();
  });
  window.addEventListener('pagehide', cancelScroll);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && scrollFrame) {
      cancelScroll();
      window.scrollTo({top: 0, behavior: 'instant'});
    }
  });
})();
