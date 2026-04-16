const fs = require('fs');
['index.html', 'webintegra.html'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. replace display: none !important
  content = content.replace(/display:\s*none\s*!important/g, 'display: none');

  // 2. Add Cookie CSS if not exists
  if(!content.includes('.cookie-banner')) {
    const css = 
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--ink);
      color: var(--white);
      padding: 16px 5vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      z-index: 10000;
    }
    .cookie-text p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
    .cookie-text a {
      color: var(--blue);
      text-decoration: underline;
    }
    .cookie-buttons {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }
    @media(max-width:700px) {
      .cookie-banner { flex-direction: column; align-items: stretch; }
    }
    ;
    content = content.replace('/* TOAST */', css + '\n    /* TOAST */');
  }

  // 3. Add Cookie HTML
  if(!content.includes('cookieBanner')) {
    const html = 
  <!-- COOKIES BANNER -->
  <div class="cookie-banner" id="cookieBanner">
    <div class="cookie-text">
      <p>Utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarte publicidad relacionada con tus preferencias en base a un perfil elaborado a partir de tus hábitos de navegación. Puedes obtener más información y configurar tus preferencias en nuestra <a href="#">Política de Cookies</a>.</p>
    </div>
    <div class="cookie-buttons">
      <button class="btn-outline" style="padding: 10px 20px; font-size: 14px;" onclick="acceptCookies()">Rechazar</button>
      <button class="btn-primary" style="padding: 10px 20px; font-size: 14px;" onclick="acceptCookies()">Aceptar todas</button>
    </div>
  </div>
  ;
    content = content.replace('<div class="toast" id="toast">', html + '<div class="toast" id="toast">');
  }

  // 4. Add acceptCookies function and init check
  if(!content.includes('function acceptCookies()')) {
    const js = 
    function acceptCookies() {
      document.getElementById('cookieBanner').style.display = 'none';
      try { localStorage.setItem('cookiesAccepted', 'true'); } catch(e) {}
    }

    if(localStorage.getItem('cookiesAccepted')) {
      document.getElementById('cookieBanner').style.display = 'none';
    }
    ;
    content = content.replace('// --- ROUTER', js + '\n    // --- ROUTER');
  }

  // 5. Add mobile tracking closing logic
  if(!content.includes('ESTE BLOQUE CIERRA')) {
    const navFix = 
      // ESTE BLOQUE CIERRA EL MENÚ MÓVIL AL HACER CLIC
      if (typeof mobileOpen !== 'undefined' && mobileOpen) {
        mobileOpen = false;
        const links = document.getElementById('nav-links');
        if (links) links.style.cssText = '';
      }
    ;
    content = content.replace('function navigate(page) {', 'function navigate(page) {' + navFix);
  }

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed both files!');
