/* ==========================================================================
   PRESET TOPICS DATABASE
   ========================================================================== */
const PRESETS = [
  {
    category: "social-studies",
    text: "This House believes that social media platforms should be regulated as public utilities rather than private enterprises."
  },
  {
    category: "social-studies",
    text: "Should artificial intelligence creators be legally liable for the social impact and bias of their algorithms?"
  },
  {
    category: "social-studies",
    text: "Is the rise of remote work eroding local community cohesion and civil engagement?"
  },
  {
    category: "social-studies",
    text: "Should media literacy be a mandatory core curriculum subject in secondary schools?"
  },
  {
    category: "history",
    text: "Should historic cultural artifacts be returned to their countries of origin, even if their safety cannot be guaranteed?"
  },
  {
    category: "history",
    text: "Has the invention of the printing press had a more profound impact on modern democracy than the creation of the internet?"
  },
  {
    category: "history",
    text: "Should history curriculums prioritize the study of social movements and ordinary citizens over political and military leaders?"
  },
  {
    category: "history",
    text: "Did the industrial revolution do more to degrade the quality of human life than to improve it?"
  },
  {
    category: "geography",
    text: "Is rapid urbanization the single greatest threat to global environmental sustainability?"
  },
  {
    category: "geography",
    text: "Should international fresh water resources be managed by a global governing body rather than sovereign states?"
  },
  {
    category: "geography",
    text: "Are geographical borders becoming increasingly irrelevant in an interconnected, digital global economy?"
  },
  {
    category: "geography",
    text: "Should ecotourism in ecologically fragile regions be restricted to prevent environmental degradation?"
  },
  {
    category: "civics",
    text: "Should voting in national elections be compulsory, with financial penalties for non-participation?"
  },
  {
    category: "civics",
    text: "Is a direct digital democracy model superior to representative democracy for the modern age?"
  },
  {
    category: "civics",
    text: "Should the voting age be lowered to 16 for local, state, and national elections?"
  },
  {
    category: "civics",
    text: "Should all political campaign funding be purely public, banning any corporate or private donations?"
  },
  {
    category: "science",
    text: "Should governments ban the development of fully autonomous lethal weapons systems?"
  },
  {
    category: "science",
    text: "Is human colonization of other planets a necessary safeguard for our species' long-term survival?"
  },
  {
    category: "science",
    text: "Should genetic modification in humans be restricted solely to curing inherited diseases?"
  },
  {
    category: "science",
    text: "Should all scientific research that receives public funding be published with free open access to the general public?"
  }
];

/* ==========================================================================
   COLOR SCHEMES (RGB for Canvas Interpolation)
   ========================================================================== */
const THEME_COLORS = {
  "social-studies": { r: 255, g: 107, b: 107 },
  "history": { r: 212, g: 175, b: 55 },
  "geography": { r: 0, g: 250, b: 154 },
  "civics": { r: 65, g: 105, b: 225 },
  "science": { r: 0, g: 245, b: 255 }
};

/* ==========================================================================
   APP STATE MANAGEMENT
   ========================================================================== */
const state = {
  theme: "social-studies",
  topic: "This House believes that artificial intelligence will enhance human potential rather than replace it.",
  statusText: "LIVE DEBATE",
  motionLabel: "MOTION ON THE FLOOR",
  
  // Opponent speakers
  sideATitle: "PROPOSITION",
  sideASpeakers: ["Speaker 1", "Speaker 2"],
  sideBTitle: "OPPOSITION",
  sideBSpeakers: ["Speaker 1", "Speaker 2"],
  
  // Timer settings
  timerDuration: 180, // Default 3 minutes in seconds
  timerTimeLeft: 180,
  timerIsRunning: false,
  timerIntervalId: null,
  
  // Animation settings
  particleCount: 60,
  particleSpeedFactor: 1.0
};

/* ==========================================================================
   UI ELEMENT REFERENCES
   ========================================================================== */
const DOM = {
  body: document.body,
  canvas: document.getElementById("ambient-canvas"),
  liveClock: document.getElementById("live-clock"),
  
  // Display Screen elements
  displayStatus: document.getElementById("display-status"),
  displayMotionLabel: document.getElementById("display-motion-label"),
  displayTopic: document.getElementById("display-topic"),
  displayTimer: document.getElementById("display-timer"),
  timerProgressRing: document.getElementById("timer-progress-ring"),
  timerCard: document.querySelector(".timer-card"),
  timerStatusLabel: document.getElementById("timer-status-label"),
  displaySideATitle: document.getElementById("display-side-a-title"),
  displaySideASpeakers: document.getElementById("display-side-a-speakers"),
  displaySideBTitle: document.getElementById("display-side-b-title"),
  displaySideBSpeakers: document.getElementById("display-side-b-speakers"),
  
  // Dock items
  dockItems: document.querySelectorAll(".dock-item"),
  
  // Control Panel elements
  openControlBtn: document.getElementById("open-control-panel"),
  closeControlBtn: document.getElementById("close-control-panel"),
  controlModal: document.getElementById("control-modal"),
  modalBackdrop: document.getElementById("modal-backdrop"),
  btnSaveApply: document.getElementById("btn-save-apply"),
  
  // Inputs
  inputTopic: document.getElementById("input-topic"),
  inputTimerMin: document.getElementById("input-timer-min"),
  inputTimerSec: document.getElementById("input-timer-sec"),
  inputStatusText: document.getElementById("input-status-text"),
  inputMotionLabel: document.getElementById("input-motion-label"),
  inputSideATitle: document.getElementById("input-side-a-title"),
  inputSideBTitle: document.getElementById("input-side-b-title"),
  inputSideASpeakers: document.getElementById("input-side-a-speakers"),
  inputSideBSpeakers: document.getElementById("input-side-b-speakers"),
  sliderParticleCount: document.getElementById("slider-particle-count"),
  sliderParticleSpeed: document.getElementById("slider-particle-speed"),
  
  valParticleCount: document.getElementById("val-particle-count"),
  valParticleSpeed: document.getElementById("val-particle-speed"),
  
  // Presets and Buttons
  presetCatTabs: document.querySelectorAll(".preset-cat-tab"),
  presetsGrid: document.getElementById("presets-grid"),
  btnTimerToggle: document.getElementById("btn-timer-toggle"),
  btnTimerReset: document.getElementById("btn-timer-reset")
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  initClock();
  initThemeDock();
  initControlPanel();
  initTimer();
  initCanvas();
  renderPresets("all");
  applyStateToUI();
});

/* ==========================================================================
   CLOCK & TIME DISPLAY
   ========================================================================== */
function initClock() {
  const updateClock = () => {
    const now = new Date();
    
    // Formatting date and time e.g., "Thu, Jul 9, 2026 | 08:15:27 AM"
    const optionsDate = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', optionsDate);
    
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeString = now.toLocaleTimeString('en-US', optionsTime);
    
    DOM.liveClock.textContent = `${dateString} | ${timeString}`;
  };
  
  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   LOCAL STORAGE PERSISTENCE
   ========================================================================== */
function saveToLocalStorage() {
  localStorage.setItem("holy_angels_debate_state", JSON.stringify({
    theme: state.theme,
    topic: state.topic,
    statusText: state.statusText,
    motionLabel: state.motionLabel,
    timerDuration: state.timerDuration,
    particleCount: state.particleCount,
    particleSpeedFactor: state.particleSpeedFactor,
    sideATitle: state.sideATitle,
    sideASpeakers: state.sideASpeakers,
    sideBTitle: state.sideBTitle,
    sideBSpeakers: state.sideBSpeakers
  }));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("holy_angels_debate_state");
  if (data) {
    try {
      const saved = JSON.parse(data);
      if (saved.theme) state.theme = saved.theme;
      if (saved.topic) state.topic = saved.topic;
      if (saved.statusText) state.statusText = saved.statusText;
      if (saved.motionLabel) state.motionLabel = saved.motionLabel;
      if (saved.timerDuration !== undefined) {
        state.timerDuration = saved.timerDuration;
        state.timerTimeLeft = saved.timerDuration;
      }
      if (saved.particleCount !== undefined) state.particleCount = Number(saved.particleCount);
      if (saved.particleSpeedFactor !== undefined) state.particleSpeedFactor = Number(saved.particleSpeedFactor);
      if (saved.sideATitle) state.sideATitle = saved.sideATitle;
      if (saved.sideASpeakers) state.sideASpeakers = saved.sideASpeakers;
      if (saved.sideBTitle) state.sideBTitle = saved.sideBTitle;
      if (saved.sideBSpeakers) state.sideBSpeakers = saved.sideBSpeakers;
    } catch (e) {
      console.error("Error loading state from localStorage", e);
    }
  }
}

/* ==========================================================================
   THEME NAVIGATION & ANIMATIONS
   ========================================================================== */
function initThemeDock() {
  DOM.dockItems.forEach(item => {
    item.addEventListener("click", () => {
      const selectedTheme = item.getAttribute("data-theme");
      switchTheme(selectedTheme);
    });
  });
}

function switchTheme(newTheme) {
  if (state.theme === newTheme) return;
  
  // Transition background color on body
  DOM.body.className = `theme-${newTheme}`;
  state.theme = newTheme;
  
  // Update dock active status
  DOM.dockItems.forEach(btn => {
    if (btn.getAttribute("data-theme") === newTheme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  // Interpolate particle colors in canvas
  const color = THEME_COLORS[newTheme];
  if (particles && particles.length > 0) {
    particles.forEach(p => {
      p.targetColor = { ...color };
      p.colorTransitionProgress = 0;
    });
  }
  
  saveToLocalStorage();
}

/* ==========================================================================
   DEBATE TIMER LOGIC
   ========================================================================== */
function initTimer() {
  // Sync timer control buttons inside modal
  DOM.btnTimerToggle.addEventListener("click", toggleTimer);
  DOM.btnTimerReset.addEventListener("click", resetTimer);
  
  // Handle preset quick timer selections
  document.querySelectorAll(".quick-timer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const seconds = parseInt(btn.getAttribute("data-time"), 10);
      setTimerDuration(seconds);
    });
  });
  
  // Handle manual input fields in modal
  const handleManualTimeInput = () => {
    const min = parseInt(DOM.inputTimerMin.value, 10) || 0;
    const sec = parseInt(DOM.inputTimerSec.value, 10) || 0;
    const totalSeconds = (min * 60) + sec;
    setTimerDuration(totalSeconds);
  };
  
  DOM.inputTimerMin.addEventListener("change", handleManualTimeInput);
  DOM.inputTimerSec.addEventListener("change", handleManualTimeInput);
  
  updateTimerUI();
}

function setTimerDuration(seconds) {
  state.timerDuration = seconds;
  state.timerTimeLeft = seconds;
  
  // Update inputs in modal
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  DOM.inputTimerMin.value = minutes;
  DOM.inputTimerSec.value = remainingSeconds;
  
  if (state.timerIsRunning) {
    pauseTimer();
  }
  
  updateTimerUI();
  saveToLocalStorage();
}

function toggleTimer() {
  if (state.timerIsRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (state.timerTimeLeft <= 0) return;
  
  state.timerIsRunning = true;
  DOM.btnTimerToggle.classList.add("btn-secondary");
  DOM.btnTimerToggle.classList.remove("btn-primary");
  DOM.btnTimerToggle.querySelector("span").textContent = "Pause";
  DOM.btnTimerToggle.querySelector("svg path").setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z"); // Pause icon
  
  DOM.timerStatusLabel.textContent = "DEBATE IN PROGRESS";
  
  state.timerIntervalId = setInterval(() => {
    state.timerTimeLeft--;
    
    if (state.timerTimeLeft <= 0) {
      clearInterval(state.timerIntervalId);
      state.timerTimeLeft = 0;
      state.timerIsRunning = false;
      playBuzzer();
      handleTimerExpiration();
    }
    
    updateTimerUI();
  }, 1000);
}

function pauseTimer() {
  state.timerIsRunning = false;
  clearInterval(state.timerIntervalId);
  DOM.btnTimerToggle.classList.add("btn-primary");
  DOM.btnTimerToggle.classList.remove("btn-secondary");
  DOM.btnTimerToggle.querySelector("span").textContent = "Resume";
  DOM.btnTimerToggle.querySelector("svg path").setAttribute("d", "M8 5v14l11-7z"); // Play icon
  
  DOM.timerStatusLabel.textContent = "TIMER PAUSED";
}

function resetTimer() {
  pauseTimer();
  state.timerTimeLeft = state.timerDuration;
  DOM.timerStatusLabel.textContent = "SPEAKER TIME";
  DOM.btnTimerToggle.querySelector("span").textContent = "Start";
  updateTimerUI();
}

function updateTimerUI() {
  // Format digits
  const min = Math.floor(state.timerTimeLeft / 60);
  const sec = state.timerTimeLeft % 60;
  const digits = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  
  DOM.displayTimer.textContent = digits;
  
  // Radial Progress Ring Offset logic
  const ringCircumference = 339.29; // 2 * PI * 54
  let offset = ringCircumference;
  if (state.timerDuration > 0) {
    const percentage = state.timerTimeLeft / state.timerDuration;
    offset = ringCircumference - (percentage * ringCircumference);
  }
  DOM.timerProgressRing.style.strokeDashoffset = offset;
  
  // Low time visual alerts (warning visual cue at last 30s)
  if (state.timerTimeLeft <= 30 && state.timerDuration > 30 && state.timerTimeLeft > 0) {
    DOM.timerCard.classList.add("timer-warning");
  } else {
    DOM.timerCard.classList.remove("timer-warning");
  }
}

function handleTimerExpiration() {
  DOM.btnTimerToggle.querySelector("span").textContent = "Start";
  DOM.timerStatusLabel.textContent = "TIME EXPIRED";
  DOM.timerCard.classList.remove("timer-warning");
  
  // Visual Flash on border
  let flashCount = 0;
  const flashInterval = setInterval(() => {
    DOM.timerCard.classList.toggle("timer-warning");
    flashCount++;
    if (flashCount >= 6) {
      clearInterval(flashInterval);
      DOM.timerCard.classList.remove("timer-warning");
    }
  }, 350);
}

// Built-in Synthesized Alert Beep (Offline compatible using Web Audio API)
function playBuzzer() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + dur - 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };
    
    // Triple premium bell beep
    playTone(587.33, ctx.currentTime, 0.25); // D5
    playTone(587.33, ctx.currentTime + 0.3, 0.25); // D5
    playTone(783.99, ctx.currentTime + 0.6, 0.45); // G5
  } catch (e) {
    console.error("Audio Context buzzer failed", e);
  }
}

/* ==========================================================================
   TEXT AUTO-SCALING LEGIBILITY
   ========================================================================== */
function adjustTopicFontSize() {
  const text = state.topic;
  let fontSize;
  
  // Responsive rules scaling with character count
  if (text.length > 120) {
    fontSize = "clamp(1.5rem, 2vw, 2.2rem)";
  } else if (text.length > 70) {
    fontSize = "clamp(1.8rem, 2.6vw, 2.8rem)";
  } else {
    fontSize = "clamp(2.2rem, 3.2vw, 3.4rem)";
  }
  
  DOM.displayTopic.style.fontSize = fontSize;
}

/* ==========================================================================
   CONTROL MODAL DASHBOARD
   ========================================================================== */
function initControlPanel() {
  // Opening Modal
  const openModal = () => {
    DOM.controlModal.classList.add("open");
    DOM.controlModal.setAttribute("aria-hidden", "false");
    
    // Fill inputs with current state
    DOM.inputTopic.value = state.topic;
    DOM.inputStatusText.value = state.statusText;
    DOM.inputMotionLabel.value = state.motionLabel;
    
    DOM.inputSideATitle.value = state.sideATitle;
    DOM.inputSideBTitle.value = state.sideBTitle;
    DOM.inputSideASpeakers.value = state.sideASpeakers.join("\n");
    DOM.inputSideBSpeakers.value = state.sideBSpeakers.join("\n");
    
    const minutes = Math.floor(state.timerDuration / 60);
    const seconds = state.timerDuration % 60;
    DOM.inputTimerMin.value = minutes;
    DOM.inputTimerSec.value = seconds;
    
    DOM.sliderParticleCount.value = state.particleCount;
    DOM.valParticleCount.textContent = state.particleCount;
    DOM.sliderParticleSpeed.value = state.particleSpeedFactor;
    DOM.valParticleSpeed.textContent = `${state.particleSpeedFactor}x`;
  };

  // Closing Modal
  const closeModal = () => {
    DOM.controlModal.classList.remove("open");
    DOM.controlModal.setAttribute("aria-hidden", "true");
  };

  DOM.openControlBtn.addEventListener("click", openModal);
  DOM.closeControlBtn.addEventListener("click", closeModal);
  DOM.modalBackdrop.addEventListener("click", closeModal);

  // Esc key shortcut and closing triggers
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (DOM.controlModal.classList.contains("open")) {
        closeModal();
      } else {
        openModal();
      }
    }
  });

  // Slider controls dynamic visuals
  DOM.sliderParticleCount.addEventListener("input", (e) => {
    DOM.valParticleCount.textContent = e.target.value;
    state.particleCount = Number(e.target.value);
    resizeCanvas(); // Re-creates particle arrays
  });

  DOM.sliderParticleSpeed.addEventListener("input", (e) => {
    const val = Number(e.target.value).toFixed(1);
    DOM.valParticleSpeed.textContent = `${val}x`;
    state.particleSpeedFactor = Number(val);
  });

  // Handle Preset tabs selection
  DOM.presetCatTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      DOM.presetCatTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderPresets(tab.getAttribute("data-cat"));
    });
  });

  // Real-time update listeners to see changes live in background
  DOM.inputTopic.addEventListener("input", (e) => {
    state.topic = e.target.value;
    DOM.displayTopic.textContent = state.topic;
    adjustTopicFontSize();
  });

  DOM.inputStatusText.addEventListener("input", (e) => {
    state.statusText = e.target.value.toUpperCase();
    DOM.displayStatus.textContent = state.statusText;
  });

  DOM.inputMotionLabel.addEventListener("input", (e) => {
    state.motionLabel = e.target.value.toUpperCase();
    DOM.displayMotionLabel.textContent = state.motionLabel;
  });

  // Real-time update listeners for opponents
  DOM.inputSideATitle.addEventListener("input", (e) => {
    state.sideATitle = e.target.value.toUpperCase();
    DOM.displaySideATitle.textContent = state.sideATitle;
  });

  DOM.inputSideBTitle.addEventListener("input", (e) => {
    state.sideBTitle = e.target.value.toUpperCase();
    DOM.displaySideBTitle.textContent = state.sideBTitle;
  });

  DOM.inputSideASpeakers.addEventListener("input", (e) => {
    state.sideASpeakers = e.target.value.split("\n");
    updateSpeakersUI();
  });

  DOM.inputSideBSpeakers.addEventListener("input", (e) => {
    state.sideBSpeakers = e.target.value.split("\n");
    updateSpeakersUI();
  });

  // Apply and Close
  DOM.btnSaveApply.addEventListener("click", () => {
    state.topic = DOM.inputTopic.value;
    state.statusText = DOM.inputStatusText.value.toUpperCase();
    state.motionLabel = DOM.inputMotionLabel.value.toUpperCase();
    
    state.sideATitle = DOM.inputSideATitle.value.toUpperCase();
    state.sideBTitle = DOM.inputSideBTitle.value.toUpperCase();
    state.sideASpeakers = DOM.inputSideASpeakers.value.split("\n");
    state.sideBSpeakers = DOM.inputSideBSpeakers.value.split("\n");
    
    // Save to localStorage
    saveToLocalStorage();
    applyStateToUI();
    closeModal();
  });
}

// Render presets inside the modal card container
function renderPresets(category) {
  DOM.presetsGrid.innerHTML = "";
  const filtered = category === "all" ? PRESETS : PRESETS.filter(p => p.category === category);
  
  filtered.forEach(preset => {
    const btn = document.createElement("button");
    btn.className = "preset-item-btn";
    btn.textContent = preset.text;
    btn.setAttribute("title", `Click to load: "${preset.text}"`);
    
    btn.addEventListener("click", () => {
      state.topic = preset.text;
      DOM.inputTopic.value = preset.text;
      DOM.displayTopic.textContent = preset.text;
      adjustTopicFontSize();
      
      // Auto-adapt theme to the preset's subject class
      switchTheme(preset.category);
    });
    
    DOM.presetsGrid.appendChild(btn);
  });
}

function applyStateToUI() {
  DOM.displayTopic.textContent = state.topic;
  DOM.displayStatus.textContent = state.statusText;
  DOM.displayMotionLabel.textContent = state.motionLabel;
  
  DOM.displaySideATitle.textContent = state.sideATitle;
  DOM.displaySideBTitle.textContent = state.sideBTitle;
  updateSpeakersUI();
  
  DOM.body.className = `theme-${state.theme}`;
  
  DOM.dockItems.forEach(btn => {
    if (btn.getAttribute("data-theme") === state.theme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  adjustTopicFontSize();
}

function updateSpeakersUI() {
  DOM.displaySideASpeakers.innerHTML = "";
  state.sideASpeakers.forEach(name => {
    if (name.trim()) {
      const li = document.createElement("li");
      li.textContent = name.trim();
      DOM.displaySideASpeakers.appendChild(li);
    }
  });
  
  DOM.displaySideBSpeakers.innerHTML = "";
  state.sideBSpeakers.forEach(name => {
    if (name.trim()) {
      const li = document.createElement("li");
      li.textContent = name.trim();
      DOM.displaySideBSpeakers.appendChild(li);
    }
  });
}

/* ==========================================================================
   AMBIENT INTERACTIVE PARTICLE PHYSICS ENGINE
   ========================================================================== */
let ctx;
let particles = [];
let animationFrameId;

class Particle {
  constructor(canvasWidth, canvasHeight, startColor) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
    
    // Core colors and transition dynamics
    this.currentColor = { ...startColor };
    this.targetColor = { ...startColor };
    this.colorTransitionProgress = 1; // Completed
  }
  
  update(canvasWidth, canvasHeight, speedMultiplier) {
    this.x += this.vx * speedMultiplier;
    this.y += this.vy * speedMultiplier;
    
    // Wall bounces
    if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
    if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
    
    // Prevent particles escaping borders on size reductions
    if (this.x < -10) this.x = canvasWidth + 5;
    if (this.x > canvasWidth + 10) this.x = -5;
    if (this.y < -10) this.y = canvasHeight + 5;
    if (this.y > canvasHeight + 10) this.y = -5;
    
    // Interpolate rgb colors smoothly
    if (this.colorTransitionProgress < 1) {
      this.colorTransitionProgress += 0.02; // Transition over 50 frames
      if (this.colorTransitionProgress > 1) this.colorTransitionProgress = 1;
      
      this.currentColor.r = Math.round(
        this.currentColor.r + (this.targetColor.r - this.currentColor.r) * this.colorTransitionProgress
      );
      this.currentColor.g = Math.round(
        this.currentColor.g + (this.targetColor.g - this.currentColor.g) * this.colorTransitionProgress
      );
      this.currentColor.b = Math.round(
        this.currentColor.b + (this.targetColor.b - this.currentColor.b) * this.colorTransitionProgress
      );
    }
  }
  
  draw(ctx) {
    const { r, g, b } = this.currentColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
    ctx.fill();
  }
}

function initCanvas() {
  ctx = DOM.canvas.getContext("2d");
  
  // Set up dimensions
  resizeCanvas();
  
  // Window resize handler
  window.addEventListener("resize", () => {
    resizeCanvas();
    adjustTopicFontSize();
  });
  
  // Start drawing loop
  drawLoop();
}

function resizeCanvas() {
  DOM.canvas.width = window.innerWidth;
  DOM.canvas.height = window.innerHeight;
  
  // Initialize or adjust particle populations
  const count = state.particleCount;
  const startColor = THEME_COLORS[state.theme];
  
  if (particles.length === 0) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(DOM.canvas.width, DOM.canvas.height, startColor));
    }
  } else if (particles.length < count) {
    // Add particles
    const diff = count - particles.length;
    for (let i = 0; i < diff; i++) {
      particles.push(new Particle(DOM.canvas.width, DOM.canvas.height, startColor));
    }
  } else if (particles.length > count) {
    // Slice extra particles
    particles = particles.slice(0, count);
  }
}

function drawLoop() {
  ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
  
  const w = DOM.canvas.width;
  const h = DOM.canvas.height;
  const speed = state.particleSpeedFactor;
  
  // 1. Update and Draw Particles
  particles.forEach(p => {
    p.update(w, h, speed);
    p.draw(ctx);
  });
  
  // 2. Draw Connection Lines between neighboring particles
  ctx.lineWidth = 0.55;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Limit connecting distance (e.g. 115px)
      if (dist < 115) {
        const alpha = (1 - dist / 115) * 0.16;
        const colorVal = p1.currentColor;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${colorVal.r}, ${colorVal.g}, ${colorVal.b}, ${alpha})`;
        ctx.stroke();
      }
    }
  }
  
  // Hardware-accelerated infinite animation loop
  animationFrameId = requestAnimationFrame(drawLoop);
}
