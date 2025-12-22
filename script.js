// 1) Edit these values
const CONFIG = {
  herName: "[hannah]",
  sinceISO: "1999-12-24", // YYYY-MM-DD (your real anniversary / start date)
  gallery: [
    { src: "assets/p1.jpg", caption: "Our first photo that still makes me smile." },
    { src: "assets/p2.jpg", caption: "That day felt unreal, in a good way." },
    { src: "assets/p3.jpg", caption: "You, in your element." }
  ],
  timeline: [
    { when: "YYYY-MM-DD", what: "First date" },
    { when: "YYYY-MM-DD", what: "First trip together" },
    { when: "YYYY-MM-DD", what: "A moment I knew: it’s you" }
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

function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function init(){
  // Name
  const nameEl = document.getElementById("name");
  nameEl.textContent = CONFIG.herName;

  // Date counters
  const sinceEl = document.getElementById("sinceDate");
  const daysEl = document.getElementById("daysTogether");
  sinceEl.textContent = CONFIG.sinceISO;

  const today = new Date();
  daysEl.textContent = String(daysBetween(CONFIG.sinceISO, today));

  // Gallery
  const galleryEl = document.getElementById("gallery");
  galleryEl.innerHTML = "";
  for (const item of CONFIG.gallery){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.src}" alt="" loading="lazy" />
      <div class="caption">${item.caption}</div>
    `;
    galleryEl.appendChild(card);
  }

  // Timeline
  const listEl = document.getElementById("timelineList");
  listEl.innerHTML = "";
  for (const t of CONFIG.timeline){
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="when">${t.when}</div>
      <div class="what">${t.what}</div>
    `;
    listEl.appendChild(li);
  }

  // Theme select
  const select = document.getElementById("themeSelect");
  const saved = localStorage.getItem("theme");
  if (saved){
    select.value = saved;
    setTheme(saved);
  } else {
    setTheme(select.value);
  }
  select.addEventListener("change", (e) => setTheme(e.target.value));

  // Music toggle
  const audio = document.getElementById("bgm");
  const btn = document.getElementById("toggleMusic");
  let playing = false;

  btn.addEventListener("click", async () => {
    try{
      if (!playing){
        await audio.play();
        playing = true;
        btn.textContent = "Pause music";
      } else {
        audio.pause();
        playing = false;
        btn.textContent = "Play music";
      }
    } catch (err){
      // Autoplay restrictions are normal
      alert("Your browser blocked playback. Try tapping again after interacting with the page.");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
