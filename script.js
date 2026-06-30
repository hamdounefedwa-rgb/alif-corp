/* =================================================================
   ALIF CORP — script.js
   Navigation, animations au scroll, FAQ, formulaire & tracking
   ================================================================= */
(function () {
  "use strict";

  /* dataLayer prêt pour Google Tag Manager */
  window.dataLayer = window.dataLayer || [];
  function track(eventName, params) {
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------------------------------------
       1. Header sticky — ombre au scroll
       --------------------------------------------------------------- */
    var header = document.querySelector(".site-header");
    function onScroll() {
      if (!header) return;
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------------------------------------------------------------
       2. Menu mobile (burger)
       --------------------------------------------------------------- */
    var burger = document.querySelector(".burger");
    var navLinks = document.querySelector(".nav-links");
    if (burger && navLinks) {
      burger.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("nav-open", open);
      });
      /* Fermer le menu au clic sur un lien réel (pas le déclencheur de sous-menu) */
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          navLinks.classList.remove("open");
          burger.classList.remove("open");
          document.body.classList.remove("nav-open");
        });
      });
    }

    /* ---------------------------------------------------------------
       3. Dropdown Services — accordéon sur mobile, hover sur desktop
       --------------------------------------------------------------- */
    document.querySelectorAll(".nav-item--has-menu").forEach(function (item) {
      var trigger = item.querySelector(".nav-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function (e) {
        /* En mobile uniquement, le déclencheur ouvre/ferme le sous-menu */
        if (window.matchMedia("(max-width: 900px)").matches) {
          e.preventDefault();
          item.classList.toggle("open");
        }
      });
    });

    /* ---------------------------------------------------------------
       4. Apparition au scroll (IntersectionObserver)
       --------------------------------------------------------------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------------------------------------------------------------
       5. FAQ — accordéon accessible
       --------------------------------------------------------------- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        /* Optionnel : fermer les autres dans le même groupe */
        var group = item.closest(".faq");
        if (group) {
          group.querySelectorAll(".faq-item.open").forEach(function (other) {
            if (other !== item) {
              other.classList.remove("open");
              other.querySelector(".faq-a").style.maxHeight = null;
              other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
            }
          });
        }
        item.classList.toggle("open", !isOpen);
        q.setAttribute("aria-expanded", (!isOpen).toString());
        a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
      });
    });

    /* ---------------------------------------------------------------
       6. Année courante (footer)
       --------------------------------------------------------------- */
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* ---------------------------------------------------------------
       7. Tracking micro-conversions via attribut data-event
       --------------------------------------------------------------- */
    document.querySelectorAll("[data-event]").forEach(function (el) {
      el.addEventListener("click", function () {
        track(el.getAttribute("data-event"), {
          label: (el.textContent || "").trim().slice(0, 60),
          page: document.body.getAttribute("data-page") || location.pathname
        });
      });
    });

    /* ---------------------------------------------------------------
       8. Formulaire de contact — validation + tracking + redirection
       --------------------------------------------------------------- */
    var form = document.getElementById("form-contact");
    if (form) {
      var started = false;
      form.addEventListener("input", function () {
        if (!started) { started = true; track("form_start_contact"); }
      });

      form.addEventListener("submit", function (e) {
        var valid = true;
        var firstInvalid = null;

        /* Champs requis */
        form.querySelectorAll("[required]").forEach(function (field) {
          var ok = true;
          if (field.type === "checkbox") { ok = field.checked; }
          else if (field.type === "email") { ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()); }
          else { ok = field.value.trim() !== ""; }

          field.classList.toggle("field-error", !ok);
          var err = field.closest(".field, .check--rgpd");
          if (err) {
            var msg = err.querySelector(".error-msg");
            if (msg) msg.classList.toggle("show", !ok);
          }
          if (!ok && !firstInvalid) { firstInvalid = field; }
          if (!ok) valid = false;
        });

        if (!valid) {
          e.preventDefault();
          track("form_error_contact");
          if (firstInvalid) { firstInvalid.focus(); }
          return;
        }

        /* Conversion principale */
        track("form_submit_contact", {
          besoin: (form.querySelector('[name="besoin"]') || {}).value || "",
          objectif: (form.querySelector('[name="objectif"]') || {}).value || ""
        });

        var btn = form.querySelector('button[type="submit"]');

        /* Si le formulaire est branché sur un backend (ex. Netlify Forms via data-netlify),
           on laisse l'envoi natif se faire — la redirection vers /merci est gérée par l'action.
           Sinon (démo / ouverture locale), on redirige nous-mêmes vers la page de remerciement. */
        if (form.hasAttribute("data-netlify")) {
          if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }
          return; /* envoi natif */
        }

        e.preventDefault();
        if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }
        window.setTimeout(function () { window.location.href = "merci.html"; }, 400);
      });
    }

  });
})();
