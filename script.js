const CONFIG = {
  // Gate: birthday
  birth: { dd: "24", mm: "12", yyyy: "1999" },

  // Optional: your relationship start date for "days together"
  sinceISO: "2021-02-21",

  // Homepage collage (5)
  homeCollage: [
    { src: "assets/photos/home1.jpg", caption: "Happy Birthday" },
    { src: "assets/photos/home2.jpg", caption: "My favorite person" },
    { src: "assets/photos/home3.jpg", caption: "Always you" },
    { src: "assets/photos/home4.jpg", caption: "Soft moments" },
    { src: "assets/photos/home5.jpg", caption: "Forever vibe" }
  ],

  // Moments (10)
  moments: [
    { src: "assets/photos/moment01.jpg", stamp: "Moment 01", line: "The day when you came down to my sergeant graduation." },
    { src: "assets/photos/moment02.jpg", stamp: "Moment 02", line: "Our Van Gogh Museum date." },
    { src: "assets/photos/moment03.jpg", stamp: "Moment 03", line: "My birthday celebration at the mexican place at dempsey." },
    { src: "assets/photos/moment04.jpg", stamp: "Moment 04", line: "Our first GBTB with your family." },
    { src: "assets/photos/moment05.jpg", stamp: "Moment 05", line: "meow, i look good here." },
    { src: "assets/photos/moment06.jpg", stamp: "Moment 06", line: "Animal zoo in bkk" },
    { src: "assets/photos/moment07.jpg", stamp: "Moment 07", line: "My first Spago experience with you." },
    { src: "assets/photos/moment08.jpg", stamp: "Moment 08", line: "Our first pottery class." },
    { src: "assets/photos/moment09.jpg", stamp: "Moment 09", line: "photobooth of me in frog costume."},
    { src: "assets/photos/moment10.jpg", stamp: "Moment 10", line: "Our first hair salon experience together. "}
  ],

  // Travels (5, each photo = one trip)
  travels: [
    { src: "assets/photos/trip01.jpg", title: "Trip 01", sub: "Switzerland."},
    { src: "assets/photos/trip02.jpg", title: "Trip 02", sub: "Seoul."},
    { src: "assets/photos/trip03.jpg", title: "Trip 03", sub: "Bangkok."},
    { src: "assets/photos/trip04.jpg", title: "Trip 04", sub: "ITaly."},
    { src: "assets/photos/trip05.jpg", title: "Trip 05", sub: "Bangkok."}
  ],

  //first date
  firstDate: [
    {src: "assets/photos/firstdate1.jpg", title: "First Date 01", sub: "A place"}
  ]
};

function pad2(n){ return String(n).padStart(2, "0"); }

function daysBetween(start, end){
  const ms = 24 * 60 * 60 * 1000;
  const a = new Date(start);
  const b = new Date(end);
  a.setHours(0,0,0,0);
  b.setHours(0,0,0,0);
  return Math.floor((b - a) / ms);
}

function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function initTheme(){
  const select = document.getElementById("themeSelect");
  if (!select) return;

  const saved = localStorage.getItem("theme");
  if (saved){
    select.value = saved;
    setTheme(saved);
  } else {
    setTheme(select.value || "pink");
  }

  select.addEventListener("change", (e) => setTheme(e.target.value));
}

function initMusic(){
  const audio = document.getElementById("bgm");
  const btn = document.getElementById("musicBtn");
  if (!audio || !btn) return;

  const saved = localStorage.getItem("music");
  let playing = saved === "on";

  const applyBtn = () => btn.textContent = playing ? "Pause music" : "Play music";
  applyBtn();

  const attemptStart = async () => {
    try{
      await audio.play();
      playing = true;
      localStorage.setItem("music", "on");
      applyBtn();
    } catch {
      playing = false;
      localStorage.setItem("music", "off");
      applyBtn();
    }
  };

  if (playing) attemptStart();

  btn.addEventListener("click", async () => {
    try{
      if (!playing){
        await audio.play();
        playing = true;
        localStorage.setItem("music", "on");
      } else {
        audio.pause();
        playing = false;
        localStorage.setItem("music", "off");
      }
      applyBtn();
    } catch {
      playing = false;
      localStorage.setItem("music", "off");
      applyBtn();
      alert("Playback blocked by browser. Tap again after interacting with the page.");
    }
  });
}

function initCounters(){
  const sinceEl = document.getElementById("sinceDate");
  const daysEl = document.getElementById("daysTogether");
  if (sinceEl && daysEl){
    sinceEl.textContent = CONFIG.sinceISO;
    daysEl.textContent = String(daysBetween(CONFIG.sinceISO, new Date()));
  }
}

function initGate(){
  const gate = document.getElementById("gate");
  if (!gate) return;

  const unlocked = localStorage.getItem("unlocked") === "yes";
  const lockView = document.getElementById("lockView");
  const revealView = document.getElementById("revealView");

  const bloom = document.getElementById("bloom");

  const showReveal = () => {
    if (lockView) lockView.style.display = "none";
    if (revealView) revealView.style.display = "block";
    requestAnimationFrame(() => {
      if (bloom) bloom.classList.add("on");
    });
    spawnHomeCollage();
  };

  if (unlocked){
    showReveal();
    return;
  }

  const dd = document.getElementById("dd");
  const mm = document.getElementById("mm");
  const yyyy = document.getElementById("yyyy");
  const unlockBtn = document.getElementById("unlockBtn");

  const sanitize = (el, maxLen) => {
    el.value = el.value.replace(/[^\d]/g, "").slice(0, maxLen);
  };

  const check = () => {
    const ok = (dd.value === CONFIG.birth.dd) && (mm.value === CONFIG.birth.mm) && (yyyy.value === CONFIG.birth.yyyy);
    if (ok){
      localStorage.setItem("unlocked", "yes");
      showReveal();
      return;
    }
    // shake inputs
    [dd, mm, yyyy].forEach((x) => {
      x.classList.remove("shake");
      void x.offsetWidth;
      x.classList.add("shake");
    });
  };

  dd.addEventListener("input", () => { sanitize(dd, 2); if (dd.value.length === 2) mm.focus(); });
  mm.addEventListener("input", () => { sanitize(mm, 2); if (mm.value.length === 2) yyyy.focus(); });
  yyyy.addEventListener("input", () => sanitize(yyyy, 4));

  [dd, mm, yyyy].forEach((x) => x.addEventListener("keydown", (e) => {
    if (e.key === "Enter") check();
  }));

  unlockBtn?.addEventListener("click", check);
}

function rand(min, max){ return Math.random() * (max - min) + min; }

function spawnHomeCollage(){
  const collage = document.getElementById("collage");
  if (!collage) return;

  collage.innerHTML = "";

  const w = collage.clientWidth;
  const h = collage.clientHeight;

  const safePad = 90;
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

    const x = rand(160, w - 160);
    const y = rand(150, h - 150);
    const rot = rand(-10, 10);

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--rot", `${rot}deg`);

    el.innerHTML = `
      <img src="${item.src}" alt="" loading="eager">
      <div class="cap">${item.caption || ""}</div>
    `;

    collage.appendChild(el);
  }, 260);
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

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMusic();
  initCounters();
  initGate();
  renderMoments();
  renderTravels();
  initLetter();
});
