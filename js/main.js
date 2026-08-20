/* main.js — общий скрипт сайта. Классический скрипт (работает и по file://). */
(function () {
  "use strict";

  // Мобильное меню
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("is-open");
    });
  }

  // Reveal-анимации при скролле. Проверяем фактическую позицию элемента —
  // надёжно при любой скорости прокрутки (IntersectionObserver пропускает
  // мгновенные переходы false→false при «прыжке» к низу).
  var pending = [].slice.call(document.querySelectorAll(".reveal"));
  if (pending.length) {
    var ticking = false;
    var check = function () {
      ticking = false;
      var line = window.innerHeight * 0.9;
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("is-in");
          return false;
        }
        return true;
      });
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
  }

  // Подсветка активной секции в навигации (scrollspy) — только на лендинге
  var anchorLinks = nav
    ? [].slice.call(nav.querySelectorAll('a[href^="#"]'))
    : [];
  if (anchorLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    anchorLinks.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          var link = byId[en.target.id];
          if (!link) return;
          if (en.isIntersecting) {
            anchorLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }
})();
