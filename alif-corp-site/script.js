/* ==================================================================
   ALIF CORP - script.js
   Navigation, révélations au scroll, FAQ, formulaire 2 étapes,
   CTA sticky mobile, diagramme écosystème, dataLayer.
   ================================================================== */
(function () {
  "use strict";

  /* dataLayer prêt pour Google Tag Manager */
  window.dataLayer = window.dataLayer || [];
  function track(eventName, params) {
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }

  var reduireAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    /(^|[?&])sansanim/.test(window.location.search);

  /* Sans animations : on retire la classe "js" qui conditionne le masquage
     initial des éléments .rev - tout est visible immédiatement, sans transition. */
  if (reduireAnimations) {
    document.documentElement.classList.remove("js");
  }

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------------------------------------
       1. Header - ombre au défilement
       --------------------------------------------------------------- */
    var header = document.querySelector(".site-header");
    function surDefilement() {
      if (header) header.classList.toggle("defile", window.scrollY > 10);
    }
    window.addEventListener("scroll", surDefilement, { passive: true });
    surDefilement();

    /* ---------------------------------------------------------------
       2. Menu mobile (burger) - accessible
       --------------------------------------------------------------- */
    var burger = document.querySelector(".burger");
    var menu = document.getElementById("menu-principal");

    function fermerMenu() {
      if (!burger || !menu) return;
      menu.classList.remove("ouvert");
      burger.classList.remove("ouvert");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu");
      document.body.classList.remove("nav-ouverte");
    }
    function ouvrirMenu() {
      if (!burger || !menu) return;
      menu.classList.add("ouvert");
      burger.classList.add("ouvert");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Fermer le menu");
      document.body.classList.add("nav-ouverte");
    }
    if (burger && menu) {
      burger.addEventListener("click", function () {
        menu.classList.contains("ouvert") ? fermerMenu() : ouvrirMenu();
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", fermerMenu);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("ouvert")) {
          fermerMenu();
          burger.focus();
        }
      });
    }

    /* ---------------------------------------------------------------
       3. Révélation au défilement
       --------------------------------------------------------------- */
    var revEls = document.querySelectorAll(".rev, .eco-anime");
    if (!reduireAnimations && "IntersectionObserver" in window && revEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -36px 0px" });
      revEls.forEach(function (el) { io.observe(el); });
    } else {
      revEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------------------------------------------------------------
       4. FAQ - accordéon accessible
       --------------------------------------------------------------- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var r = item.querySelector(".faq-r");
      if (!q || !r) return;
      q.addEventListener("click", function () {
        var ouvert = item.classList.contains("ouvert");
        var groupe = item.closest(".faq");
        if (groupe) {
          groupe.querySelectorAll(".faq-item.ouvert").forEach(function (autre) {
            if (autre !== item) {
              autre.classList.remove("ouvert");
              autre.querySelector(".faq-r").style.maxHeight = null;
              autre.querySelector(".faq-q").setAttribute("aria-expanded", "false");
            }
          });
        }
        item.classList.toggle("ouvert", !ouvert);
        q.setAttribute("aria-expanded", String(!ouvert));
        r.style.maxHeight = !ouvert ? r.scrollHeight + "px" : null;
      });
    });

    /* ---------------------------------------------------------------
       5. Année courante (footer)
       --------------------------------------------------------------- */
    document.querySelectorAll(".js-annee").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* ---------------------------------------------------------------
       6. Micro-conversions via attribut data-event
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
       7. Diagramme écosystème - surbrillance des connexions
       --------------------------------------------------------------- */
    document.querySelectorAll("[data-lien]").forEach(function (noeud) {
      var cibles = (noeud.getAttribute("data-lien") || "").split(" ");
      function basculer(actif) {
        cibles.forEach(function (id) {
          var chemin = document.getElementById(id);
          if (chemin) chemin.classList.toggle("actif", actif);
        });
      }
      noeud.addEventListener("mouseenter", function () { basculer(true); });
      noeud.addEventListener("mouseleave", function () { basculer(false); });
      noeud.addEventListener("focus", function () { basculer(true); });
      noeud.addEventListener("blur", function () { basculer(false); });
    });

    /* ---------------------------------------------------------------
       8. CTA sticky mobile - discret, après le hero
       --------------------------------------------------------------- */
    var ctaMobile = document.querySelector(".cta-mobile");
    if (ctaMobile) {
      var majCta = function () {
        var visible = window.scrollY > 520 && !document.body.classList.contains("nav-ouverte");
        ctaMobile.classList.toggle("visible", visible);
        document.body.classList.toggle("a-cta-mobile", visible);
      };
      window.addEventListener("scroll", majCta, { passive: true });
      majCta();
    }

    /* ---------------------------------------------------------------
       9. Événements de page (contact vu, lead confirmé)
       --------------------------------------------------------------- */
    var page = document.body.getAttribute("data-page");
    if (page === "contact") track("view_contact");
    if (page === "merci") track("lead_confirme");

    /* ---------------------------------------------------------------
       10. Formulaire de contact - 2 étapes, validation, envoi
       --------------------------------------------------------------- */
    var form = document.getElementById("form-contact");
    if (form) {
      var etapes = form.querySelectorAll(".form-etape");
      var barre = document.querySelector(".progression .barre i");
      var libelles = document.querySelectorAll(".progression .etapes span");
      var courante = 0;
      var demarre = false;

      form.addEventListener("input", function (e) {
        if (!demarre) { demarre = true; track("form_start_contact"); }
        /* efface l'erreur dès la correction */
        var champ = e.target;
        if (champ.classList.contains("invalide")) validerChamp(champ);
      });

      function messageErreur(champ, visible) {
        var conteneur = champ.closest(".champ") || champ.closest(".consentement");
        if (!conteneur) return;
        var msg = conteneur.querySelector(".erreur");
        if (msg) msg.classList.toggle("visible", visible);
        champ.classList.toggle("invalide", visible);
        champ.setAttribute("aria-invalid", visible ? "true" : "false");
      }

      function validerChamp(champ) {
        var ok = true;
        var valeur = (champ.value || "").trim();
        if (champ.type === "checkbox") ok = champ.checked;
        else if (champ.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);
        else if (champ.hasAttribute("required")) ok = valeur !== "";
        messageErreur(champ, !ok);
        return ok;
      }

      function validerEtape(indice) {
        var valide = true;
        var premier = null;
        etapes[indice].querySelectorAll("[required]").forEach(function (champ) {
          if (!validerChamp(champ)) {
            valide = false;
            if (!premier) premier = champ;
          }
        });
        if (premier) premier.focus();
        return valide;
      }

      function afficherEtape(indice) {
        etapes.forEach(function (etape, i) {
          etape.hidden = i !== indice;
        });
        if (barre) barre.style.width = indice === 0 ? "50%" : "100%";
        libelles.forEach(function (l, i) { l.classList.toggle("active", i <= indice); });
        courante = indice;
        var premierChamp = etapes[indice].querySelector("input, select, textarea");
        if (premierChamp && indice > 0) premierChamp.focus();
      }

      var btnSuivant = form.querySelector("[data-suivant]");
      var btnRetour = form.querySelector("[data-retour]");
      if (btnSuivant) {
        btnSuivant.addEventListener("click", function () {
          if (validerEtape(0)) {
            afficherEtape(1);
            track("form_etape_2_contact");
          }
        });
      }
      if (btnRetour) {
        btnRetour.addEventListener("click", function () { afficherEtape(0); });
      }

      form.addEventListener("submit", function (e) {
        if (!validerEtape(courante)) {
          e.preventDefault();
          track("form_error_contact");
          return;
        }
        track("form_submit_contact", {
          besoin: (form.querySelector('[name="besoin"]') || {}).value || "",
          objectif: (form.querySelector('[name="objectif"]') || {}).value || ""
        });
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }

        /* En local (ouverture du fichier sans serveur), simule la redirection.
           En ligne, Netlify Forms capture l'envoi natif et redirige vers /merci. */
        if (location.protocol === "file:") {
          e.preventDefault();
          window.setTimeout(function () { window.location.href = "merci.html"; }, 350);
        }
      });
    }

  });
})();
