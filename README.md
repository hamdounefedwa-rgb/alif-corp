# Site Alif Corp - v2 (refonte)

Site statique premium (HTML / CSS / JavaScript), orienté génération de leads.
Aucune dépendance, aucun build : le dépôt se déploie tel quel.

## Déploiement (GitHub -> Netlify)

1. Sur [Netlify](https://app.netlify.com) : **Add new site -> Import an existing project -> GitHub**,
   puis choisissez ce dépôt.
2. Aucune configuration à saisir : `netlify.toml` définit tout (publication à la racine,
   redirections via `_redirects`, en-têtes de sécurité et de cache).
3. Chaque `git push` sur `main` déclenche automatiquement une mise en production.
4. Activez les notifications **Forms** (Site settings -> Forms) pour recevoir les demandes
   du formulaire de contact par e-mail.

---

## 1. Pages

| Page | Fichier |
|------|---------|
| Accueil | `index.html` |
| Google Ads (expertise principale) | `google-ads.html` |
| SEO local & Google Business Profile | `seo-local.html` |
| Sites & landing pages | `sites-landing-pages.html` |
| Tracking & conversions (socle) | `tracking-conversions.html` |
| Résultats & méthodologie de mesure | `resultats.html` |
| À propos | `a-propos.html` |
| Contact (formulaire 2 étapes) | `contact.html` |
| Confirmation d'envoi | `merci.html` |
| 404 | `404.html` |
| Mentions légales / Confidentialité / Cookies | `mentions-legales.html`, `politique-confidentialite.html`, `politique-cookies.html` |

Fichiers communs : `style.css` (design system complet), `script.js` (navigation, révélations,
FAQ, formulaire 2 étapes, dataLayer), `robots.txt`, `sitemap.xml`, `_redirects` (Netlify),
`assets/logo/favicon.svg`.

Anciennes pages (`services`, `methode`, `ressources`, `portfolio`, `creation-site-vitrine`)
supprimées et redirigées en 301 via `_redirects`.

---

## 2. À faire avant / après la mise en ligne

1. **Portrait de la fondatrice** - déposez simplement `assets/images/fondatrice.jpg` :
   le site l'affiche automatiquement (accueil + À propos). En attendant, un monogramme
   élégant « F.H » s'affiche - aucun placeholder visible.

2. **Études de cas & témoignages** - des gabarits complets sont prêts **en commentaires HTML** :
   - accueil : sections « Étude de cas » et « Témoignages » ;
   - `google-ads.html` : section « Étude de cas » ;
   - `resultats.html` : cartes d'études de cas.
   Remplacez les valeurs `[entre crochets]` par des données réelles (avec accord écrit du client),
   puis retirez les commentaires. **Ne publiez jamais de chiffres inventés.**

3. **Preuves chiffrées de l'accueil** - un bloc commenté dans `index.html`
   (« PREUVES CHIFFRÉES ») permet d'ajouter nombre de comptes, secteurs, logos clients
   dès que ces données existent.

4. **Mentions légales** - complétez forme juridique / SIRET / adresse dans
   `mentions-legales.html` (emplacement indiqué en commentaire HTML).

5. **Domaine** - le site utilise `https://www.alifcorp.fr` dans les canonicals, le sitemap
   et robots.txt. Si le domaine final diffère, faites un rechercher-remplacer global.

---

## 3. Formulaire de contact (Netlify Forms)

Le formulaire (`contact.html`) est **déjà actif pour Netlify** :
`data-netlify="true"`, honeypot `bot-field`, champ caché `form-name`, redirection vers `merci.html`.

- Sur Netlify : les demandes arrivent dans l'onglet **Forms** (pensez à activer les
  notifications e-mail vers `contact@alifcorp.fr`).
- En local (`file://`) : le script simule l'envoi et redirige vers `merci.html`.
- Autre hébergeur : remplacez l'attribut `action` par votre endpoint (Formspree, Make…).

Le formulaire est en **2 étapes** avec barre de progression, validation par champ,
messages d'erreur accessibles (`aria-describedby`) et focus géré.

---

## 4. Tracking (Google Tag Manager)

- Emplacement GTM : commentaire en haut du `<body>` de chaque page.
- `dataLayer` initialisé dans `script.js`.

| Événement | Déclencheur |
|-----------|-------------|
| `cta_diagnostic`, `cta_reserver_echange`, `cta_audit_google_ads`, `cta_audit_local`, `cta_audit_tracking`, `cta_projet_site`, `cta_voir_resultats` | clics CTA |
| `nav_service_*`, `nav_apropos` | navigation interne |
| `click_email` | clic e-mail |
| `view_contact` | affichage de la page contact |
| `form_start_contact` / `form_etape_2_contact` | progression du formulaire |
| `form_submit_contact` | envoi valide |
| `form_error_contact` | tentative invalide |
| `lead_confirme` | affichage de `merci.html` - **conversion principale recommandée** |

⚠️ Avant d'activer GA4 / conversions Google Ads : installer une CMP (bandeau de consentement)
et mettre à jour `politique-cookies.html`.

---

## 5. Design system (rappels)

- **Couleurs** : vert signature `#004A11` (principal), vert secondaire `#2F7D41`, ivoire `#F5F1E8`,
  anthracite `#171A18`, accent éditorial brun-rouge `#8A3324` (rare). Variables dans `:root` de `style.css`.
- **Typos** : Manrope (titres), Inter (texte), Cormorant Garamond italique (logo et accents éditoriaux). Chargées via Google Fonts.
- **Accessibilité** : WCAG 2.2 AA - navigation clavier, focus visibles, `aria-expanded`,
  fermeture Échap du menu, `prefers-reduced-motion` respecté, contrastes ≥ 4,5:1.
- **Astuce test** : ajoutez `?sansanim` à une URL pour désactiver les animations.

© Alif Corp.
