// ---------------- Utilities -----------------
function typeText(el, text, speed = 50) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function fadeIn(elem) {
  elem.classList.remove('hidden');
}

function fadeOut(elem) {
  elem.classList.add('hidden');
}

// ---------------- Recuerdos -----------------
const recuerdos = [
    {
    imagen: 'imgs/Imagen de WhatsApp 2025-07-15 a las 18.45.53_0dee3d71.jpg',
    descripcion: 'La primera foto que tuve de ti',
    hora: 'no idea ??? '
},
    {
      imagen: 'imgs/PXL_20250708_004849225.RAW-01.COVER.jpg',
      descripcion: 'El atardecer que me recordó a ti por lo tan linda que eres',
      hora: '6:49pm lunes 7 de julio'
    },
  {
    imagen: 'imgs/PXL_20250626_165753557.jpg',
    descripcion: 'Cuando a mi mi ipad(tablet de samsung) me dijo que era tu cumpleaños',
    hora: '3:10pm 26 de junio'
  },
  {
    imagen: 'imgs/PXL_20250712_005530957.RAW-01.COVER.jpg',
    descripcion: 'Primera foto juntos despues de 7 meses y 4 días de no salir juntos',
    hora: '6:55pm viernes 11 de julio'
  },
  {
    imagen: 'imgs/Screenshot_20250629-203512.png',
    descripcion: 'Tu hermanito me dejó en visto 👎 (nunca te dejé en visto)',
    hora: '???'
  },
  {
    imagen: 'imgs/20241130_021933000_iOS.png',
    descripcion: 'Cuando se te paralizó la cara JAJAJJA',
    hora: '8:19pm 30 de noviembre'
  },
  {
    imagen: 'imgs/20241216_000004000_iOS.png',
    descripcion: 'Tus cochinadas',
    hora: '6:00pm ???'
  },
  {
    imagen: 'imgs/20241217_051119000_iOS.png',
    descripcion: 'Cuando siempre te ganaba y no lo aceptabas',
    hora: '11:11pm 17 de diciembre'
  },
  {
    imagen: 'imgs/20250106_060708000_iOS.png',
    descripcion: 'Tus cochinadas parte 2 (pitologa)',
    hora: '12:07am 6 de enero'
  },
  {
    imagen: 'imgs/Captura de pantalla 2024-11-30 113449.png',
    descripcion: 'SCRIPT${.console.log($.ajax[{Captura de pantalla 2024-11-30 113449.png}]);}',
    hora: ''
  },
  {
    imagen: 'imgs/20241207_012614782_iOS.jpg',
    descripcion: 'Mi foto favorita contigo',
    hora: '7:26pm 6 de diciembre'
  }

  // Puedes seguir agregando más recuerdos aquí...
];

// ---------------- Estado -----------------
let currentSlide = 0;
let autoInterval = null;

// Variable para prevenir múltiples swipes mientras se anima
let isAnimating = false;

// ---------------- Elements ---------------
const loadingScreen = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const soundScreen = document.getElementById('soundScreen');
const carouselScreen = document.getElementById('carouselScreen');
const finalScreen = document.getElementById('finalScreen');

const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const musicToggle = document.getElementById('musicToggle');
const autoToggle = document.getElementById('autoToggle');
const slideContainer = document.getElementById('slideContainer');
const bgMusic = document.getElementById('bgMusic');

// ------------- Inicialización ---------------
document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar elementos
  const loadingScreen = document.getElementById('loading');
  const loadingText = document.getElementById('loadingText');
  const soundScreen = document.getElementById('soundScreen');
  const carouselScreen = document.getElementById('carouselScreen');
  const finalScreen = document.getElementById('finalScreen');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const musicToggle = document.getElementById('musicToggle');
  const autoToggle = document.getElementById('autoToggle');
  const slideContainer = document.getElementById('slideContainer');
  const bgMusic = document.getElementById('bgMusic');

  // Animación inicial
  await typeText(loadingText, 'CargandoOo\n', 80);
  await new Promise(res => setTimeout(res, 20));
  await typeText(loadingText, '...', 10);
  await new Promise(res => setTimeout(res, 20));

  fadeOut(loadingScreen);
  await new Promise(res => setTimeout(res, 1000));
  fadeIn(soundScreen);

  // Inicializar gestos con opciones mejoradas
  if (carouselScreen) {
    const hammer = new Hammer(carouselScreen, {
      touchAction: 'none',
      velocity: 0.3,
      threshold: 10
    });
    
    hammer.on('swipeleft', (e) => {
      e.preventDefault?.();
      nextSlide();
    });
    
    hammer.on('swiperight', (e) => {
      e.preventDefault?.();
      prevSlide();
    });
  }

  // Prevenir comportamiento por defecto en móviles
  carouselScreen?.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  // Event listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'Escape') toggleMusic();
  });

  startBtn?.addEventListener('click', () => {
    fadeOut(soundScreen);
    setTimeout(() => {
      fadeIn(carouselScreen);
      fadeAudioIn(bgMusic);
      showSlide(0);
    }, 800);
  });

  restartBtn?.addEventListener('click', restartExperience);
  musicToggle?.addEventListener('click', toggleMusic);
  autoToggle?.addEventListener('change', (e) => {
    if (e.target.checked) {
      startAutoMode();
    } else {
      stopAutoMode();
    }
  });
});

// ------------- Funciones de música ---------------
function fadeAudioIn(audio, duration = 2000) {
  if (!audio) return;
  audio.volume = 0;
  audio.play();
  const step = 50;
  const increment = step / duration;
  const interval = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(1, audio.volume + increment);
    } else {
      clearInterval(interval);
    }
  }, step);
}

function toggleMusic() {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  if (!bgMusic || !musicToggle) return;

  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.querySelector('.btn-icon').textContent = '🎵';
  } else {
    bgMusic.pause();
    musicToggle.querySelector('.btn-icon').textContent = '🔇';
  }
}

// ------------- Slides ---------------
function showSlide(index, direction = 'none') {
  if (index < 0 || index >= recuerdos.length || isAnimating) return;
  isAnimating = true;

  const currentWrapper = document.querySelector('.photo-wrapper');
  const slideDirection = direction === 'left' ? 'sliding-left' : 'sliding-right';
  const incomingDirection = direction === 'left' ? 'sliding-in-left' : 'sliding-in-right';

  // Preparar el nuevo slide
  const recuerdo = recuerdos[index];
  const newSlideHtml = `
    <div class="photo-wrapper ${incomingDirection}">
      <img src="${recuerdo.imagen}" alt="Recuerdo ${index + 1}" class="photo" />
      <div class="caption">
        <p>${recuerdo.descripcion}</p>
        <small>${recuerdo.hora}</small>
      </div>
    </div>`;

  if (currentWrapper) {
    // Animar salida del slide actual
    currentWrapper.classList.add(slideDirection);
    
    setTimeout(() => {
      slideContainer.innerHTML = newSlideHtml;
      currentSlide = index;
      
      // Forzar reflow
      slideContainer.offsetHeight;
      
      // Animar entrada del nuevo slide
      const newWrapper = document.querySelector('.photo-wrapper');
      requestAnimationFrame(() => {
        newWrapper.classList.remove(incomingDirection);
      });

      setTimeout(() => {
        isAnimating = false;
      }, 400);
    }, 400);
  } else {
    // Primer slide o sin slide actual
    slideContainer.innerHTML = newSlideHtml;
    currentSlide = index;
    requestAnimationFrame(() => {
      const newWrapper = document.querySelector('.photo-wrapper');
      newWrapper.classList.remove(incomingDirection);
    });
    setTimeout(() => {
      isAnimating = false;
    }, 400);
  }
}

function nextSlide() {
  if (currentSlide < recuerdos.length - 1) {
    showSlide(currentSlide + 1, 'left');
  } else {
    endExperience();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1, 'right');
  }
}

function startAutoMode() {
  autoInterval = setInterval(nextSlide, 6000);
}

function stopAutoMode() {
  clearInterval(autoInterval);
  autoInterval = null;
}

function endExperience() {
  fadeOut(carouselScreen);
  setTimeout(() => {
    fadeIn(finalScreen);
  }, 1000);
  stopAutoMode();
}

function restartExperience() {
  fadeOut(finalScreen);
  currentSlide = 0;
  setTimeout(() => {
    fadeIn(carouselScreen);
    showSlide(0);
  }, 1000);
  bgMusic.currentTime = 0;
  bgMusic.play();
}

// ------------- Partículas ---------------
particlesJS('particles-js', {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle'
    },
    opacity: {
      value: 0.2,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.3,
        sync: false
      }
    },
    line_linked: {
      enable: false,
      distance: 150,
      color: '#ffffff',
      opacity: 0.1,
      width: 1
    },
    move: {
      enable: true,
      speed: 4,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: true,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false
      },
      onclick: {
        enable: false
      },
      resize: true
    }
  },
  retina_detect: true
}); 