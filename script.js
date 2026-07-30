const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();
  const errorMsg = document.getElementById("errorMsg");
  const phoneDigits = phone.replace(/\D/g, "");

  errorMsg.style.display = "none";

  if (name === "" || phone === "") {
    errorMsg.textContent = "Пожалуйста, заполните все поля";
    errorMsg.style.display = "block";
    return;
  }

  if (phoneDigits.length < 10) {
    errorMsg.textContent = "Пожалуйста, введите корректный номер телефона";
    errorMsg.style.display = "block";
    return;
  }

  fetch("https://salon-server-production-85f7.up.railway.app/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, message })
  })
  .then(function() {
    successMsg.style.display = "block";
    document.getElementById("nameInput").value = "";
    document.getElementById("phoneInput").value = "";
    document.getElementById("messageInput").value = "";
    document.getElementById("submitBtn").disabled = true;
  })
  .catch(function() {
    errorMsg.textContent = "Что-то пошло не так. Попробуйте позже или позвоните нам.";
    errorMsg.style.display = "block";
  });
});

/* ===== Аккордеон услуг ===== */
const accordionHeads = document.querySelectorAll(".accordion-head");

accordionHeads.forEach(function (head) {
  head.addEventListener("click", function () {
    const item = head.parentElement;
    const body = item.querySelector(".accordion-body");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".accordion-item.open").forEach(function (openItem) {
      openItem.classList.remove("open");
      openItem.querySelector(".accordion-body").style.maxHeight = null;
      openItem.querySelector(".accordion-head").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      body.style.maxHeight = body.scrollHeight + "px";
      head.setAttribute("aria-expanded", "true");
    }
  });
});

/* ===== Прокрутка: кнопка наверх + фон навбара ===== */
const scrollTopBtn = document.getElementById("scrollTop");
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }

  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

scrollTopBtn.addEventListener("click", function () {
  if (window.__lenis) window.__lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== Мобильное меню ===== */
const burgerBtn = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");

burgerBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
});

/* ===== Слайдеры (карусели) ===== */
function debounce(fn, wait) {
  let t;
  return function () {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, arguments), wait);
  };
}

function initSlider(root) {
  const track = root.querySelector(".slider-track");
  if (!track) return;
  const slides = Array.from(track.children);
  if (!slides.length) return;
  const prevBtn = root.querySelector(".slider-arrow.prev");
  const nextBtn = root.querySelector(".slider-arrow.next");
  const dotsWrap = root.querySelector(".slider-dots");
  const perDesktop = parseInt(root.dataset.per || "3", 10);
  const autoplayMs = parseInt(root.dataset.autoplay || "0", 10);

  let index = 0;
  let perView = perDesktop;
  let autoTimer = null;
  let startX = 0;
  let dragging = false;
  let moved = false;

  function getPerView() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1024) return Math.min(2, perDesktop);
    return perDesktop;
  }

  function getGap() {
    return parseFloat(getComputedStyle(track).columnGap) || 0;
  }

  function maxIndex() {
    return Math.max(0, slides.length - perView);
  }

  function sizeSlides() {
    perView = getPerView();
    const gap = getGap();
    const basis = `calc((100% - ${(perView - 1) * gap}px) / ${perView})`;
    slides.forEach(function (s) {
      s.style.flex = "0 0 " + basis;
      s.style.maxWidth = basis;
    });
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    const gap = getGap();
    const slideW = slides[0].getBoundingClientRect().width;
    track.style.transform = "translateX(-" + index * (slideW + gap) + "px)";
    updateControls();
  }

  function updateControls() {
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex();
    Array.from(dotsWrap.children).forEach(function (d, i) {
      d.classList.toggle("active", i === index);
    });
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Слайд " + (i + 1));
      b.addEventListener("click", function () {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(b);
    }
  }

  function relayout() {
    sizeSlides();
    requestAnimationFrame(function () {
      if (index > maxIndex()) index = maxIndex();
      buildDots();
      goTo(index);
    });
  }

  function startAuto() {
    if (!autoplayMs) return;
    autoTimer = setInterval(function () {
      if (index >= maxIndex()) goTo(0);
      else goTo(index + 1);
    }, autoplayMs);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAuto() {
    if (autoplayMs) {
      stopAuto();
      startAuto();
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); restartAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); restartAuto(); });

  root.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".slider-arrow") || e.target.closest(".slider-dots")) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
  });

  root.addEventListener("pointermove", function (e) {
    if (dragging && Math.abs(e.clientX - startX) > 8) moved = true;
  });

  window.addEventListener("pointerup", function (e) {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 45) {
      goTo(index + (dx < 0 ? 1 : -1));
      restartAuto();
    }
  });

  track.addEventListener("click", function (e) {
    if (moved) {
      e.stopPropagation();
      e.preventDefault();
      moved = false;
    }
  }, true);

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", function () { if (autoplayMs) startAuto(); });

  window.addEventListener("resize", debounce(relayout, 150));
  window.addEventListener("load", relayout);

  relayout();
  startAuto();
}

document.querySelectorAll(".slider").forEach(initSlider);

/* ===== Лайтбокс портфолио ===== */
(function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll(".portfolio-slider .work-item").forEach(function (item) {
    item.addEventListener("click", function () {
      const img = item.querySelector("img");
      open(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener("click", close);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();

/* ===== Падающие лепестки сакуры ===== */
(function createPetals() {
  const container = document.getElementById("petals");
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const size = 10 + Math.random() * 12;
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.width = size + "px";
    petal.style.height = size + "px";
    petal.style.animationDuration = 8 + Math.random() * 9 + "s";
    petal.style.animationDelay = -(Math.random() * 12) + "s";
    petal.style.opacity = 0.4 + Math.random() * 0.4;

    container.appendChild(petal);
  }
})();

/* ===== Плавный скролл + анимации (по рекомендациям ui-ux-pro-max) ===== */
(function initMotion() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 });
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Якорные ссылки через Lenis (важно для кнопок «Записаться»)
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const el = document.querySelector(id);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el, { offset: -70 });
          }
        }
      });
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on("scroll", ScrollTrigger.update);

    // Параллакс контента hero
    gsap.to(".hero-inner", {
      yPercent: 16,
      opacity: 0.85,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Счётчик статистики
    document.querySelectorAll(".stat-num").forEach(function (el) {
      const raw = el.textContent.trim();
      const target = parseInt(raw.replace(/\D/g, ""), 10) || 0;
      const suffix = raw.replace(/[0-9]/g, "");
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent = Math.round(obj.v) + suffix;
            }
          });
        }
      });
    });
  }
})();
