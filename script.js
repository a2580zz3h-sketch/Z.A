let poppedCount = 0;
let envelopeOpened = false;

function goToPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelector('[data-page="' + pageId + '"]').classList.add('active');
  if (pageId === 'balloons' && poppedCount === 0) initBalloons();
  if (pageId === 'video') loadVideo();
}

function loadVideo() {
  const iframe = document.getElementById('yt-player');
  if (iframe && !iframe.src && iframe.dataset.src) {
    iframe.src = iframe.dataset.src;
  }
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function() { goToPage(this.dataset.page); });
});

function createHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  const hearts = ['💖', '💕', '💗', '💝', '💘', '🌸', '✨'];
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (3 + Math.random() * 3) + 's';
    heart.style.animationDelay = Math.random() * 4 + 's';
    heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    container.appendChild(heart);
  }
}
createHearts();

function initBalloons() {
  const grid = document.getElementById('balloons-grid');
  if (!grid || grid.children.length > 0) return;
  const balloonEmojis = ['🎈', '🎀', '💖', '✨', '🌸', '🎁', '💕', '🌷'];
  for (let i = 0; i < 17; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = balloonEmojis[i % balloonEmojis.length];
    balloon.addEventListener('click', function() {
      if (this.classList.contains('popped')) return;
      this.classList.add('popped');
      poppedCount++;
      document.getElementById('pop-count').textContent = poppedCount;
      createConfetti();
      if (poppedCount === 17) {
        setTimeout(() => {
          document.getElementById('celebration').classList.remove('hidden');
          startFireworks();
          for (let j = 0; j < 25; j++) setTimeout(createConfetti, j * 60);
        }, 500);
      }
    });
    grid.appendChild(balloon);
  }
}

function createConfetti() {
  const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffc0cb', '#ff85a2', '#ff99cc', '#ffd1dc'];
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.left = Math.random() * 100 + 'vw';
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
  confetti.style.width = (5 + Math.random() * 10) + 'px';
  confetti.style.height = (5 + Math.random() * 10) + 'px';
  confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 4000);
}

function startFireworks() {
  const fw = document.getElementById('fireworks');
  if (!fw) return;
  const emojis = ['🎆', '🎇', '✨', '💥', '🌟', '⭐'];
  const interval = setInterval(() => {
    fw.textContent = emojis[Math.floor(Math.random() * emojis.length)] + ' ' +
                     emojis[Math.floor(Math.random() * emojis.length)] + ' ' +
                     emojis[Math.floor(Math.random() * emojis.length)];
  }, 500);
  setTimeout(() => clearInterval(interval), 6000);
}

const closeCelebrationBtn = document.getElementById('close-celebration');
if (closeCelebrationBtn) {
  closeCelebrationBtn.addEventListener('click', function() {
    document.getElementById('celebration').classList.add('hidden');
    goToPage('message');
  });
}

const envelope = document.getElementById('envelope');
const letterModal = document.getElementById('letter-modal');
if (envelope) {
  envelope.addEventListener('click', function() {
    if (!envelopeOpened) {
      this.classList.add('opened');
      envelopeOpened = true;
      document.getElementById('click-hint').style.display = 'none';
      for (let i = 0; i < 30; i++) setTimeout(createConfetti, i * 100);
    }
    if (letterModal) letterModal.classList.remove('hidden');
  });
}

const closeLetterBtn = document.getElementById('close-letter');
if (closeLetterBtn) {
  closeLetterBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    letterModal.classList.add('hidden');
  });
}
