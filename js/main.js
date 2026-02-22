/* ================================================
   MAIN.JS — Core interactivity
   ================================================ */
(function () {
  'use strict';

  /* --- Configuration --- */
  var TAGLINES = [
    '15+ years building digital products across 4 industries',
    'Currently diving deep into AI Agents & Automation (n8n)',
    'From gaming worlds to global commerce',
    'AI + Human = Boost',
    'Optimizing customers experience'
  ];

  var RADAR_DATA = {
    labels: ['Product Strategy', 'Data-Driven', 'User-Centered', 'Innovation', 'Stakeholder Mgmt', 'Problem Solving'],
    values: [95, 90, 90, 95, 90, 90]
  };

  /* ================================================
     TYPED TEXT EFFECT
     ================================================ */
  function initTypedEffect() {
    var el = document.getElementById('typedText');
    if (!el) return;

    var lineIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 55;
    var deleteSpeed = 30;
    var pauseAfterType = 2200;
    var pauseAfterDelete = 400;

    function tick() {
      var currentLine = TAGLINES[lineIndex];

      if (!isDeleting) {
        // Typing
        el.textContent = currentLine.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentLine.length) {
          // Finished typing, pause then delete
          isDeleting = true;
          setTimeout(tick, pauseAfterType);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        // Deleting
        el.textContent = currentLine.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Finished deleting, move to next line
          isDeleting = false;
          lineIndex = (lineIndex + 1) % TAGLINES.length;
          setTimeout(tick, pauseAfterDelete);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    }

    // Start after a brief delay
    setTimeout(tick, 800);
  }

  /* ================================================
     NODE NETWORK CANVAS (Hero Background)
     ================================================ */
  function initNodeNetwork() {
    var canvas = document.getElementById('nodeNetwork');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouseX = -1000;
    var mouseY = -1000;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth < 768;
    var particleCount = isMobile ? 20 : 35;
    var connectionDistance = isMobile ? 100 : 140;
    var animId;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }

    function Particle() {
      var rect = canvas.getBoundingClientRect();
      this.x = Math.random() * rect.width;
      this.y = Math.random() * rect.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 1;
      this.opacity = Math.random() * 0.4 + 0.2;
    }

    Particle.prototype.update = function (w, h) {
      // Mouse repulsion (desktop only)
      if (!isMobile) {
        var dx = this.x - mouseX;
        var dy = this.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          var force = (180 - dist) / 180 * 0.8;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Clamp velocity
      var maxV = 1.2;
      var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > maxV) {
        this.vx = (this.vx / speed) * maxV;
        this.vy = (this.vy / speed) * maxV;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around
      if (this.x < -10) this.x = w + 10;
      if (this.x > w + 10) this.x = -10;
      if (this.y < -10) this.y = h + 10;
      if (this.y > h + 10) this.y = -10;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
      ctx.fill();
    };

    function initParticles() {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            var alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0, 229, 200, ' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      var rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (var i = 0; i < particles.length; i++) {
        particles[i].update(rect.width, rect.height);
        particles[i].draw();
      }
      drawConnections();

      animId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    if (!isMobile) {
      canvas.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      canvas.addEventListener('mouseleave', function () {
        mouseX = -1000;
        mouseY = -1000;
      });
    }

    window.addEventListener('resize', function () {
      resize();
    });

    resize();
    initParticles();

    if (!prefersReducedMotion) {
      animate();
    } else {
      // Draw static frame
      for (var i = 0; i < particles.length; i++) {
        particles[i].draw();
      }
      drawConnections();
    }
  }

  /* ================================================
     SCROLL REVEAL (IntersectionObserver)
     ================================================ */
  function initScrollReveals() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show everything immediately
      var allReveal = document.querySelectorAll('.reveal');
      for (var i = 0; i < allReveal.length; i++) {
        allReveal[i].classList.add('revealed');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    var revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ================================================
     NAVIGATION
     ================================================ */
  function initNavigation() {
    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var allNavLinks = document.querySelectorAll('.nav-link:not(.nav-link--linkedin)');
    var sections = document.querySelectorAll('section[id]');

    // Scroll: transparent → solid nav
    var navTicking = false;
    window.addEventListener('scroll', function () {
      if (!navTicking) {
        requestAnimationFrame(function () {
          if (window.pageYOffset > 60) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          navTicking = false;
        });
        navTicking = true;
      }
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close menu on link click
      allNavLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Scroll spy — track active section
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          allNavLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ================================================
     RADAR CHART (Skills Section)
     ================================================ */
  function initRadarChart() {
    var canvas = document.getElementById('radarChart');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var animated = false;
    var progress = 0;
    var animId;
    var labels = RADAR_DATA.labels;
    var values = RADAR_DATA.values;
    var numAxes = labels.length;

    function resize() {
      var parent = canvas.parentElement;
      var w = Math.min(parent.offsetWidth, 560);
      var h = Math.round(w * 0.78);
      var dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawChart(p) {
      var w = parseInt(canvas.style.width);
      var h = parseInt(canvas.style.height);
      var cx = w / 2;
      var cy = h / 2;
      var maxRadius = Math.min(w, h) * 0.3;

      ctx.clearRect(0, 0, w, h);

      // Draw grid rings
      for (var ring = 1; ring <= 4; ring++) {
        var r = (maxRadius / 4) * ring;
        ctx.beginPath();
        for (var i = 0; i <= numAxes; i++) {
          var angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
          var x = cx + r * Math.cos(angle);
          var y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw axis lines
      for (var i = 0; i < numAxes; i++) {
        var angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxRadius * Math.cos(angle), cy + maxRadius * Math.sin(angle));
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw data polygon
      ctx.beginPath();
      for (var i = 0; i < numAxes; i++) {
        var angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
        var val = (values[i] / 100) * maxRadius * p;
        var x = cx + val * Math.cos(angle);
        var y = cy + val * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 229, 200, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#00E5C8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw data points
      for (var i = 0; i < numAxes; i++) {
        var angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
        var val = (values[i] / 100) * maxRadius * p;
        var x = cx + val * Math.cos(angle);
        var y = cy + val * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5C8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '600 13px "Syne", sans-serif';
      ctx.fillStyle = '#2D3748';

      for (var i = 0; i < numAxes; i++) {
        var angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
        var labelRadius = maxRadius + 30;
        var x = cx + labelRadius * Math.cos(angle);
        var y = cy + labelRadius * Math.sin(angle);

        // Adjust alignment based on position
        if (Math.abs(Math.cos(angle)) > 0.5) {
          ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
        } else {
          ctx.textAlign = 'center';
        }

        ctx.fillText(labels[i], x, y);
      }
    }

    function animateChart() {
      if (progress < 1) {
        progress += 0.025;
        if (progress > 1) progress = 1;
        drawChart(progress);
        animId = requestAnimationFrame(animateChart);
      }
    }

    // Observe for visibility
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        progress = 0;
        animateChart();
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    resize();
    drawChart(0);
    observer.observe(canvas);

    window.addEventListener('resize', function () {
      resize();
      drawChart(animated ? 1 : 0);
    });
  }

  /* ================================================
     SKILL PROGRESS RINGS (SVG Animation)
     ================================================ */
  function initProgressRings() {
    var circumference = 2 * Math.PI * 42; // r=42

    var rings = document.querySelectorAll('.skill-ring-fill');
    rings.forEach(function (ring) {
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var ringsInView = entry.target.querySelectorAll('.skill-ring-fill');
          ringsInView.forEach(function (ring, index) {
            var percent = parseInt(ring.getAttribute('data-percent')) || 0;
            var offset = circumference - (percent / 100) * circumference;
            setTimeout(function () {
              ring.style.strokeDashoffset = offset;
            }, index * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    var categories = document.querySelectorAll('.skill-category');
    categories.forEach(function (cat) {
      observer.observe(cat);
    });
  }

  /* ================================================
     LANGUAGE BARS (Animated Fill)
     ================================================ */
  function initLanguageBars() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bars = entry.target.querySelectorAll('.lang-bar-fill');
          bars.forEach(function (bar, index) {
            var percent = bar.getAttribute('data-percent') || 0;
            setTimeout(function () {
              bar.style.width = percent + '%';
            }, index * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    var langSection = document.querySelector('.languages');
    if (langSection) observer.observe(langSection);
  }

  /* ================================================
     INITIALIZATION
     ================================================ */
  function init() {
    initNavigation();
    initTypedEffect();
    initNodeNetwork();
    initScrollReveals();
    initRadarChart();
    initProgressRings();
    initLanguageBars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ================================================
// AI ENABLEMENT CHECK QUIZ
// ================================================
(function () {
  const TOTAL_STEPS = 6;
  let answers = [];
  let currentStep = 0;

  const results = {
    A: {
      type: 'Typ A · 0–33 % Potenzial',
      headline: 'Gut aufgestellt – aber Luft nach oben bleibt.',
      body: 'Ihre Prozesse laufen bereits solide. Dennoch gibt es oft versteckte Potenziale bei High-End Custom Agents, die Ihre Mitarbeiter von Routineentscheidungen entlasten. Sprechen wir darüber, was möglich ist.',
      ctaLabel: 'Custom Agents besprechen',
      ctaSubject: 'Typ A – Custom Agents Gespräch'
    },
    B: {
      type: 'Typ B · 34–67 % Potenzial',
      headline: 'Solides Fundament – aber Sie verlieren täglich Zeit.',
      body: 'Sie haben ein gutes Fundament, aber fehlende Schnittstellen und manuelle Schritte fressen wertvolle Kapazität. n8n könnte Ihr Betriebssystem für Effizienz werden und Ihre Tools nahtlos verbinden.',
      ctaLabel: 'n8n-Strategie-Call anfragen',
      ctaSubject: 'Typ B – n8n Strategie-Call'
    },
    C: {
      type: 'Typ C · 68–100 % Potenzial',
      headline: 'Akuter Handlungsbedarf – Ihr Team arbeitet für die Tools.',
      body: 'Ihre Situation ist klar: Manuelle Prozesse blockieren Wachstum und kosten täglich Geld. AI Agents könnten bis zu 80 % Ihrer Routineaufgaben übernehmen. Lassen Sie uns gemeinsam analysieren, wo der größte Hebel liegt.',
      ctaLabel: 'Sofort-Analyse anfordern',
      ctaSubject: 'Typ C – Sofort-Analyse KI-Enablement'
    }
  };

  function calcResultType() {
    const total = answers.reduce(function (sum, v) { return sum + v; }, 0);
    if (total <= 4) return 'A';
    if (total <= 8) return 'B';
    return 'C';
  }

  function updateProgress(step) {
    const bar = document.getElementById('quizProgressBar');
    if (bar) bar.style.width = ((step / TOTAL_STEPS) * 100) + '%';
  }

  function showStep(index) {
    document.querySelectorAll('.quiz-step').forEach(function (el) {
      el.classList.remove('is-active');
    });
    const targetId = index < TOTAL_STEPS ? 'quizStep' + index : 'quizResult';
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add('is-active');
      updateProgress(index < TOTAL_STEPS ? index : TOTAL_STEPS);
    }
  }

  function showResult() {
    const type = calcResultType();
    const r = results[type];
    const resultEl = document.getElementById('quizResult');
    if (!resultEl) return;
    resultEl.innerHTML =
      '<p class="quiz-result-type">' + r.type + '</p>' +
      '<h3 class="quiz-result-headline">' + r.headline + '</h3>' +
      '<p class="quiz-result-body">' + r.body + '</p>' +
      '<a href="mailto:peter-jacob@web.de?subject=' + encodeURIComponent(r.ctaSubject) + '" class="quiz-result-cta">' +
        r.ctaLabel +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
      '</a>' +
      '<button class="quiz-result-restart" id="quizRestart" type="button">Nochmal starten</button>';
    showStep(TOTAL_STEPS);
    const restartBtn = document.getElementById('quizRestart');
    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        resetQuiz();
        showStep(0);
      });
    }
  }

  function resetQuiz() {
    answers = [];
    currentStep = 0;
    document.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.classList.remove('is-selected');
    });
    updateProgress(0);
  }

  function openModal() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    resetQuiz();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    showStep(0);
    const trigger = document.getElementById('quizTrigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeModal() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    const trigger = document.getElementById('quizTrigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  }

  function init() {
    const trigger = document.getElementById('quizTrigger');
    const modal = document.getElementById('quizModal');
    const closeBtn = document.getElementById('quizClose');
    if (!trigger || !modal) return;

    trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const backdrop = modal.querySelector('.quiz-modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    document.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const step = parseInt(btn.dataset.step, 10);
        const value = parseInt(btn.dataset.value, 10);
        document.querySelectorAll('.quiz-option[data-step="' + step + '"]').forEach(function (s) {
          s.classList.remove('is-selected');
        });
        btn.classList.add('is-selected');
        answers[step] = value;
        currentStep = step + 1;
        setTimeout(function () {
          if (currentStep < TOTAL_STEPS) {
            showStep(currentStep);
          } else {
            showResult();
          }
        }, 280);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
