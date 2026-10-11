(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const links = navLinks.querySelectorAll("a");

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Placeholder photo if profile.jpg is missing
  const photo = document.getElementById("profilePhoto");
  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>" +
        "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
        "<stop offset='0' stop-color='#1b1b22'/><stop offset='1' stop-color='#0e0e12'/></linearGradient></defs>" +
        "<rect width='400' height='500' fill='url(#g)'/>" +
        "<circle cx='200' cy='190' r='72' fill='#d4a64a' opacity='.85'/>" +
        "<path d='M60 500c0-92 62-150 140-150s140 58 140 150z' fill='#d4a64a' opacity='.85'/>" +
        "<text x='200' y='470' text-anchor='middle' font-family='sans-serif' font-size='16' fill='#0a0a0c'>Add profile.jpg</text>" +
        "</svg>"
    );
  photo.addEventListener("error", function () {
    photo.src = placeholder;
  }, { once: true });

  // Navbar background on scroll
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function setMenu(open) {
    toggle.classList.toggle("open", open);
    navLinks.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("open"));
  });
  links.forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  // Reveal on scroll + counters
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = el.dataset.count;
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
