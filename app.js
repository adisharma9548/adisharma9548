/**
 * ============================================================================
 * 🌸 ADI SHARMA (@adisharma9548) - ANIME DEV LOUNGE CORE JAVASCRIPT
 * Features:
 * 1. Procedural Lo-Fi Ambient Audio Synthesizer (Web Audio API)
 * 2. Interactive Sakura Petals & Cosmic Starfield Canvas Engine
 * 3. Cyber CLI Terminal with Neofetch, Matrix, and Shell Commands
 * 4. Live GitHub Repositories Telemetry via GitHub REST API
 * 5. Modern Theme Switcher & Intersection Observer Scroll Fallbacks
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
   * 1. AMBIENT SAKURA & STARFIELD CANVAS ENGINE
   * -------------------------------------------------------------------------- */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track mouse for wind effect
  let mouse = { x: width / 2, y: height / 2, targetX: width / 2 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const petals = [];
  const petalCount = window.innerWidth < 768 ? 25 : 55;
  const stars = [];
  const starCount = window.innerWidth < 768 ? 40 : 90;

  // Sakura Petal Object
  class SakuraPetal {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.5 - 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.4 + 0.4;
      this.color = Math.random() > 0.3 ? 'rgba(255, 182, 193,' : 'rgba(255, 121, 198,';
    }
    update() {
      // Wind reaction towards mouse X position
      const wind = (mouse.x - width / 2) * 0.0003;
      this.x += this.speedX + wind;
      this.y += this.speedY;
      this.angle += this.spinSpeed;

      if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size * 1.3);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fillStyle = `${this.color} ${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // Ambient Star Object
  class Star {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random();
      this.alphaSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
    }
    update() {
      this.alpha += this.alphaSpeed;
      if (this.alpha <= 0.1 || this.alpha >= 0.8) {
        this.alphaSpeed = -this.alphaSpeed;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(189, 147, 249, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < petalCount; i++) petals.push(new SakuraPetal());
  for (let i = 0; i < starCount; i++) stars.push(new Star());

  // Animation Loop respecting prefers-reduced-motion
  let animationId = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.update();
      star.draw();
    });

    petals.forEach((petal) => {
      petal.update();
      petal.draw();
    });

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(animateCanvas);
    }
  }

  if (!prefersReducedMotion) {
    animateCanvas();
  }

  /* --------------------------------------------------------------------------
   * 2. PROCEDURAL LO-FI CHILL AUDIO SYNTHESIZER (WEB AUDIO API)
   * -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isPlaying = false;
  let chordInterval = null;
  let noiseNode = null;
  let masterGain = null;
  let currentTrackIdx = 0;

  const tracks = [
    { title: "Tokyo Midnight Chords", bpm: 72, chords: [[174.61, 220.00, 261.63, 329.63], [164.81, 196.00, 246.94, 293.66], [146.83, 174.61, 220.00, 261.63], [130.81, 164.81, 196.00, 246.94]] },
    { title: "Rainy Sakura Memories", bpm: 65, chords: [[130.81, 164.81, 196.00, 246.94], [146.83, 174.61, 220.00, 293.66], [164.81, 196.00, 246.94, 329.63], [110.00, 146.83, 174.61, 220.00]] },
    { title: "Cyberpunk Chill Session", bpm: 78, chords: [[220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 369.99], [164.81, 207.65, 246.94, 311.13]] },
    { title: "Matcha Morning Dreams", bpm: 68, chords: [[146.83, 185.00, 220.00, 277.18], [196.00, 246.94, 293.66, 369.99], [164.81, 196.00, 246.94, 329.63], [130.81, 164.81, 196.00, 246.94]] }
  ];

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      const volSlider = document.getElementById('lofi-volume');
      masterGain.gain.value = volSlider ? parseFloat(volSlider.value) : 0.4;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Create subtle vinyl noise texture
  function startVinylTexture() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter
      lastOut = (lastOut * 0.95) + (white * 0.05);
      // Soft crackle pops
      const crackle = Math.random() > 0.9992 ? (Math.random() * 0.2 - 0.1) : 0;
      data[i] = (lastOut * 0.015) + crackle;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 1800;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.12;

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseNode.start();
  }

  // Play a lush warm electric piano chord
  function playChord(frequencies) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;

    frequencies.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle detune for warm vintage character
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 2.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 3.4);
    });
  }

  function startLoFiMusic() {
    initAudio();
    startVinylTexture();

    const track = tracks[currentTrackIdx];
    let step = 0;
    const intervalMs = (60 / track.bpm) * 4 * 1000;

    playChord(track.chords[0]);
    step = 1;

    chordInterval = setInterval(() => {
      playChord(track.chords[step % track.chords.length]);
      step++;
    }, intervalMs);

    isPlaying = true;
    updateAudioUI(true);
  }

  function stopLoFiMusic() {
    if (chordInterval) clearInterval(chordInterval);
    if (noiseNode) {
      try { noiseNode.stop(); } catch (e) {}
      noiseNode = null;
    }
    isPlaying = false;
    updateAudioUI(false);
  }

  function updateAudioUI(playing) {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const lofiWidget = document.getElementById('lofi-widget');
    const trackTitle = document.getElementById('current-track-title');

    if (trackTitle) trackTitle.textContent = tracks[currentTrackIdx].title;

    if (playing) {
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      if (audioToggleBtn) audioToggleBtn.classList.add('playing');
      if (lofiWidget) lofiWidget.classList.add('playing');
    } else {
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      if (audioToggleBtn) audioToggleBtn.classList.remove('playing');
      if (lofiWidget) lofiWidget.classList.remove('playing');
    }
  }

  // Audio Widget Event Listeners
  const playPauseBtn = document.getElementById('play-pause-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const nextTrackBtn = document.getElementById('next-track-btn');
  const prevTrackBtn = document.getElementById('prev-track-btn');
  const volSlider = document.getElementById('lofi-volume');
  const minLofiBtn = document.getElementById('minimize-lofi-btn');
  const lofiWidget = document.getElementById('lofi-widget');

  function toggleAudio() {
    if (isPlaying) {
      stopLoFiMusic();
      showToast("🔇 Lo-Fi Ambient paused");
    } else {
      startLoFiMusic();
      showToast("🎧 Now Playing: " + tracks[currentTrackIdx].title);
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAudio);
  if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);

  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', () => {
      currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
      if (isPlaying) {
        stopLoFiMusic();
        startLoFiMusic();
      } else {
        updateAudioUI(false);
      }
      showToast("🎵 Track: " + tracks[currentTrackIdx].title);
    });
  }

  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', () => {
      currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
      if (isPlaying) {
        stopLoFiMusic();
        startLoFiMusic();
      } else {
        updateAudioUI(false);
      }
      showToast("🎵 Track: " + tracks[currentTrackIdx].title);
    });
  }

  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      if (masterGain) masterGain.gain.value = parseFloat(e.target.value);
    });
  }

  if (minLofiBtn && lofiWidget) {
    minLofiBtn.addEventListener('click', () => {
      lofiWidget.classList.toggle('minimized');
      const icon = minLofiBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 3. DYNAMIC HERO TYPING EFFECT
   * -------------------------------------------------------------------------- */
  const typingElement = document.getElementById('dynamic-typing-text');
  const roles = [
    "Full-Stack Software Craftsman",
    "Creative Technologist & UI/UX Geek",
    "Distributed Systems & Cloud Architect",
    "Anime Devotee & Lo-Fi Lounge Resident",
    "Open-Source Contributor & Builder"
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typingElement) return;
    const currentText = roles[roleIdx];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentText.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentText.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of sentence
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before new sentence
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  /* --------------------------------------------------------------------------
   * 4. SKILLS ARSENAL CATEGORY FILTER
   * -------------------------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
   * 5. LIVE GITHUB TELEMETRY REPOS FETCHER
   * -------------------------------------------------------------------------- */
  const reposContainer = document.getElementById('repos-container');
  const githubUser = 'adisharma9548';

  // Fallback repositories in case of GitHub rate limiting or offline use
  const fallbackRepos = [
    {
      name: "AnimeStream-Portal",
      description: "High-velocity streaming platform with GraphQL catalog sync, custom lo-fi music dock, and community episode discussions.",
      language: "TypeScript",
      langColor: "#3178C6",
      stargazers_count: 38,
      forks_count: 12,
      html_url: `https://github.com/${githubUser}`
    },
    {
      name: "NeuralForge-AI",
      description: "Context-aware developer agent featuring automated refactoring, AST analysis, and real-time LLM vector embeddings.",
      language: "Python",
      langColor: "#3776AB",
      stargazers_count: 54,
      forks_count: 17,
      html_url: `https://github.com/${githubUser}`
    },
    {
      name: "Cyber-Terminal-Engine",
      description: "Interactive browser CLI playground with Neofetch, dynamic command aliases, matrix animations, and telemetry sync.",
      language: "JavaScript",
      langColor: "#F7DF1E",
      stargazers_count: 29,
      forks_count: 9,
      html_url: `https://github.com/${githubUser}`
    },
    {
      name: "LoFi-Synth-Studio",
      description: "Procedural Web Audio API synthesizer for vintage lo-fi chord progressions and chill ambient study sessions.",
      language: "JavaScript",
      langColor: "#F7DF1E",
      stargazers_count: 42,
      forks_count: 14,
      html_url: `https://github.com/${githubUser}`
    },
    {
      name: "Distributed-Task-Queue",
      description: "Fault-tolerant asynchronous job orchestration worker pool written in Node.js and backed by Redis streams.",
      language: "TypeScript",
      langColor: "#3178C6",
      stargazers_count: 21,
      forks_count: 6,
      html_url: `https://github.com/${githubUser}`
    },
    {
      name: "adisharma9548",
      description: "Special GitHub Profile repository featuring Tokyo Night stats, animated contribution snake, and lo-fi aesthetics.",
      language: "Markdown",
      langColor: "#BD93F9",
      stargazers_count: 65,
      forks_count: 20,
      html_url: `https://github.com/${githubUser}/${githubUser}`
    }
  ];

  async function fetchGitHubRepos() {
    try {
      const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=pushed&per_page=6`);
      if (!response.ok) throw new Error("GitHub API status " + response.status);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        renderRepos(data);
      } else {
        renderRepos(fallbackRepos);
      }
    } catch (err) {
      console.warn("Using curated fallback repository telemetry:", err);
      renderRepos(fallbackRepos);
    }
  }

  function renderRepos(repos) {
    if (!reposContainer) return;
    reposContainer.innerHTML = '';

    const langColors = {
      JavaScript: "#F7DF1E",
      TypeScript: "#3178C6",
      Python: "#3776AB",
      HTML: "#E34F26",
      CSS: "#1572B6",
      C: "#555555",
      "C++": "#00599C",
      Rust: "#DEA584",
      Go: "#00ADD8",
      Markdown: "#BD93F9"
    };

    repos.slice(0, 6).forEach((repo) => {
      const lang = repo.language || "TypeScript";
      const color = repo.langColor || langColors[lang] || "#BD93F9";
      const desc = repo.description || "An aesthetic open-source project by Adi Sharma.";

      const card = document.createElement('div');
      card.className = 'repo-card glass-card';
      card.innerHTML = `
        <div>
          <div class="repo-card-top">
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-name-link">
              <i class="fa-regular fa-folder-closed"></i> ${repo.name}
            </a>
            <i class="fa-solid fa-arrow-up-right-from-square" style="color: var(--text-muted); font-size: 0.8rem;"></i>
          </div>
          <p class="repo-desc">${desc}</p>
        </div>
        <div class="repo-stats">
          <span><span class="repo-lang-bullet" style="background-color: ${color};"></span> ${lang}</span>
          <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count}</span>
          <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
        </div>
      `;
      reposContainer.appendChild(card);
    });
  }

  fetchGitHubRepos();

  /* --------------------------------------------------------------------------
   * 6. INTERACTIVE CYBER CLI TERMINAL
   * -------------------------------------------------------------------------- */
  const termForm = document.getElementById('terminal-form');
  const termInput = document.getElementById('terminal-input');
  const termOutput = document.getElementById('terminal-output');
  const clearTermBtn = document.getElementById('clear-term-btn');
  const termBody = document.getElementById('terminal-body');

  const terminalCommands = {
    help: () => `
<div style="color: var(--accent-cyan);">Available commands:</div>
  <span style="color: var(--accent-pink);">neofetch</span>    : Display system & developer telemetry
  <span style="color: var(--accent-pink);">about</span>       : Who is Adi Sharma?
  <span style="color: var(--accent-pink);">skills</span>      : Inspect technical arsenal
  <span style="color: var(--accent-pink);">projects</span>    : Browse featured deployments
  <span style="color: var(--accent-pink);">audio</span>       : Toggle Lo-Fi ambient synthesizer
  <span style="color: var(--accent-pink);">theme</span>       : Switch visual anime themes
  <span style="color: var(--accent-pink);">quote</span>       : Print inspirational anime / dev wisdom
  <span style="color: var(--accent-pink);">matrix</span>      : Trigger the green matrix digital rain
  <span style="color: var(--accent-pink);">contact</span>     : Display contact channels
  <span style="color: var(--accent-pink);">clear</span>       : Wipe terminal screen
    `,
    neofetch: () => `
<pre style="color: var(--accent-pink); margin: 0; font-size: 0.8rem;">
       /\\_/\\          <span style="color: var(--accent-purple); font-weight: bold;">adi@anime-lounge</span>
      ( o.o )         ----------------
       &gt; ^ &lt;          <b>OS:</b> Anime Dev Studio v2026.1 (x86_64)
      /|   |\\         <b>Host:</b> Tokyo Cyber Station
     (_|   |_)        <b>Kernel:</b> 6.1.0-matcha-lts
                      <b>Uptime:</b> 9,999 hrs (Continuous Coding)
                      <b>Packages:</b> 1,337 (npm, pip, cargo)
                      <b>Shell:</b> zsh 5.9
                      <b>Editor:</b> VS Code (Tokyo Night Theme)
                      <b>Terminal:</b> Hyper / Alacritty
                      <b>Fuel:</b> Matcha Latte & Lo-Fi Beats
                      <b>GitHub:</b> @adisharma9548
</pre>
    `,
    about: () => `
<span style="color: var(--accent-green); font-weight: bold;">[Adi Sharma]</span>
Full-stack software architect & creative technologist.
Passionate about bulletproof backends, distributed systems, and modern aesthetic frontend experiences.
GitHub: <a href="https://github.com/adisharma9548" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">@adisharma9548</a>
    `,
    skills: () => `
<span style="color: var(--accent-yellow);">Frontend:</span> React, Next.js, TypeScript, Tailwind CSS, Modern CSS3
<span style="color: var(--accent-yellow);">Backend:</span>  Node.js, Express, FastAPI, Python, Django, REST, GraphQL
<span style="color: var(--accent-yellow);">Data:</span>     PostgreSQL, MongoDB, Redis, Supabase, Prisma
<span style="color: var(--accent-yellow);">DevOps:</span>   Docker, AWS, Git, GitHub Actions, Linux
    `,
    projects: () => `
🌸 <b>AnimeStream & Community Lounge</b> - Next.js 14, TypeScript, Supabase
⚡ <b>NeuralForge AI Assistant</b> - FastAPI, LangChain, Vector Embeddings
🎧 <b>Lo-Fi Synthwave Studio</b> - Procedural Web Audio API Synthesizer
💻 <b>Cyber CLI Engine</b> - Interactive developer terminal simulation
    `,
    audio: () => {
      toggleAudio();
      return isPlaying ? "🎧 Lo-Fi Synthesizer started." : "🔇 Lo-Fi Synthesizer stopped.";
    },
    theme: () => {
      cycleTheme();
      return "🎨 Theme updated to: " + document.documentElement.getAttribute("data-theme");
    },
    quote: () => {
      const quotes = [
        `"Whatever you lose, you'll find it again. But what you throw away you'll never get back." - Kenshin Himura`,
        `"First, solve the problem. Then, write the code." - John Johnson`,
        `"If you don't take risks, you can't create a future." - Monkey D. Luffy`,
        `"Simplicity is prerequisite for reliability." - Edsger W. Dijkstra`,
        `"Power comes in response to a need, not a desire." - Goku`
      ];
      const randomQ = quotes[Math.floor(Math.random() * quotes.length)];
      return `<span style="color: var(--accent-yellow); font-style: italic;">${randomQ}</span>`;
    },
    matrix: () => {
      runMatrixEffect();
      return "<span style='color: #50fa7b;'>Wake up, Neo... The Matrix has you.</span>";
    },
    contact: () => `
📧 Email: <a href="mailto:adisharma9548@gmail.com" style="color: var(--accent-cyan);">adisharma9548@gmail.com</a>
💬 Discord: AdiSharma#0001
🐙 GitHub: <a href="https://github.com/adisharma9548" target="_blank" style="color: var(--accent-cyan);">@adisharma9548</a>
    `,
    clear: () => {
      if (termOutput) termOutput.innerHTML = '';
      return '';
    },
    sudo: () => `<span style="color: #ff5555;">Nice try! Incident will be reported to Santa Claus. 🎅</span>`
  };

  if (termForm) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawCmd = termInput.value.trim();
      if (!rawCmd) return;

      const cmd = rawCmd.toLowerCase();
      termInput.value = '';

      // Create command echo
      const entry = document.createElement('div');
      entry.className = 'terminal-output-entry';
      entry.innerHTML = `<div class="term-cmd-echo"><span style="color: var(--accent-green);">adi@dev:~$</span> ${escapeHTML(rawCmd)}</div>`;

      if (cmd === 'clear') {
        terminalCommands.clear();
      } else if (terminalCommands[cmd]) {
        const response = terminalCommands[cmd]();
        entry.innerHTML += `<div>${response}</div>`;
        termOutput.appendChild(entry);
      } else {
        entry.innerHTML += `<div style="color: #ff5555;">Command not found: "${escapeHTML(rawCmd)}". Type <span class="term-cmd-highlight">help</span> for valid commands.</div>`;
        termOutput.appendChild(entry);
      }

      termBody.scrollTop = termBody.scrollHeight;
    });
  }

  if (clearTermBtn) {
    clearTermBtn.addEventListener('click', () => {
      terminalCommands.clear();
    });
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function runMatrixEffect() {
    let count = 0;
    const interval = setInterval(() => {
      const line = document.createElement('div');
      line.style.color = '#50fa7b';
      line.style.fontSize = '0.8rem';
      let str = '';
      for (let i = 0; i < 45; i++) {
        str += String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
      }
      line.textContent = str;
      termOutput.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
      count++;
      if (count > 12) clearInterval(interval);
    }, 80);
  }

  /* --------------------------------------------------------------------------
   * 7. THEME SWITCHER & MODERN-WEB-GUIDANCE COMPLIANCE
   * -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themes = ['midnight', 'cyber-sakura', 'sakura-light'];

  function cycleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'midnight';
    const nextIdx = (themes.indexOf(current) + 1) % themes.length;
    const nextTheme = themes[nextIdx];

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('adi-theme', nextTheme);

    // Update meta color-scheme
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.content = nextTheme === 'sakura-light' ? 'light' : 'dark';
    }

    showToast(`🎨 Theme switched: ${nextTheme.toUpperCase()}`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', cycleTheme);
  }

  /* --------------------------------------------------------------------------
   * 8. COPY TO CLIPBOARD & TOAST SYSTEM
   * -------------------------------------------------------------------------- */
  const copyButtons = document.querySelectorAll('.copy-badge-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`📋 Copied "${textToCopy}" to clipboard!`);
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        });
      }
    });
  });

  const toastContainer = document.getElementById('toast-container');
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-sparkles" style="color: var(--accent-pink);"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  /* --------------------------------------------------------------------------
   * 9. CONTACT FORM INTERACTION
   * -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      const mailtoLink = `mailto:adisharma9548@gmail.com?subject=${encodeURIComponent(subject + " (from " + name + ")")}&body=${encodeURIComponent(message + "\n\nFrom: " + name + " <" + email + ">")}`;
      window.location.href = mailtoLink;

      showToast("🌸 Thank you! Opening your email client...");
      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
   * 10. MOBILE NAVIGATION DRAWER
   * -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
   * 11. SCROLLSPY & INTERSECTION OBSERVER ANIMATION FALLBACK
   * -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // Modern Web Guidance: Fallback for browsers without native scroll-driven animations
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.section-header, .about-card, .metric-card, .skill-card, .project-card, .repo-card, .terminal-window, .contact-info-card, .contact-form-card').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      observer.observe(el);
    });
  }

});
