const CONFIG = {
  birth: { dd: "24", mm: "12", yyyy: "1999" },
  sinceISO: "2021-02-21",

  homeCollage: [
    { src: "assets/photos/home1.jpg", caption: "Happy Birthday" },
    { src: "assets/photos/home2.jpg", caption: "My favorite person" },
    { src: "assets/photos/home3.jpg", caption: "Always you" },
    { src: "assets/photos/home4.jpg", caption: "Soft moments" },
    { src: "assets/photos/home5.jpg", caption: "Forever vibe" }
  ],

  moments: [
    { src: "assets/photos/moment01.jpg", stamp: "Moment 01", line: "The day when you came down to my sergeant graduation." },
    { src: "assets/photos/moment02.jpg", stamp: "Moment 02", line: "Our Van Gogh Museum date." },
    { src: "assets/photos/moment03.jpg", stamp: "Moment 03", line: "My birthday celebration at the mexican place at dempsey." },
    { src: "assets/photos/moment04.jpg", stamp: "Moment 04", line: "Our first GBTB with your family." },
    { src: "assets/photos/moment05.jpg", stamp: "Moment 05", line: "meow, i look good here." },
    { src: "assets/photos/moment06.jpg", stamp: "Moment 06", line: "Animal zoo in bkk" },
    { src: "assets/photos/moment07.jpg", stamp: "Moment 07", line: "My first Spago experience with you." },
    { src: "assets/photos/moment08.jpg", stamp: "Moment 08", line: "Our first pottery class." },
    { src: "assets/photos/moment09.jpg", stamp: "Moment 09", line: "photobooth of me in frog costume." },
    { src: "assets/photos/moment10.jpg", stamp: "Moment 10", line: "Our first hair salon experience together. " }
  ],

  travels: [
    { src: "assets/photos/trip01.jpg", title: "Trip 01", sub: "Switzerland." },
    { src: "assets/photos/trip02.jpg", title: "Trip 02", sub: "Seoul." },
    { src: "assets/photos/trip03.jpg", title: "Trip 03", sub: "Bangkok." },
    { src: "assets/photos/trip04.jpg", title: "Trip 04", sub: "ITaly." },
    { src: "assets/photos/trip05.jpg", title: "Trip 05", sub: "Bangkok." }
  ]
};

function daysBetween(start, end){
  const ms = 24 * 60 * 60 * 1000;
  const a = new Date(start);
  const b = new Date(end);
  a.setHours(0,0,0,0);
  b.setHours(0,0,0,0);
  return Math.floor((b - a) / ms);
}
function rand(min, max){ return Math.random() * (max - min) + min; }

/* ---------------- Music (fade, SPA persistent) ---------------- */
async function fadeTo(audio, target, ms){
  const start = audio.volume;
  const steps = 24;
  for (let i = 1; i <= steps; i++){
    audio.volume = start + (target - start) * (i / steps);
    await new Promise(r => setTimeout(r, ms / steps));
  }
}

function initMusic(){
  const audio = document.getElementById("bgm");
  const btn = document.getElementById("musicBtn");
  if (!audio || !btn) return;

  audio.volume = 0.0;
  let playing = localStorage.getItem("music") === "on";

  const apply = () => btn.textContent = playing ? "Pause music" : "Play music";
  apply();

  const start = async () => {
    try{
      audio.volume = 0.0;
      await audio.play();
      await fadeTo(audio, 0.55, 700);
      playing = true;
      localStorage.setItem("music", "on");
      apply();
    } catch {
      playing = false;
      localStorage.setItem("music", "off");
      apply();
    }
  };

  const stop = async () => {
    try{
      await fadeTo(audio, 0.0, 520);
      audio.pause();
    } finally {
      playing = false;
      localStorage.setItem("music", "off");
      apply();
    }
  };

  if (playing) start();

  btn.addEventListener("click", async () => {
    if (!playing) await start();
    else await stop();
  });

  window.__startMusicFromGesture = start;
}

/* ---------------- Cinematic overlays ---------------- */
function setBloom(){
  const bloom = document.getElementById("bloom");
  if (!bloom) return;
  bloom.classList.remove("on");
  void bloom.offsetWidth;
  bloom.classList.add("on");
}

function setShutter(){
  const el = document.getElementById("shutter");
  if (!el) return;
  el.classList.remove("on");
  void el.offsetWidth;
  el.classList.add("on");
}

function burstPetals(){
  const host = document.getElementById("petals");
  if (!host) return;

  host.innerHTML = "";
  const n = 18;
  const cx = window.innerWidth * 0.5;
  const cy = window.innerHeight * 0.45;

  for (let i = 0; i < n; i++){
    const p = document.createElement("div");
    p.className = "petal";

    const angle = rand(0, Math.PI * 2);
    const dist1 = rand(120, 360);
    const dist0 = rand(0, 40);

    const x0 = cx + Math.cos(angle) * dist0;
    const y0 = cy + Math.sin(angle) * dist0;
    const x1 = cx + Math.cos(angle) * dist1;
    const y1 = cy + Math.sin(angle) * dist1;

    p.style.left = "0px";
    p.style.top = "0px";
    p.style.setProperty("--x0", `${x0}px`);
    p.style.setProperty("--y0", `${y0}px`);
    p.style.setProperty("--x1", `${x1}px`);
    p.style.setProperty("--y1", `${y1}px`);

    p.style.animationDelay = `${rand(0, 120)}ms`;
    p.style.transform = `rotate(${rand(-30,30)}deg)`;

    host.appendChild(p);
  }

  setTimeout(() => { host.innerHTML = ""; }, 1100);
}

/* ---------------- SPA routing ---------------- */
const ORDER = ["lock", "home", "moments", "travels", "letter"];
const TITLES = {
  lock: "Unlock",
  home: "Home",
  moments: "Favorite Moments",
  travels: "Our Travels",
  letter: "Letter"
};

function setTopbar(scene){
  const progress = document.getElementById("progressText");
  const hint = document.getElementById("sceneHint");
  const idx = Math.max(0, ORDER.indexOf(scene));
  const step = String(idx + 1).padStart(2, "0");
  const total = String(ORDER.length).padStart(2, "0");
  if (progress) progress.textContent = `${step} / ${total}`;
  if (hint) hint.textContent = TITLES[scene] || "For You";
}

function showScene(scene){
  ORDER.forEach((s) => {
    const el = document.getElementById(`scene-${s}`);
    if (!el) return;
    el.classList.remove("is-active", "is-in");
  });

  const target = document.getElementById(`scene-${scene}`);
  if (!target) return;

  target.classList.add("is-active");
  requestAnimationFrame(() => target.classList.add("is-in"));
  setTopbar(scene);
}

function currentSceneFromHash(){
  const raw = (location.hash || "").replace("#", "").trim();
  if (ORDER.includes(raw)) return raw;
  return null;
}

function goto(scene){
  const unlocked = localStorage.getItem("unlocked") === "yes";
  if (!unlocked && scene !== "lock") {
    location.hash = "#lock";
    showScene("lock");
    denyJump();
    return;
  }

  location.hash = `#${scene}`;
  showScene(scene);

  if (scene === "home") {
    initCounters();
    renderHeroMosaic();
    spawnHomeCollage();
    ensureParallax();
  }
  if (scene === "moments") renderMoments();
  if (scene === "travels") renderTravels();
}

/* Film cut transition for all scene changes */
function transitionTo(scene){
  setShutter();
  setTimeout(() => goto(scene), 160);
}

function initNavButtons(){
  document.body.addEventListener("click", (e) => {
    const t = e.target;

    if (t && t.matches("[data-next]")){
      const cur = currentSceneFromHash() || (localStorage.getItem("unlocked")==="yes" ? "home" : "lock");
      const idx = ORDER.indexOf(cur);
      const next = ORDER[Math.min(idx + 1, ORDER.length - 1)];
      transitionTo(next);
    }

    if (t && t.matches("[data-prev]")){
      const cur = currentSceneFromHash() || (localStorage.getItem("unlocked")==="yes" ? "home" : "lock");
      const idx = ORDER.indexOf(cur);
      const prev = ORDER[Math.max(idx - 1, 0)];
      transitionTo(prev);
    }

    if (t && t.matches("[data-goto]")){
      const target = t.getAttribute("data-goto");
      if (target && ORDER.includes(target)) transitionTo(target);
    }
  });

  window.addEventListener("hashchange", () => {
    const scene = currentSceneFromHash();
    if (!scene) return;
    showScene(scene);
  });
}

/* ---------------- Unlock flow (cinematic sequence) ---------------- */
function denyJump(){
  const lockShell = document.getElementById("lockShell");
  if (!lockShell) return;
  lockShell.classList.remove("shake");
  void lockShell.offsetWidth;
  lockShell.classList.add("shake");
  setBloom();
}

function initGate(){
  const unlocked = localStorage.getItem("unlocked") === "yes";
  if (unlocked){
    goto(currentSceneFromHash() || "home");
    return;
  }

  showScene("lock");
  location.hash = "#lock";

  const dd = document.getElementById("dd");
  const mm = document.getElementById("mm");
  const yyyy = document.getElementById("yyyy");
  const unlockBtn = document.getElementById("unlockBtn");
  if (!dd || !mm || !yyyy || !unlockBtn) return;

  const sanitize = (el, maxLen) => {
    el.value = el.value.replace(/[^\d]/g, "").slice(0, maxLen);
  };

  const shakeAll = () => {
    [dd, mm, yyyy].forEach((x) => {
      x.classList.remove("shake");
      void x.offsetWidth;
      x.classList.add("shake");
    });
  };

  const check = async () => {
    const ok = (dd.value === CONFIG.birth.dd) && (mm.value === CONFIG.birth.mm) && (yyyy.value === CONFIG.birth.yyyy);
    if (!ok){
      shakeAll();
      setBloom();
      return;
    }

    // Mark unlocked first (pacing lock)
    localStorage.setItem("unlocked", "yes");

    // Start music here (user gesture)
    await window.__startMusicFromGesture?.();

    // Cinematic sequence
    setBloom();
    setShutter();
    burstPetals();

    setTimeout(() => goto("home"), 220);
  };

  dd.addEventListener("input", () => { sanitize(dd, 2); if (dd.value.length === 2) mm.focus(); });
  mm.addEventListener("input", () => { sanitize(mm, 2); if (mm.value.length === 2) yyyy.focus(); });
  yyyy.addEventListener("input", () => sanitize(yyyy, 4));
  [dd, mm, yyyy].forEach((x) => x.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); }));

  unlockBtn.addEventListener("click", check);
}

/* ---------------- Parallax micro-motion (Home hero only) ---------------- */
let parallaxInit = false;

function ensureParallax(){
  if (parallaxInit) return;
  const hero = document.getElementById("homeHero");
  if (!hero) return;

  parallaxInit = true;

  // pointer tilt
  const setVarsFromPoint = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;   // 0..1
    const y = (clientY - rect.top) / rect.height;   // 0..1

    // map to subtle pixel drift
    const px = (x - 0.5) * 22;
    const py = (y - 0.5) * 18;

    document.documentElement.style.setProperty("--px", `${px}px`);
    document.documentElement.style.setProperty("--py", `${py}px`);
  };

  hero.addEventListener("mousemove", (e) => setVarsFromPoint(e.clientX, e.clientY), { passive: true });

  hero.addEventListener("touchmove", (e) => {
    if (!e.touches || !e.touches[0]) return;
    setVarsFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  hero.addEventListener("mouseleave", () => {
    document.documentElement.style.setProperty("--px", `0px`);
    document.documentElement.style.setProperty("--py", `0px`);
  });

  // scroll micro parallax (very subtle)
  const onScroll = () => {
    const y = window.scrollY || 0;
    const sy = Math.min(10, y * 0.02);
    document.documentElement.style.setProperty("--sy", `${sy}px`);
    document.documentElement.style.setProperty("--sx", `0px`);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------- Renderers ---------------- */
function initCounters(){
  const sinceEl = document.getElementById("sinceDate");
  const daysEl = document.getElementById("daysTogether");
  if (sinceEl && daysEl){
    sinceEl.textContent = CONFIG.sinceISO;
    daysEl.textContent = String(daysBetween(CONFIG.sinceISO, new Date()));
  }
}

function renderHeroMosaic(){
  const host = document.getElementById("heroMosaic");
  if (!host) return;

  const items = CONFIG.homeCollage.slice(0, 5);
  const classes = ["a","b","c","d","e"];

  host.innerHTML = items.map((it, idx) => `
    <figure class="tile ${classes[idx] || ""}">
      <img src="${it.src}" alt="" loading="eager">
    </figure>
  `).join("");
}

function spawnHomeCollage(){
  const collage = document.getElementById("collage");
  if (!collage) return;

  collage.innerHTML = "";

  const w = collage.clientWidth;
  const h = collage.clientHeight;
  const items = CONFIG.homeCollage.slice(0, 5);

  let i = 0;
  const timer = setInterval(() => {
    if (i >= items.length){
      clearInterval(timer);
      return;
    }
    const item = items[i++];
    const el = document.createElement("div");
    el.className = "polaroid";

    const x = rand(220, w * 0.62);
    const y = rand(200, h - 180);
    const rot = rand(-10, 10);

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--rot", `${rot}deg`);

    el.innerHTML = `
      <img src="${item.src}" alt="" loading="eager">
      <div class="cap">${item.caption || ""}</div>
    `;
    collage.appendChild(el);
  }, 240);
}

function renderMoments(){
  const film = document.getElementById("film");
  if (!film) return;

  film.innerHTML = "";
  for (const m of CONFIG.moments){
    const el = document.createElement("div");
    el.className = "frame";
    el.innerHTML = `
      <img src="${m.src}" alt="" loading="lazy">
      <div class="meta">
        <div class="stamp">${m.stamp}</div>
        <div class="line">${m.line}</div>
      </div>
    `;
    film.appendChild(el);
  }
}

function renderTravels(){
  const grid = document.getElementById("postcards");
  if (!grid) return;

  grid.innerHTML = "";
  for (const t of CONFIG.travels){
    const el = document.createElement("div");
    el.className = "postcard";
    el.style.setProperty("--tilt", `${rand(-2.5, 2.5)}deg`);
    el.innerHTML = `
      <img src="${t.src}" alt="" loading="lazy">
      <div class="pc-body">
        <p class="pc-title">${t.title}</p>
        <p class="pc-sub">${t.sub}</p>
      </div>
    `;
    grid.appendChild(el);
  }
}

function initLetter(){
  const btn = document.getElementById("openLetter");
  const letter = document.getElementById("letter");
  if (!btn || !letter) return;

  btn.addEventListener("click", () => {
    letter.classList.add("open");
    btn.disabled = true;
    btn.textContent = "Opened";
  });
}

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMusic();
  initNavButtons();
  initLetter();
  initGate();

  const target = currentSceneFromHash();
  if (target) showScene(target);
});
