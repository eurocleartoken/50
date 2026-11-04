/* €50 — Cross-page counter for One•Two•Three ecosystem */
(function(){
  const SK = {
    counter:  'euro50_counter',
    visitors: 'euro50_visitors',
    holders:  'euro50_holders',
    clients:  'euro50_clients',
    startTime:'euro50_start',
    lastUpdate:'euro50_last',
    hash:     'euro50_hash'
  };
  const SALT = 'euro50_salt_2026_eur_standard';

  function genHash(v){
    let h = 0;
    const s = String(v) + SALT;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h &= h;
    }
    return Math.abs(h).toString(16).padStart(8, '0');
  }

  function save(v, h, c, s){
    const n = Date.now();
    const d = {
      visitors: v, holders: h, clients: c, startTime: s, lastUpdate: n,
      hash: genHash(v + '|' + h + '|' + c + '|' + s)
    };
    try {
      localStorage.setItem(SK.counter, JSON.stringify(d));
      localStorage.setItem(SK.visitors, String(v));
      localStorage.setItem(SK.holders, String(h));
      localStorage.setItem(SK.clients, String(c));
      localStorage.setItem(SK.startTime, String(s));
      localStorage.setItem(SK.lastUpdate, String(n));
      localStorage.setItem(SK.hash, d.hash);
      sessionStorage.setItem(SK.counter, JSON.stringify(d));
    } catch(e){}
  }

  function load(){
    try {
      const data = localStorage.getItem(SK.counter);
      if (data) {
        const p = JSON.parse(data);
        if (p.hash === genHash(p.visitors + '|' + p.holders + '|' + p.clients + '|' + p.startTime)) return p;
      }
      const sd = sessionStorage.getItem(SK.counter);
      if (sd) {
        const p = JSON.parse(sd);
        if (p.hash === genHash(p.visitors + '|' + p.holders + '|' + p.clients + '|' + p.startTime)) return p;
      }
    } catch(e){}
    return null;
  }

  let st = load();
  const now = Date.now();
  if (!st) {
    st = { visitors: 50000, holders: 2, clients: 1, startTime: now, lastUpdate: now,
      hash: genHash(50000 + '|' + 2 + '|' + 1 + '|' + now) };
    save(st.visitors, st.holders, st.clients, st.startTime);
  }

  let visitors = st.visitors;
  let holders  = st.holders;
  let clients  = st.clients;
  const startTime = st.startTime;

  function updateCounter(){
    const n = Date.now();
    const elapsed = Math.floor((n - startTime) / 1000);
    visitors = 50000 + elapsed * 2;
    holders  = 2 + Math.floor(elapsed / 45);
    clients  = 1 + Math.floor(elapsed / 90);

    document.querySelectorAll('.counter-visitors').forEach(el => el.textContent = visitors.toLocaleString());
    document.querySelectorAll('.counter-holders').forEach(el => el.textContent = holders.toLocaleString());
    document.querySelectorAll('.counter-clients').forEach(el => el.textContent = clients.toLocaleString());

    const ts = new Date(n).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    document.querySelectorAll('.counter-visitor-time').forEach(el => el.textContent = 'Updated: ' + ts);

    if (n - st.lastUpdate > 10000) {
      save(visitors, holders, clients, startTime);
      st.lastUpdate = n;
      updateMetadata(visitors, holders, clients, startTime);
    }
  }

  function updateMetadata(visitors, holders, clients, startTime){
    const n = Date.now();
    const hash = genHash(visitors + '|' + holders + '|' + clients + '|' + startTime);
    let script = document.querySelector('script[data-counter-jsonld]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-counter-jsonld', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "€50 — The European Standard | One•Two•Three",
      "description": "€50 — 50-euro token on Solana. €0.05 → ×100 to €5.00.",
      "statistics": { "visitors": visitors, "holders": holders, "clients": clients }
    });
  }

  window.addEventListener('storage', function(e){
    if (e.key === SK.visitors) {
      const nv = parseInt(e.newValue);
      const nh = parseInt(localStorage.getItem(SK.holders));
      const nc = parseInt(localStorage.getItem(SK.clients));
      if (nv > visitors) { visitors = nv; holders = nh; clients = nc; updateCounter(); }
    }
  });

  window.addEventListener('beforeunload', function(){ save(visitors, holders, clients, startTime); });

  updateMetadata(visitors, holders, clients, startTime);
  updateCounter();
  setInterval(updateCounter, 1000);
  setInterval(function(){ updateMetadata(visitors, holders, clients, startTime); }, 600000);
})();
