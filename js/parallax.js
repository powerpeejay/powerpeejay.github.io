/* ================================================
   PARALLAX ENGINE
   Custom scroll-based parallax with rAF throttling
   ================================================ */
(function () {
  'use strict';

  var isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMobile || prefersReducedMotion) return;

  var parallaxElements = [];
  var ticking = false;

  function cacheElements() {
    var els = document.querySelectorAll('[data-speed]');
    parallaxElements = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      el.classList.add('parallax-active');
      parallaxElements.push({
        el: el,
        speed: parseFloat(el.dataset.speed) || 0.5,
        parent: el.closest('section') || el.parentElement
      });
    }
  }

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function updateParallax() {
    var scrollY = window.pageYOffset;

    for (var i = 0; i < parallaxElements.length; i++) {
      var item = parallaxElements[i];
      if (!isInViewport(item.parent)) continue;

      var offset = scrollY * item.speed;
      item.el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
    if (isMobile) {
      // Reset transforms
      for (var i = 0; i < parallaxElements.length; i++) {
        parallaxElements[i].el.style.transform = '';
        parallaxElements[i].el.classList.remove('parallax-active');
      }
      window.removeEventListener('scroll', onScroll);
    }
  });

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cacheElements);
  } else {
    cacheElements();
  }
})();
