document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function setNavOpen(isOpen) {
    mainNav.classList.toggle('open', isOpen);
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-lock', isOpen);
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!mainNav.classList.contains('open'));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNavOpen(false);
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (header) {
      header.style.boxShadow = y > 10 ? '0 8px 24px rgba(0,0,0,.35)' : 'none';
    }
    lastScroll = y;

    var backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.classList.toggle('visible', y > 500);
  }, { passive: true });

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-up');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- FAQ accordion ---------- */
  var triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(function (trigger) {
    var panel = trigger.nextElementSibling;
    panel.style.maxHeight = '0px';

    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all others
      triggers.forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.style.maxHeight = '0px';
        }
      });

      trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel.style.maxHeight = expanded ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Testimonials carousel ---------- */
  var track = document.getElementById('carouselTrack');
  var prevBtn = document.getElementById('carPrev');
  var nextBtn = document.getElementById('carNext');
  var dotsWrap = document.getElementById('carDots');

  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var current = 0;
    var autoTimer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    function update() {
      track.style.transform = 'translateX(' + (-100 * current) + '%)';
      Array.prototype.slice.call(dotsWrap.children).forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      update();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

    function startAuto() { autoTimer = setInterval(next, 6000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();

    var carouselEl = document.getElementById('testiCarousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
      carouselEl.addEventListener('mouseleave', startAuto);
    }
  }

  /* ---------- Contact form ----------
     This is a static site with no backend/server to receive submissions,
     so instead of pretending to "send" the form, we hand the visitor's
     details straight to WhatsApp as a pre-filled message. This actually
     reaches Sumit Kumar instantly instead of disappearing into nothing. */
  var WHATSAPP_NUMBER = '919910980774';
  var form = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        formNote.textContent = 'Please fill in all required fields correctly.';
        formNote.style.color = '#c92f26';
        return;
      }

      var name = document.getElementById('fname').value.trim();
      var phone = document.getElementById('fphone').value.trim();
      var email = document.getElementById('femail').value.trim();
      var goal = document.getElementById('fgoal').value;
      var message = document.getElementById('fmessage').value.trim();

      var lines = [
        'Hi Logical Fitness, I\u2019d like to book a free consultation.',
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + email,
        'Goal: ' + goal
      ];
      if (message) lines.push('Message: ' + message);

      var waText = encodeURIComponent(lines.join('\n'));
      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText;

      formNote.style.color = '#c6a15b';
      formNote.textContent = 'Thanks, ' + name + '! Opening WhatsApp so you can send these details directly to Sumit\u2019s team\u2026';

      window.open(waUrl, '_blank', 'noopener');
      form.reset();
    });
  }

});
