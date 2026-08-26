document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Active Navbar Highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-item-link');

  const highlightNav = () => {
    let current = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    if (!current && window.scrollY < 200 && sections.length > 0) {
      current = sections[0].getAttribute('id');
    }

    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  window.addEventListener('scroll', highlightNav);
  highlightNav();

  // 2. Scroll Reveal Animations (Intersection Observer)
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });
  reveals.forEach(el => observer.observe(el));

  // 3. Interactive Godot 2D Physics Simulator (Hero Sandbox)
  const char = document.getElementById('physics-char');
  const telemetryEl = document.getElementById('sandbox-telemetry');
  const btnJump = document.getElementById('btn-jump');
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnReset = document.getElementById('btn-reset');

  let charX = 50;
  let charY = 20; // 20px off bottom (on floor)
  let velocityY = 0;
  let isJumping = false;
  let coyoteTimer = 0.15;
  let jumpBuffer = 0.0;
  const gravity = -1.2;
  const jumpForce = 15;

  const updateTelemetry = (state = 'ON_FLOOR') => {
    if (!telemetryEl) return;
    telemetryEl.innerHTML = `
      <div><strong>State:</strong> <span style="color: #4f46e5;">${state}</span></div>
      <div><strong>pos:</strong> (${Math.round(charX)}, ${Math.round(charY)})</div>
      <div><strong>coyote_timer:</strong> ${coyoteTimer.toFixed(2)}s</div>
      <div><strong>buffer:</strong> ${jumpBuffer.toFixed(2)}s</div>
    `;
  };

  const jump = () => {
    if (charY <= 25 || (charX >= 150 && charX <= 280 && charY >= 95 && charY <= 110)) {
      velocityY = jumpForce;
      isJumping = true;
      jumpBuffer = 0.1;
      updateTelemetry('JUMPING');
      if (char) {
        char.innerHTML = '🚀';
      }
    }
  };

  const moveLeft = () => {
    charX = Math.max(20, charX - 35);
    if (char) char.style.left = `${charX}px`;
    updateTelemetry(isJumping ? 'AIRBORNE' : 'WALKING_LEFT');
  };

  const moveRight = () => {
    charX = Math.min(360, charX + 35);
    if (char) char.style.left = `${charX}px`;
    updateTelemetry(isJumping ? 'AIRBORNE' : 'WALKING_RIGHT');
  };

  // Simple Physics Loop
  setInterval(() => {
    if (isJumping || charY > 20) {
      charY += velocityY;
      velocityY += gravity;

      // Platform collision check (platform at bottom: 95px, left: 170px, width: 110px)
      const onPlatform = (charX >= 150 && charX <= 270 && charY >= 95 && charY <= 110 && velocityY < 0);

      if (onPlatform) {
        charY = 105;
        velocityY = 0;
        isJumping = false;
        coyoteTimer = 0.15;
        if (char) char.innerHTML = '👾';
        updateTelemetry('ON_PLATFORM');
      } else if (charY <= 20) {
        charY = 20;
        velocityY = 0;
        isJumping = false;
        coyoteTimer = 0.15;
        if (char) char.innerHTML = '👾';
        updateTelemetry('ON_FLOOR');
      } else {
        coyoteTimer = Math.max(0, coyoteTimer - 0.02);
        updateTelemetry('AIRBORNE');
      }

      if (char) char.style.bottom = `${charY}px`;
    }
  }, 30);

  if (btnJump) btnJump.addEventListener('click', jump);
  if (btnLeft) btnLeft.addEventListener('click', moveLeft);
  if (btnRight) btnRight.addEventListener('click', moveRight);
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      charX = 50;
      charY = 20;
      velocityY = 0;
      isJumping = false;
      if (char) {
        char.style.left = `${charX}px`;
        char.style.bottom = `${charY}px`;
        char.innerHTML = '👾';
      }
      updateTelemetry('ON_FLOOR');
    });
  }

  // Keyboard controls for the mini sandbox when focused
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'Space', ' '].includes(e.key) && window.scrollY < 600) {
      jump();
    } else if (e.key === 'ArrowLeft' && window.scrollY < 600) {
      moveLeft();
    } else if (e.key === 'ArrowRight' && window.scrollY < 600) {
      moveRight();
    }
  });

  // 4. Sandbox Tabs (Simulator vs Code View)
  const tabSim = document.getElementById('tab-sim');
  const tabCode = document.getElementById('tab-code');
  const canvasArea = document.getElementById('sandbox-canvas');
  const codeArea = document.getElementById('sandbox-code');
  const controlsBar = document.getElementById('sandbox-controls');

  if (tabSim && tabCode && canvasArea && codeArea) {
    tabSim.addEventListener('click', () => {
      tabSim.classList.add('active');
      tabCode.classList.remove('active');
      canvasArea.style.display = 'block';
      controlsBar.style.display = 'flex';
      codeArea.style.display = 'none';
    });

    tabCode.addEventListener('click', () => {
      tabCode.classList.add('active');
      tabSim.classList.remove('active');
      canvasArea.style.display = 'none';
      controlsBar.style.display = 'none';
      codeArea.style.display = 'block';
    });
  }

  // 5. Interactive Toolkit / Sticker Click Notes
  const stickers = document.querySelectorAll('.tech-sticker');
  const stickerNoteText = document.getElementById('sticker-note-text');
  const stickerNoteBadge = document.getElementById('sticker-note-badge');

  const techNotes = {
    'Godot 4': 'My primary engine for 2D & 3D game logic, character controllers, tweening, and custom mechanics (1.5+ years).',
    'GDScript': 'Clean, Python-like language built directly into Godot for fluid physics, FSMs, and signal orchestration.',
    'Python & FastAPI': 'High-performance Python backend development, REST API endpoints, and teaching Python Arcade.',
    'Go': 'Building lightning-fast RESTful microservices, API backends, and robust JSON data handling.',
    'React JS': 'Used to craft reactive single-page user interfaces, component hierarchies, and game web apps.',
    'Vue & Vite': 'Modern frontend architectures with lightning-fast Vite tooling and reactive data-binding.',
    'MySQL & SQLite': 'Designing relational database schemas, inventory persistence, SQL queries, and local game save systems.',
    'Firebase': 'Serverless cloud backend for Android mobile apps (Project Peminjaman), real-time Firestore database sync, storage, and authentication.',
    'Supabase': 'Open-source PostgreSQL backend as a service, implementing realtime subscriptions, relational data tables, and auth services.',
    'Laravel & PHP': 'Building structured MVC web applications, Eloquent relational ORM models, migrations, and database-driven web platforms (TokoMusik).',
    'Ableton Live': 'My primary Digital Audio Workstation (DAW) for composing original game tracks, rapid 1-day arrangement sprints, mixing, and mastering.',
    'Audio VSTs': 'Extensive suite of virtual instrument plugins, analog synths, granular delays, saturation, compressors, and spatial audio processing.',
    'Sound Design': 'Sound engineering, original synth composition, mixing, mastering, and integrating dynamic game SFX.',
    'Git & GitHub': 'Version control hygiene, repository hosting, collaborative branches, and open-source projects.'
  };

  stickers.forEach(sticker => {
    sticker.addEventListener('click', () => {
      const tech = sticker.getAttribute('data-tech');
      if (tech && techNotes[tech] && stickerNoteText && stickerNoteBadge) {
        stickerNoteBadge.textContent = tech;
        stickerNoteText.textContent = techNotes[tech];

        // Quick visual bounce
        sticker.style.transform = 'scale(1.15) rotate(-4deg)';
        setTimeout(() => {
          sticker.style.transform = '';
        }, 200);
      }
    });
  });

  // 6. Real Interactive Tape Deck Audio Player
  const tapeAudio = document.getElementById('tape-audio');
  const btnTapePlay = document.getElementById('btn-tape-play');
  const btnTapeMute = document.getElementById('btn-tape-mute');
  const tapeReels = document.querySelectorAll('.tape-reel');
  const tapeWaveBars = document.getElementById('tape-wave-bars');
  const tapeStatus = document.getElementById('tape-status');
  const tapeScrubber = document.getElementById('tape-scrubber');
  const tapeCurrentTime = document.getElementById('tape-current-time');
  const tapeDuration = document.getElementById('tape-duration');

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (tapeAudio && btnTapePlay) {
    // Play / Pause Toggle
    btnTapePlay.addEventListener('click', () => {
      if (tapeAudio.paused) {
        tapeAudio.play().then(() => {
          tapeReels.forEach(r => r.classList.add('spinning'));
          if (tapeWaveBars) tapeWaveBars.classList.add('playing');
          btnTapePlay.innerHTML = '<i class="bi bi-pause-fill"></i> Pause Tape';
          btnTapePlay.style.background = '#fde047';
          if (tapeStatus) tapeStatus.textContent = '▶ Playing • "Dark Ambience"';
        }).catch(err => {
          console.log('Audio playback error:', err);
          if (tapeStatus) tapeStatus.textContent = '⚠️ Click again to start playback';
        });
      } else {
        tapeAudio.pause();
        tapeReels.forEach(r => r.classList.remove('spinning'));
        if (tapeWaveBars) tapeWaveBars.classList.remove('playing');
        btnTapePlay.innerHTML = '<i class="bi bi-play-fill"></i> Play Tape';
        btnTapePlay.style.background = '#ffffff';
        if (tapeStatus) tapeStatus.textContent = '■ Tape Paused • "Dark Ambience"';
      }
    });

    // Audio Metadata Loaded
    tapeAudio.addEventListener('loadedmetadata', () => {
      if (tapeDuration) tapeDuration.textContent = formatTime(tapeAudio.duration);
    });

    // Time Update & Scrubber Sync
    tapeAudio.addEventListener('timeupdate', () => {
      if (tapeCurrentTime) tapeCurrentTime.textContent = formatTime(tapeAudio.currentTime);
      if (tapeDuration && !isNaN(tapeAudio.duration)) {
        tapeDuration.textContent = formatTime(tapeAudio.duration);
        if (tapeScrubber) {
          tapeScrubber.value = (tapeAudio.currentTime / tapeAudio.duration) * 100;
        }
      }
    });

    // Scrubber Seeking
    if (tapeScrubber) {
      tapeScrubber.addEventListener('input', () => {
        if (tapeAudio.duration) {
          tapeAudio.currentTime = (tapeScrubber.value / 100) * tapeAudio.duration;
        }
      });
    }

    // Mute / Unmute Toggle
    if (btnTapeMute) {
      btnTapeMute.addEventListener('click', () => {
        tapeAudio.muted = !tapeAudio.muted;
        if (tapeAudio.muted) {
          btnTapeMute.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
          btnTapeMute.style.background = '#fee2e2';
        } else {
          btnTapeMute.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
          btnTapeMute.style.background = '#ffffff';
        }
      });
    }

    // Track Finished Playing
    tapeAudio.addEventListener('ended', () => {
      tapeReels.forEach(r => r.classList.remove('spinning'));
      if (tapeWaveBars) tapeWaveBars.classList.remove('playing');
      btnTapePlay.innerHTML = '<i class="bi bi-play-fill"></i> Play Tape';
      btnTapePlay.style.background = '#ffffff';
      if (tapeStatus) tapeStatus.textContent = '■ Finished • Ready to Replay';
      if (tapeScrubber) tapeScrubber.value = 0;
    });
  }

  // 7. Full Interactive Music Lounge: 1 Song / 1 Day Challenge Player
  const playlistAudio = document.getElementById('playlist-audio');
  const playlistContainer = document.getElementById('playlist-container');
  const btnPlayerPlay = document.getElementById('btn-player-play');
  const playerPlayIcon = document.getElementById('player-play-icon');
  const btnPlayerPrev = document.getElementById('btn-player-prev');
  const btnPlayerNext = document.getElementById('btn-player-next');
  const btnPlayerLoop = document.getElementById('btn-player-loop');
  const btnPlayerMute = document.getElementById('btn-player-mute');
  const playerVolumeIcon = document.getElementById('player-volume-icon');
  const playerVolumeSlider = document.getElementById('player-volume-slider');
  const playerSeekBar = document.getElementById('player-seek-bar');
  const playerCurrentTime = document.getElementById('player-current-time');
  const playerTotalDuration = document.getElementById('player-total-duration');
  const playerStatusTag = document.getElementById('player-status-tag');
  const playerLed = document.getElementById('player-led');
  const vinylDisc = document.getElementById('vinyl-disc');
  const vinylEqBars = document.getElementById('vinyl-eq-bars');
  const playerGenreBadge = document.getElementById('player-genre-badge');
  const playerTrackCounter = document.getElementById('player-track-counter');
  const playerTrackTitle = document.getElementById('player-track-title');
  const playerTrackArtist = document.getElementById('player-track-artist');
  const playerTrackDesc = document.getElementById('player-track-desc');
  const playlistSearch = document.getElementById('playlist-search');
  const filterBtns = document.querySelectorAll('.playlist-filter-btn');

  const playlistTracks = [
    {
      id: 1,
      title: "Day 119 (Dark Ambience)",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Ambient Synth",
      duration: "2:56",
      src: "Assets/Music/Day 119.mp3",
      highlight: true,
      desc: "Atmospheric modular synth composition with deep sub-bass and tension-building reverb."
    },
    {
      id: 2,
      title: "Day 218: Dark Lo-Fi Shorts",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Dark Lo-Fi",
      duration: "2:46",
      src: "Assets/Music/Day 218 Dark Lofi Shorts.mp3",
      highlight: true,
      desc: "Mellow nighttime chords, vinyl crackle, and gentle melodic synth lead."
    },
    {
      id: 3,
      title: "Day 132: Band Session",
      artist: "Atha Zaul",
      category: "band",
      genre: "Indie Rock & Band",
      duration: "3:51",
      src: "Assets/Music/Day 132 Band.mp3",
      highlight: true,
      desc: "Full dynamic band ensemble arrangement with live guitar drives and punchy percussion."
    },
    {
      id: 4,
      title: "Day 144: Synth Master",
      artist: "Atha Zaul",
      category: "band",
      genre: "Synthwave Master",
      duration: "2:54",
      src: "Assets/Music/Day 144 Master.mp3",
      highlight: true,
      desc: "Polished synth lead hooks, driving basslines, and retro neon vibes."
    },
    {
      id: 5,
      title: "Day 174: Melodic Anthem",
      artist: "Atha Zaul",
      category: "band",
      genre: "Melodic & Vocal Song",
      duration: "5:42",
      src: "Assets/Music/Day 174 Song.mp3",
      highlight: true,
      desc: "Extended emotional production with lush harmony progressions and layered instrumentation."
    },
    {
      id: 6,
      title: "Day 4: Deep Atmosphere",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Atmospheric Ambient",
      duration: "6:21",
      src: "Assets/Music/Day 4.mp3",
      highlight: true,
      desc: "Slow-evolving ambient soundscape designed for deep focus and cinematic moods."
    },
    {
      id: 7,
      title: "Day 5.1: Experimental Pulse",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Accoustic & Experimental",
      duration: "2:41",
      src: "Assets/Music/Day 5.1.mp3",
      desc: "Guitar Jams & pulses layered with glitch and spatial delay ambient textures."
    },
    {
      id: 8,
      title: "Day 14: Minimalist Groove",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Minimal & Lo-Fi",
      duration: "0:57",
      src: "Assets/Music/Day 14.mp3",
      desc: "Short, punchy lo-fi groove sketch focused on swing and organic sample texture."
    },
    {
      id: 9,
      title: "Day 18: Midnight Sketch",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Lo-Fi Beats",
      duration: "1:01",
      src: "Assets/Music/Day 18.mp3",
      desc: "Late-night chord progression with warm analog tape warmth."
    },
    {
      id: 10,
      title: "Day 20: Synth Horizon",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Ambient Synth",
      duration: "2:01",
      src: "Assets/Music/Day 20.mp3",
      desc: "Expansive atmospheric synth pads with sparkling high-register arpeggios."
    },
    {
      id: 11,
      title: "Day 21: Neon Drift",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Chillwave",
      duration: "1:15",
      src: "Assets/Music/Day 21.mp3",
      desc: "Relaxed chillwave beat light and dark."
    },
    {
      id: 12,
      title: "Day 25: Just A House",
      artist: "Atha Zaul",
      category: "band",
      genre: "House Beat",
      duration: "2:20",
      src: "Assets/Music/Day 25.mp3",
      desc: "a nice simple house beat with a modular chirp as a melodies."
    },
    {
      id: 13,
      title: "Day 36: Short Circuit",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Electronic Micro",
      duration: "1:01",
      src: "Assets/Music/Day 36.mp3",
      desc: "Brisk electronic sketch experimenting with fast modulation."
    },
    {
      id: 14,
      title: "Day 44: Melodic Flow",
      artist: "Atha Zaul",
      category: "band",
      genre: "Electronic Beats",
      duration: "5:10",
      src: "Assets/Music/Day 44.mp3",
      highlight: true,
      desc: "We a nice day isn't it? like a long time ago."
    },
    {
      id: 15,
      title: "Day 65: Quick Spark",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Micro-Arrangement",
      duration: "0:40",
      src: "Assets/Music/Day 65.mp3",
      desc: "Fast creative spark captured in under 40 seconds of pure synth harmony."
    },
    {
      id: 16,
      title: "Day 71: Feels Weird",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Glitch House",
      duration: "1:44",
      src: "Assets/Music/Day 71.mp3",
      desc: "I just feel like this is a very good beat for a warm up or a cool down"
    },
    {
      id: 17,
      title: "Day 81: Chased Dark",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Dark Beat",
      duration: "1:46",
      src: "Assets/Music/Day 81.mp3",
      desc: "Boo."
    },
    {
      id: 18,
      title: "Day 91: High Velocity",
      artist: "Atha Zaul",
      category: "band",
      genre: "Energetic Beats",
      duration: "3:50",
      src: "Assets/Music/Day 91.mp3",
      highlight: true,
      desc: "Driving Around."
    },
    {
      id: 19,
      title: "Day 99: Century Eve",
      artist: "Atha Zaul",
      category: "House",
      genre: "House Beat",
      duration: "2:45",
      src: "Assets/Music/Day 99.mp3",
      desc: "The rhythm of the night."
    },
    {
      id: 20,
      title: "Day 111: Triple Ace",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Atmospheric Synth",
      duration: "1:50",
      src: "Assets/Music/Day 111.mp3",
      desc: "Clean synth pads with deep low-end resonance and harmonic motion."
    },
    {
      id: 21,
      title: "Day 114: Glitchy Effect",
      artist: "Atha Zaul",
      category: "Glitch House",
      genre: "Glitch House",
      duration: "2:13",
      src: "Assets/Music/Day 114.mp3",
      desc: "It's called glitchy effect because it has a lot of glitch effects."
    },
    {
      id: 22,
      title: "Day 124: Subterranean",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Deep Ambient",
      duration: "2:12",
      src: "Assets/Music/Day 124.mp3",
      desc: "Heard it Before maybe?."
    },
    {
      id: 23,
      title: "Day 126: ANOTHER HOUSE",
      artist: "Atha Zaul",
      category: "House",
      genre: "House Beat",
      duration: "2:33",
      src: "Assets/Music/Day 126.mp3",
      desc: "you'll hear this at the end."
    },
    {
      id: 24,
      title: "Day 127: Late Night Vibe",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Lo-Fi / Mellow",
      duration: "1:20",
      src: "Assets/Music/Day 127.mp3",
      desc: "this is the opening for my game btw."
    },
    {
      id: 25,
      title: "Day 133: Groove Odyssey",
      artist: "Atha Zaul",
      category: "band",
      genre: "Upbeat Rhythm",
      duration: "2:16",
      src: "Assets/Music/Day 133.mp3",
      desc: "Funky rhythm section with bouncy bass riffs."
    },
    {
      id: 26,
      title: "Day 135: Crystal Cavern",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Game Exploration",
      duration: "2:55",
      src: "Assets/Music/Day 135.mp3",
      desc: "Glittering bells and ethereal pads designed for RPG exploration."
    },
    {
      id: 27,
      title: "Day 141: Bouncy Bouncy",
      artist: "Atha Zaul",
      category: "band",
      genre: "Synth",
      duration: "2:39",
      src: "Assets/Music/Day 141 No Master.mp3",
      desc: "Bouncyyyyyyyy."
    },
    {
      id: 28,
      title: "Day 147: Oldie",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Vintage Synth",
      duration: "1:43",
      src: "Assets/Music/Day 147.mp3",
      desc: "A song that feels when you chilling in the 90's."
    },
    {
      id: 29,
      title: "Day 150: Milestone Beat",
      artist: "Atha Zaul",
      category: "band",
      genre: "Piano Chill",
      duration: "2:15",
      src: "Assets/Music/Day 150.mp3",
      desc: "I wish I could play piano like this."
    },
    {
      id: 30,
      title: "Day 155: Overdrive",
      artist: "Atha Zaul",
      category: "band",
      genre: "High Energy",
      duration: "2:59",
      src: "Assets/Music/Day 155.mp3",
      desc: "Distorted synth leads and powerful rhythm section."
    },
    {
      id: 31,
      title: "Day 157: Cinematic Dusk",
      artist: "Atha Zaul",
      category: "ambient",
      genre: "Cinematic Ambient",
      duration: "2:10",
      src: "Assets/Music/Day 157.mp3",
      desc: "Melancholic sunset soundscape with slow swell chords."
    },
    {
      id: 32,
      title: "Day 161: Electric Pulse",
      artist: "Atha Zaul",
      category: "band",
      genre: "Synth Pop",
      duration: "3:04",
      src: "Assets/Music/Day 161.mp3",
      desc: "Catchy synth arpeggios and punchy danceable rhythm."
    },
    {
      id: 33,
      title: "Day 169: Short Interlude",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "BGM Interlude",
      duration: "1:00",
      src: "Assets/Music/Day 169.mp3",
      desc: "Compact transitional sketch crafted in a single sitting."
    },
    {
      id: 34,
      title: "Day 171: Rain on Glass",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Lo-Fi Texture",
      duration: "1:10",
      src: "Assets/Music/Day 171.mp3",
      desc: "Subtle texture and soothing low-pass filtered keys."
    },
    {
      id: 35,
      title: "Day 177: Grand Finale",
      artist: "Atha Zaul",
      category: "Jungle",
      genre: "Jungle",
      duration: "3:59",
      src: "Assets/Music/Day 177.mp3",
      highlight: true,
      desc: "A little Piano and jungle music ."
    },
    {
      id: 36,
      title: "Hey Everyone (Intro / Jam)",
      artist: "Atha Zaul",
      category: "lofi",
      genre: "Intro & Freestyle",
      duration: "1:35",
      src: "Assets/Music/Hey Everyone.mp3",
      desc: "Spoken intro and jam session welcoming listeners to the audio space."
    }
  ];

  let currentTrackIndex = 0;
  let isLooping = false;
  let activeFilter = 'all';
  let currentSearchQuery = '';

  const getFilteredTracks = () => {
    return playlistTracks.map((track, originalIndex) => ({ ...track, originalIndex })).filter(track => {
      const cat = (track.category || '').toLowerCase();
      const genre = (track.genre || '').toLowerCase();
      const title = (track.title || '').toLowerCase();
      const desc = (track.desc || '').toLowerCase();

      let matchesFilter = false;
      if (activeFilter === 'all') {
        matchesFilter = true;
      } else if (activeFilter === 'highlight') {
        matchesFilter = !!track.highlight;
      } else if (activeFilter === 'ambient') {
        matchesFilter = cat.includes('ambient') || genre.includes('ambient') || genre.includes('soundscape') || genre.includes('accoustic') || genre.includes('vintage synth');
      } else if (activeFilter === 'lofi') {
        matchesFilter = cat.includes('lofi') || genre.includes('lo-fi') || genre.includes('chill') || genre.includes('dark beat') || genre.includes('chillwave');
      } else if (activeFilter === 'house') {
        matchesFilter = cat.includes('house') || cat.includes('glitch') || genre.includes('house') || genre.includes('glitch');
      } else if (activeFilter === 'band') {
        matchesFilter = cat.includes('band') || cat.includes('jungle') || genre.includes('band') || genre.includes('jungle') || genre.includes('synth') || genre.includes('rock') || genre.includes('electronic') || genre.includes('chiptune') || genre.includes('piano');
      } else {
        matchesFilter = cat.includes(activeFilter.toLowerCase()) || genre.includes(activeFilter.toLowerCase());
      }

      const q = currentSearchQuery.toLowerCase();
      const matchesSearch = q === '' || title.includes(q) || genre.includes(q) || desc.includes(q) || cat.includes(q);

      return matchesFilter && matchesSearch;
    });
  };

  const renderPlaylist = () => {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';

    const visibleTracks = getFilteredTracks();

    if (visibleTracks.length === 0) {
      playlistContainer.innerHTML = `
        <div class="text-center py-4 text-muted small">
          <i class="bi bi-search fs-4 d-block mb-1"></i>
          No tracks found matching "<strong>${currentSearchQuery}</strong>"
        </div>
      `;
      return;
    }

    visibleTracks.forEach((track) => {
      const isCurrentActive = track.originalIndex === currentTrackIndex;
      const isCurrentPlaying = isCurrentActive && playlistAudio && !playlistAudio.paused;

      const row = document.createElement('div');
      row.className = `playlist-track-row ${isCurrentActive ? 'active' : ''} ${isCurrentPlaying ? 'playing' : ''}`;
      row.setAttribute('data-index', track.originalIndex);

      row.innerHTML = `
        <div class="track-row-left">
          <span class="track-row-num">${track.originalIndex + 1 < 10 ? '0' + (track.originalIndex + 1) : track.originalIndex + 1}</span>
          <div>
            <div class="track-row-title">${track.title}</div>
            <div class="track-row-meta">${track.genre} • ${track.artist}</div>
          </div>
        </div>
        <div class="track-row-right">
          <span class="track-row-duration">${track.duration}</span>
          <div class="track-mini-eq">
            <span class="mini-eq-bar"></span>
            <span class="mini-eq-bar"></span>
            <span class="mini-eq-bar"></span>
          </div>
          <i class="bi bi-play-circle-fill text-muted fs-5 track-mini-play-icon"></i>
        </div>
      `;

      row.addEventListener('click', () => {
        if (currentTrackIndex === track.originalIndex) {
          // Toggle play / pause on the active track
          if (playlistAudio.paused) {
            playTrack();
          } else {
            pauseTrack();
          }
        } else {
          // If already playing, keep playing new track; if paused, load the track without auto-playing
          const shouldPlay = playlistAudio && !playlistAudio.paused;
          loadTrack(track.originalIndex, shouldPlay);
        }
      });

      playlistContainer.appendChild(row);
    });
  };

  const loadTrack = (index, autoPlay = false) => {
    if (!playlistAudio || index < 0 || index >= playlistTracks.length) return;
    currentTrackIndex = index;
    const track = playlistTracks[currentTrackIndex];

    playlistAudio.src = track.src;
    if (playerTrackTitle) playerTrackTitle.textContent = track.title;
    if (playerTrackArtist) playerTrackArtist.textContent = `${track.artist} • 1 Song 1 Day`;
    if (playerTrackDesc) playerTrackDesc.textContent = track.desc;
    if (playerGenreBadge) playerGenreBadge.textContent = track.genre;
    if (playerTrackCounter) playerTrackCounter.textContent = `Track ${currentTrackIndex + 1} / ${playlistTracks.length}`;
    if (playerTotalDuration) playerTotalDuration.textContent = track.duration;
    if (playerCurrentTime) playerCurrentTime.textContent = '0:00';
    if (playerSeekBar) playerSeekBar.value = 0;

    renderPlaylist();

    if (autoPlay) {
      playTrack();
    } else {
      if (playerPlayIcon) playerPlayIcon.className = 'bi bi-play-fill';
      if (playerStatusTag) playerStatusTag.textContent = 'LOADED';
      if (playerLed) playerLed.classList.remove('playing');
      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (vinylEqBars) vinylEqBars.classList.remove('playing');
    }
  };

  const playTrack = () => {
    if (!playlistAudio) return;

    // Pause tape deck if it's currently running
    if (tapeAudio && !tapeAudio.paused) {
      tapeAudio.pause();
      if (btnTapePlay) {
        btnTapePlay.innerHTML = '<i class="bi bi-play-fill"></i> Play Tape';
        btnTapePlay.style.background = '#ffffff';
      }
      tapeReels.forEach(r => r.classList.remove('spinning'));
      if (tapeWaveBars) tapeWaveBars.classList.remove('playing');
    }

    playlistAudio.play().then(() => {
      if (playerPlayIcon) playerPlayIcon.className = 'bi bi-pause-fill';
      if (playerStatusTag) playerStatusTag.textContent = 'STREAMING';
      if (playerLed) playerLed.classList.add('playing');
      if (vinylDisc) vinylDisc.classList.add('spinning');
      if (vinylEqBars) vinylEqBars.classList.add('playing');
      renderPlaylist();
    }).catch(err => {
      console.log('Playback error:', err);
    });
  };

  const pauseTrack = () => {
    if (!playlistAudio) return;
    playlistAudio.pause();
    if (playerPlayIcon) playerPlayIcon.className = 'bi bi-play-fill';
    if (playerStatusTag) playerStatusTag.textContent = 'PAUSED';
    if (playerLed) playerLed.classList.remove('playing');
    if (vinylDisc) vinylDisc.classList.remove('spinning');
    if (vinylEqBars) vinylEqBars.classList.remove('playing');
    renderPlaylist();
  };

  if (playlistAudio) {
    // Initial Render without autoplay
    renderPlaylist();

    // Category Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        renderPlaylist();
      });
    });

    // Real-Time Search Input
    if (playlistSearch) {
      playlistSearch.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.trim();
        renderPlaylist();
      });
    }

    // Toggle Play/Pause Button
    if (btnPlayerPlay) {
      btnPlayerPlay.addEventListener('click', () => {
        if (playlistAudio.paused) {
          playTrack();
        } else {
          pauseTrack();
        }
      });
    }

    // Previous Track Button (respects playing state)
    if (btnPlayerPrev) {
      btnPlayerPrev.addEventListener('click', () => {
        const prevIndex = (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
        const shouldPlay = playlistAudio && !playlistAudio.paused;
        loadTrack(prevIndex, shouldPlay);
      });
    }

    // Next Track Button (respects playing state)
    if (btnPlayerNext) {
      btnPlayerNext.addEventListener('click', () => {
        const nextIndex = (currentTrackIndex + 1) % playlistTracks.length;
        const shouldPlay = playlistAudio && !playlistAudio.paused;
        loadTrack(nextIndex, shouldPlay);
      });
    }

    // Loop Toggle Button
    if (btnPlayerLoop) {
      btnPlayerLoop.addEventListener('click', () => {
        isLooping = !isLooping;
        btnPlayerLoop.classList.toggle('active', isLooping);
        playlistAudio.loop = isLooping;
      });
    }

    // Volume Slider & Mute
    if (playerVolumeSlider) {
      playerVolumeSlider.addEventListener('input', () => {
        playlistAudio.volume = playerVolumeSlider.value;
        if (playlistAudio.volume === 0) {
          if (playerVolumeIcon) playerVolumeIcon.className = 'bi bi-volume-mute-fill text-danger';
        } else {
          if (playerVolumeIcon) playerVolumeIcon.className = 'bi bi-volume-up-fill';
        }
      });
    }

    if (btnPlayerMute) {
      btnPlayerMute.addEventListener('click', () => {
        playlistAudio.muted = !playlistAudio.muted;
        if (playlistAudio.muted) {
          if (playerVolumeIcon) playerVolumeIcon.className = 'bi bi-volume-mute-fill text-danger';
        } else {
          if (playerVolumeIcon) playerVolumeIcon.className = 'bi bi-volume-up-fill';
        }
      });
    }

    // Timeupdate & Seek
    playlistAudio.addEventListener('timeupdate', () => {
      if (playerCurrentTime) playerCurrentTime.textContent = formatTime(playlistAudio.currentTime);
      if (playerTotalDuration && !isNaN(playlistAudio.duration) && playlistAudio.duration > 0) {
        playerTotalDuration.textContent = formatTime(playlistAudio.duration);
        if (playerSeekBar) {
          playerSeekBar.value = (playlistAudio.currentTime / playlistAudio.duration) * 100;
        }
      }
    });

    if (playerSeekBar) {
      playerSeekBar.addEventListener('input', () => {
        if (playlistAudio.duration) {
          playlistAudio.currentTime = (playerSeekBar.value / 100) * playlistAudio.duration;
        }
      });
    }

    // Track Finished
    playlistAudio.addEventListener('ended', () => {
      if (!isLooping) {
        const nextIndex = (currentTrackIndex + 1) % playlistTracks.length;
        loadTrack(nextIndex, true);
      }
    });
  }

  // 8. Copy Email Quick Button
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'Ghithrif30@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
        copyBtn.style.background = '#dcfce7';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = '';
        }, 2000);
      });
    });
  }

  // 9. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('show');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('show');
      });
    });
  }
});
