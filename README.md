# Site Alif Corp — Acquisition digitale pour PME

Site vitrine premium, statique (HTML / CSS / JavaScript), orienté génération de leads.
Aucune dépendance, aucun build : ouvrez `index.html` dans un navigateur, ou déposez le dossier sur un hébergeur (Netlify, OVH, etc.).

---

## 1. Contenu du site

**16 pages** + design system :

| Page | Fichier |
|------|---------|
| Accueil | `index.html` |
| Services | `services.html` |
| Google Ads | `google-ads.html` |
| SEO local & Google Business Profile | `seo-local.html` |
| Création de site vitrine | `creation-site-vitrine.html` |
| Tracking & conversions | `tracking-conversions.html` |
| Méthode | `methode.html` |
| Portfolio (volontairement vide) | `portfolio.html` |
| À propos | `a-propos.html` |
| Ressources | `ressources.html` |
| Contact / Demande de devis | `contact.html` |
| Merci (page de conversion) | `merci.html` |
| 404 | `404.html` |
| Mentions légales | `mentions-legales.html` |
| Politique de confidentialité | `politique-confidentialite.html` |
| Politique de cookies | `politique-cookies.html` |

Fichiers communs : `style.css` (charte + composants), `script.js` (interactions, formulaire, tracking),
`robots.txt`, `sitemap.xml`, et le dossier `assets/` (`logo/`, `images/`, `icons/`).

---

## 2. À FAIRE avant la mise en ligne (important)

1. **Photo du fondateur** — déposez le fichier `assets/images/fondateur.jpg`.
   Tant qu'il est absent, un visuel de repli élégant (monogramme « A ») s'affiche.
   Voir `assets/images/LISEZ-MOI-photo-fondateur.txt`.
   Pensez à remplacer « Fondateur · Alif Corp » par le vrai nom dans `index.html` et `a-propos.html`.

2. **Coordonnées** — l'email `contact@alifcorp.fr` est utilisé partout (issu de la charte).
   Vérifiez / remplacez-le, et pour activer le téléphone, décommentez le bloc `<li>` correspondant dans le footer
   (recherchez `Téléphone (optionnel)`).

3. **Mentions légales** — complétez les champs marqués `à compléter` dans les 3 pages légales
   (`mentions-legales.html`, `politique-confidentialite.html`, `politique-cookies.html`).
   Aucune donnée juridique n'a été inventée.

4. **Domaine** — remplacez `https://www.alifcorp.fr` par votre domaine réel dans :
   `robots.txt`, `sitemap.xml`, et les balises `canonical` / `og:url` de chaque page.

---

## 3. Formulaire de contact

Par défaut (démo / ouverture locale) : le formulaire est validé en JavaScript puis redirige vers `merci.html`.
Les données ne sont **pas** encore envoyées à un serveur.

### Activer l'envoi réel des demandes
Le formulaire est déjà préparé pour **Netlify Forms**. Pour l'activer (déploiement sur Netlify) :

1. Dans `contact.html`, sur la balise `<form id="form-contact" ...>`, ajoutez les attributs :
   ```html
   data-netlify="true" netlify-honeypot="bot-field"
   ```
2. C'est tout. Le script détecte l'attribut `data-netlify` et laisse l'envoi natif se faire ;
   Netlify capture la demande et redirige vers `merci.html` (déjà défini dans `action`).

Autre option (sans Netlify) : remplacez l'`action` du formulaire par votre endpoint
(Formspree, Make, API…) ou branchez votre propre script d'envoi dans `script.js`.

---

## 4. Tracking (Google Tag Manager / Analytics)

- **Emplacement GTM** : un commentaire `<!-- Google Tag Manager ... -->` est présent en haut du `<body>`
  de chaque page. Collez-y votre conteneur `GTM-XXXXXXX` (et le `<noscript>` juste après l'ouverture du body si souhaité).
- **`dataLayer`** est initialisé dans `script.js`. Les événements sont poussés automatiquement.

### Événements disponibles (attribut `data-event` + pushes auto)
| Événement | Déclencheur |
|-----------|-------------|
| `cta_demander_devis` | clic « Demander un devis » |
| `cta_audit_google_ads` | clic « Demander un audit Google Ads » |
| `cta_visibilite_locale` / `cta_audit_local` | CTA SEO local |
| `cta_creer_site` | CTA site vitrine |
| `cta_mettre_tracking` / `cta_audit_tracking` | CTA tracking |
| `cta_discuter_strategie` / `cta_parler_projet` / `cta_demander_audit` | autres CTA |
| `nav_service_*`, `nav_methode` | clics vers les pages services / méthode |
| `click_email`, `click_phone` | clics email / téléphone |
| `view_contact` | affichage de la page contact |
| `form_start_contact` | début de saisie du formulaire |
| `form_submit_contact` | **conversion principale** (envoi valide) |
| `form_error_contact` | soumission invalide |
| `lead_confirme` | affichage de la page `merci.html` |

→ Conversion Google Ads recommandée : déclenchez-la dans GTM sur l'événement `lead_confirme`
(page `/merci`) ou `form_submit_contact`.

---

## 5. URLs propres (optionnel)

Les liens internes utilisent les fichiers `.html` (fonctionne partout, y compris en local).
Pour des URLs sans `.html` (ex. `/services/google-ads`) sur Netlify, ajoutez un fichier `netlify.toml`
avec des redirections, ou activez « Pretty URLs ». Ce n'est pas nécessaire au fonctionnement du site.

---

## 6. Charte respectée

- **Couleurs** : Vert Signature `#004A11`, Vert Forêt `#013220`, Blanc Premium `#F7F7F5`,
  secondaires (Vert Sauge, Beige Pierre, Champagne) et accent Or Doux `#BFA76A` — définies en variables CSS (`:root`).
- **Typographies** : Cormorant Garamond (titres) + Manrope (textes), chargées via Google Fonts.
- **Logo** : reproduit fidèlement en typographie native (non déformé, non recoloré). Favicon : `assets/logo/favicon.svg`.

Pour ajuster une couleur ou un espacement globalement, modifiez les variables en haut de `style.css`.

---

© Alif Corp — Site livré prêt à personnaliser.
