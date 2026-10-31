/**
 * Rushikesh & Prajakta — Wedding Invitation Interactive Script
 * Fully standalone, zero external server dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. FLOATING PETALS & BUTTERFLIES GENERATOR
  // ==========================================
  const petalsContainer = document.getElementById('floating-petals-container');
  if (petalsContainer) {
    const emojis = ['🌸', '🌿', '🌼', '🦋'];
    const totalPetals = 18;

    for (let i = 0; i < totalPetals; i++) {
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 12;
      const duration = 15 + Math.random() * 15;
      const delay = Math.random() * 12;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      if (emoji === '🦋') {
        const img = document.createElement('img');
        img.src = 'assets/butterfly-B1dW_pQD.gif';
        img.alt = '';
        img.className = 'absolute animate-float-petal';
        img.style.left = `${left}%`;
        img.style.top = '-10vh';
        img.style.width = `${size + 8}px`;
        img.style.height = 'auto';
        img.style.animationDuration = `${duration}s`;
        img.style.animationDelay = `${delay}s`;
        img.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))';
        petalsContainer.appendChild(img);
      } else {
        const span = document.createElement('span');
        span.className = 'absolute animate-float-petal';
        span.style.left = `${left}%`;
        span.style.top = '-10vh';
        span.style.fontSize = `${size}px`;
        span.style.animationDuration = `${duration}s`;
        span.style.animationDelay = `${delay}s`;
        span.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
        span.textContent = emoji;
        petalsContainer.appendChild(span);
      }
    }
  }

  // ==========================================
  // 2. BACKGROUND MUSIC CONTROLLER
  // ==========================================
  const audio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-btn');

  if (audio && musicBtn) {
    audio.volume = 0.4;

    const updateMusicButton = (isPlaying) => {
      if (isPlaying) {
        musicBtn.textContent = '🔊';
        musicBtn.setAttribute('aria-label', 'Mute music');
      } else {
        musicBtn.textContent = '🔇';
        musicBtn.setAttribute('aria-label', 'Play music');
      }
    };

    musicBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => updateMusicButton(true)).catch(() => updateMusicButton(false));
      } else {
        audio.pause();
        updateMusicButton(false);
      }
    });
  }

  // ==========================================
  // 3. ENVELOPE OPENING & TRANSITION
  // ==========================================
  const envelopeScreen = document.getElementById('envelope-screen');
  const invitationContent = document.getElementById('invitation-content');
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');

  if (openEnvelopeBtn && envelopeScreen && invitationContent) {
    openEnvelopeBtn.addEventListener('click', () => {
      // Fade out envelope screen
      envelopeScreen.classList.add('hidden-screen');

      // Reveal invitation content
      invitationContent.classList.remove('hidden-screen');
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Start music automatically
      if (audio) {
        audio.volume = 0.4;
        audio.play().then(() => {
          if (musicBtn) {
            musicBtn.textContent = '🔊';
            musicBtn.setAttribute('aria-label', 'Mute music');
          }
        }).catch(() => {
          // Browser autoplay restriction, user can click music button
        });
      }

      // Initialize scratch card after invitation is shown
      setTimeout(initScratchCard, 100);
    });
  }

  // ==========================================
  // 4. LIVE WEDDING COUNTDOWN TIMER
  // ==========================================
  const targetDate = new Date("2026-07-19T15:48:00+05:30").getTime();
  const daysVal = document.getElementById('days-val');
  const hoursVal = document.getElementById('hours-val');
  const minutesVal = document.getElementById('minutes-val');
  const secondsVal = document.getElementById('seconds-val');

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (daysVal) daysVal.textContent = String(d).padStart(2, '0');
    if (hoursVal) hoursVal.textContent = String(h).padStart(2, '0');
    if (minutesVal) minutesVal.textContent = String(m).padStart(2, '0');
    if (secondsVal) secondsVal.textContent = String(s).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 5. CONFETTI EFFECT
  // ==========================================
  function fireConfetti(x, y) {
    if (typeof confetti !== 'function') return;
    const colors = ['#d4a373', '#c87e5a', '#e8b4b8', '#f4d03f', '#f5b7b1', '#7a8a6a'];
    const r = x / window.innerWidth;
    const i = y / window.innerHeight;

    confetti({
      particleCount: 140,
      spread: 100,
      startVelocity: 45,
      origin: { x: r, y: i },
      colors: colors,
      disableForReducedMotion: true
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { x: Math.max(0, r - 0.15), y: i },
        colors: colors
      });
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { x: Math.min(1, r + 0.15), y: i },
        colors: colors
      });
    }, 180);
  }

  // ==========================================
  // 6. INTERACTIVE SCRATCH CARD
  // ==========================================
  function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;
    let revealed = false;

    function renderCanvas() {
      if (revealed) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Gold shimmer gradient
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, '#d8b078');
      grad.addColorStop(0.5, '#e8c89a');
      grad.addColorStop(1, '#b8893f');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Scratch to reveal prompt text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = "600 14px 'Cinzel', serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦  SCRATCH TO REVEAL  ✦', rect.width / 2, rect.height / 2);

      // Mask operation
      ctx.globalCompositeOperation = 'destination-out';
    }

    renderCanvas();

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function scratch(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkReveal() {
      if (revealed) return;
      const { width, height } = canvas;
      const imgData = ctx.getImageData(0, 0, width, height).data;
      let transparent = 0;
      let total = 0;

      for (let i = 0; i < imgData.length; i += 32) {
        total++;
        if (imgData[i + 3] === 0) transparent++;
      }

      if (transparent / total > 0.3) {
        revealed = true;
        canvas.classList.remove('opacity-100');
        canvas.classList.add('opacity-0', 'pointer-events-none');

        const rect = canvas.getBoundingClientRect();
        fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      isDrawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });

    const stopDrawing = () => {
      if (isDrawing) {
        isDrawing = false;
        checkReveal();
      }
    };

    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    window.addEventListener('resize', () => {
      if (!revealed) renderCanvas();
    });
  }
});
