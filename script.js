document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const hour = now.getHours();
  let greetingText = "";
  if (hour < 12) greetingText = "Good morning!";
  else if (hour < 18) greetingText = "Good afternoon!";
  else greetingText = "Good evening!";

  const el = document.getElementById("greeting");
  if (el) el.textContent = greetingText;

  const sunSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const moonSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

  const setToggleIcons = (isLight) => {
    document.querySelectorAll('.icon-btn').forEach(btn => {
      btn.innerHTML = isLight ? moonSVG : sunSVG;
      btn.setAttribute('aria-label', isLight ? 'Switch to dark' : 'Switch to light');
    });
  };

  const applyTheme = (theme) => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    setToggleIcons(theme === 'light');
  };

  const stored = localStorage.getItem('site-theme');
  const initial = stored ? stored : 'light';
  applyTheme(initial);

  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentIsLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = currentIsLight ? 'dark' : 'light';
      document.documentElement.classList.add('theme-switching');
      void document.documentElement.offsetWidth;
      applyTheme(next);
      clearTimeout(window.__themeSwitchTimeout);
      window.__themeSwitchTimeout = setTimeout(() => document.documentElement.classList.remove('theme-switching'), 480);
      localStorage.setItem('site-theme', next);
      try { btn.animate([{ transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 140 }); } catch(e){}
    });
  });

  // Mobile menu creation & behavior
  // Only create the menu on pages other than home
  const isHome = (pathname => {
    if (!pathname) return true;
    const p = pathname.replace(/\/+$/, '');
    return p === '' || p === '/' || p.endsWith('/index.html');
  })(window.location.pathname);

  // Do not create the menu toggle on the homepage
  if (!isHome) {
    if (!document.querySelector('.menu-toggle')) {
      const menuToggle = document.createElement('button');
      menuToggle.type = 'button';
      menuToggle.className = 'menu-toggle';
      menuToggle.setAttribute('aria-label', 'Open menu');
      menuToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

      // Place the toggle inside .nav-right so it lines up with theme toggle
      const navRight = document.querySelector('.site-nav .nav-right');
      if (navRight) {
        navRight.insertBefore(menuToggle, navRight.firstElementChild);
      } else {
        // fallback: append to container end
        const navContainer = document.querySelector('.site-nav .container');
        if (navContainer) navContainer.appendChild(menuToggle);
      }

      const closeMenu = () => {
        document.documentElement.classList.remove('menu-open');
        menuToggle.setAttribute('aria-label', 'Open menu');
      };
      const openMenu = () => {
        document.documentElement.classList.add('menu-open');
        menuToggle.setAttribute('aria-label', 'Close menu');
      };

      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.documentElement.classList.contains('menu-open')) closeMenu();
        else openMenu();
      });

      // Close menu when clicking any link or theme toggle inside the mobile menu
      document.querySelectorAll('.site-links-center a, .site-links-center .icon-btn').forEach(el=>{
        el.addEventListener('click', closeMenu);
      });

      // Close when tapping outside the menu while open
      document.addEventListener('click', (e)=>{
        if (!document.documentElement.classList.contains('menu-open')) return;
        const withinNav = e.target.closest('.site-nav');
        if (!withinNav) closeMenu();
      });

      // Remove the menu-open class on navigation (single-page or external)
      window.addEventListener('hashchange', () => document.documentElement.classList.remove('menu-open'));
    }
  }

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
