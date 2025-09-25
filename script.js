document.addEventListener('DOMContentLoaded', () => {
  // greeting
  const now = new Date();
  const hour = now.getHours();
  let greetingText = "";
  if (hour < 12) greetingText = "Good morning!";
  else if (hour < 18) greetingText = "Good afternoon!";
  else greetingText = "Good evening!";

  const el = document.getElementById("greeting");
  if (el) el.textContent = greetingText;

  // Light and Dark theme icons
  const sunSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const moonSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

  const setToggleIcons = (isLight) => {
    document.querySelectorAll('.icon-btn').forEach(btn => {
      btn.innerHTML = isLight ? moonSVG : sunSVG;
      btn.setAttribute('aria-label', isLight ? 'Switch to dark' : 'Switch to light');
    });
  };

  // apply theme and update icons
  const applyTheme = (theme) => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    setToggleIcons(theme === 'light');
  };

  // Prefer saved user preference, else default to light theme
  const stored = localStorage.getItem('site-theme');
  const initial = stored ? stored : 'light';
  applyTheme(initial);

  // wire toggle buttons
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentIsLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = currentIsLight ? 'dark' : 'light';
      // Add class to enable transitions
      document.documentElement.classList.add('theme-switching');
      void document.documentElement.offsetWidth;
      applyTheme(next);
      clearTimeout(window.__themeSwitchTimeout);
 
  window.__themeSwitchTimeout = setTimeout(() => document.documentElement.classList.remove('theme-switching'), 480);
      localStorage.setItem('site-theme', next);
      try { btn.animate([{ transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 140 }); } catch(e){}
    });
  });

  // Menu for smaller screens
  const ensureMobileMenu = () => {
    if (document.querySelector('.menu-toggle')) return; 

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

    // insert before the right-side controls so it sits left of the theme toggle
    const navContainer = document.querySelector('.site-nav .container');
    if (navContainer) {
      navContainer.insertBefore(toggle, navContainer.querySelector('.nav-right'));
    }

    const closeMenu = () => {
      document.documentElement.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };

    const openMenu = () => {
      document.documentElement.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.documentElement.classList.contains('menu-open')) closeMenu();
      else openMenu();
    });

    // Close menu after a link is clicked
    document.querySelectorAll('.site-links-center a').forEach(a => a.addEventListener('click', () => closeMenu()));

    // If outside area of the menu is tapped, close menu
    document.addEventListener('click', (e) => {
      if (!document.documentElement.classList.contains('menu-open')) return;
      const withinNav = e.target.closest('.site-nav');
      if (!withinNav) closeMenu();
    });
  };

  // Initialize on load and also on resize to ensure toggle exists on mobile widths
  ensureMobileMenu();
  window.addEventListener('resize', () => {
    // If width gets larger, remove menu-open
    if (window.innerWidth > 720) document.documentElement.classList.remove('menu-open');
    ensureMobileMenu();
  });

  // Prefetch optimization
  const prefetchLinks = document.querySelectorAll('a[data-prefetch]');
  prefetchLinks.forEach(a => {
    const prefetch = () => {
      if (!document.querySelector(`link[rel="prefetch"][href="${a.href}"]`)) {
        const l = document.createElement('link');
        l.rel = 'prefetch';
        l.href = a.href;
        document.head.appendChild(l);
      }
    };
    a.addEventListener('mouseenter', prefetch, { once: true });
    a.addEventListener('touchstart', prefetch, { once: true });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
  }, { once: true });
});
