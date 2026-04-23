// ====== PAGES SETUP ======
const pages = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
const pageNames = ['🔒 Unlock', '🎂 Birthday', '💋 Soulmates', '💌 Letter', '🎉 HBD', '📷 Memories', '🎁 Gifts', '🎵 Music'];
let current = 0;
let unlocked = false;

const tabsEl = document.getElementById('pageTabs');

pages.forEach((id, i) => {
  const tab = document.createElement('div');
  tab.className = 'page-tab' + (i === 0 ? ' active' : '');
  tab.textContent = pageNames[i];
  tab.onclick = () => { if (i === 0 || unlocked) goTo(i); };
  tabsEl.appendChild(tab);
});

function goTo(i) {
  document.getElementById(pages[current]).classList.remove('active');
  document.querySelectorAll('.page-tab')[current].classList.remove('active');
  current = i;
  document.getElementById(pages[current]).classList.add('active');
  document.querySelectorAll('.page-tab')[current].classList.add('active');
  tabsEl.children[i].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  
  // Page 8 के लिए special handling
  if (i === 7) {
    initMusicPlayer();
  }
}

function goNext() {
  if (current < pages.length - 1) goTo(current + 1);
}

// ====== PASSCODE LOGIC ======
const CORRECT = '0112';
let entered = '';

document.querySelectorAll('.numpad-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const n = btn.dataset.n;
    if (n === 'del') {
      entered = entered.slice(0, -1);
    } else if (n === '#') {
      entered = '';
    } else if (entered.length < 4) {
      entered += n;
    }
    updateBoxes();
    if (entered.length === 4) checkCode();
  });
});

function updateBoxes() {
  for (let i = 0; i < 4; i++) {
    const box = document.getElementById('cb' + i);
    box.textContent = entered[i] ? '•' : '';
    box.classList.toggle('filled', !!entered[i]);
    box.classList.remove('error');
  }
}

function checkCode() {
  if (entered === CORRECT) {
    unlocked = true;
    launchConfetti();
    setTimeout(() => goTo(1), 700);
  } else {
    for (let i = 0; i < 4; i++) {
      document.getElementById('cb' + i).classList.add('error');
    }
    setTimeout(() => {
      entered = '';
      updateBoxes();
    }, 600);
  }
}

// ====== CONFETTI & HEARTS (same as before) ======
function launchConfetti() {
  const colors = ['#5ba3e8', '#f06080', '#f0c040', '#80d090', '#d080f0', '#f08050'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      c.style.width = (6 + Math.random() * 8) + 'px';
      c.style.height = (6 + Math.random() * 8) + 'px';
      c.style.animationDelay = Math.random() * 0.5 + 's';
      c.style.animationDuration = (2 + Math.random()) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 30);
  }
}

const heartContainer = document.getElementById('fhearts');
const heartChars = ['♥', '♡', '💖', '💗'];

function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'fheart';
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (10 + Math.random() * 14) + 'px';
  h.style.color = `hsl(${340 + Math.random() * 30},70%,70%)`;
  h.style.animationDuration = (3 + Math.random() * 3) + 's';
  heartContainer.appendChild(h);
  setTimeout(() => h.remove(), 7000);
}

setInterval(spawnHeart, 1200);

// ====== MP3 MUSIC PLAYER - NEW CODE ======
let audioPlayer;
let isPlaying = false;
let progressInterval;

const playBtn = document.getElementById('playBtn');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const currTimeEl = document.getElementById('currTime');
const totalTimeEl = document.getElementById('totalTime');
const songCard = document.getElementById('songCard');
const vinyl = document.getElementById('vinyl');

function initMusicPlayer() {
  audioPlayer = document.getElementById('audioPlayer');
  
  if (!audioPlayer) {
    console.error('Audio player not found!');
    return;
  }

  // Audio events
  audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
    console.log('Song loaded:', audioPlayer.duration);
  });

  audioPlayer.addEventListener('timeupdate', () => {
    if (!isPlaying) return;
    const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = pct + '%';
    currTimeEl.textContent = formatTime(audioPlayer.currentTime);
  });

  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.textContent = '▶';
    songCard.classList.remove('playing');
    vinyl.style.animationPlayState = 'paused';
    progressFill.style.width = '0%';
    currTimeEl.textContent = '0:00';
  });

  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    playBtn.textContent = '⏸';
    songCard.classList.add('playing');
    vinyl.style.animationPlayState = 'running';
  });

  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    playBtn.textContent = '▶';
    songCard.classList.remove('playing');
    vinyl.style.animationPlayState = 'paused';
  });

  // Play button click
  playBtn.onclick = toggleMusic;
}

function toggleMusic() {
  if (!audioPlayer) {
    alert('Song loading... please wait');
    return;
  }

  if (isPlaying) {
    audioPlayer.pause();
  } else {
    audioPlayer.play();
  }
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Progress bar click
progressBar.addEventListener('click', (e) => {
  if (!audioPlayer || !audioPlayer.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const duration = audioPlayer.duration;
  const seekTime = (clickX / rect.width) * duration;
  audioPlayer.currentTime = seekTime;
});