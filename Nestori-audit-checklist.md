# Nestori — 10-Point Website Audit Checklist

This checklist is tailored to the Nestori project in this workspace. Run the checks on each page (start with `index.html`) and follow the remediation steps when an item fails.

---

## 1) Mobile Responsiveness (Highest Priority)
- What to check:
  - Header, navigation, login/signup/buttons don’t overlap at small widths.
  - No horizontal scrolling on any page.
  - Search bar and property-type buttons fit and are readable.
  - Tap targets at least ~44×44px.
- Quick test:
  - Open Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M) and test phone widths.
- Fixes:
  - Ensure `<meta name="viewport" content="width=device-width, initial-scale=1">` is present in `<head>`.
  - Add media queries to stack/scale elements at <=768px.
  - Use flexbox/grid and avoid fixed widths for main layout blocks.

## 2) Navigation & Mobile Menu
- What to check:
  - Navigation collapses behind a hamburger or stacks when screen is narrow.
  - Login/Signup are accessible (either visible or inside menu).
- Fixes:
  - Use Bootstrap’s collapse component or implement a simple toggle for `.navbar-collapse`.
  - Ensure `.navbar-buttons` moves inside the collapsible area or becomes a single icon on mobile.

## 3) Viewport & Meta Configuration
- What to check:
  - Every top-level HTML file (`index.html`, `FindRental.html`, `RoomateMatching.html`, `Aboutus.html`, etc.) includes:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
- Why: without it mobile browsers will scale a desktop layout and break the responsive behavior.

## 4) Max Content Width & Readability
- What to check:
  - On wide screens, long lines of text are hard to read.
- Fixes:
  - Add a reusable container rule in `style.css`:

```css
.container-max {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}
```
  - Wrap large sections (hero, main content) in a div with `class="container-max"`.

## 5) Images & Media Optimization
- What to check:
  - Large images are used without responsive sizing or compression.
- Fixes:
  - Add `width:100%; height:auto;` or use Bootstrap’s `.img-fluid`.
  - Replace very large images with optimized JPG/WebP versions (<200–300KB per image where possible).
  - Use `loading="lazy"` for below-the-fold images.

## 6) Performance & Speed
- What to check:
  - Run PageSpeed Insights or Lighthouse and inspect LCP, FCP, CLS.
- Quick commands / links:
  - https://pagespeed.web.dev/
  - In Chrome: DevTools → Lighthouse → Generate report.
- Fixes:
  - Inline-critical CSS sparingly or remove unused CSS.
  - Defer non-critical JS (add `defer` or move scripts to end of body).
  - Compress images and enable caching headers on server if hosting.

## 7) UI Feedback & Accessibility
- What to check:
  - Buttons and links have hover/focus states.
  - Contrast ratio passes WCAG (text vs background).
  - Form elements have accessible labels.
- Fixes:
  - Add `:focus` styles alongside `:hover`.
  - Use semantic elements (buttons, inputs with `label for=`).
  - Run simple Lighthouse accessibility audit.

## 8) Layout Consistency & Spacing
- What to check:
  - Consistent padding/margins across sections and cards.
  - No visual "tight" groups or inconsistent font sizes.
- Fixes:
  - Create a small spacing scale in `style.css` (e.g., `--space-s:8px; --space-m:16px; --space-l:32px;`).
  - Apply consistent card/panel padding and radius.

## 9) Functional Checks
- What to check:
  - Search bar submits (even if it shows a message).
  - Dropdowns and property-type toggles change state.
  - Auth modal opens for Login/Signup links.
  - Links point to correct pages (no 404s).
- Fixes:
  - Add defensive JS checks (guard `document.querySelector` returns).
  - Provide fallback behavior: e.g., show a message if the backend is not connected.

## 10) Footer, Contact & Legal
- What to check:
  - Footer is responsive.
  - Contact email is clickable (`mailto:`).
  - Privacy policy and Terms links are present (even simple placeholders).
- Fixes:
  - Ensure footer content is stacked on small screens.
  - Add `rel="noopener"` to external links.

---

## Quick CSS snippets (copy-paste)
- Viewport (add to every `<head>`):

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- Max-width wrapper (add to `style.css`):

```css
.container-max {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

- Simple responsive nav rules (add near navbar styles):

```css
/* Ensure navbar buttons don't overflow on mobile */
.navbar-buttons { display: flex; gap: 8px; }
@media (max-width: 768px) {
  .navbar-buttons { display: none; }
  .navbar .navbar-toggler { display: block; }
  .navbar-collapse .navbar-buttons-mobile { display: flex; gap:8px; margin-top: 12px; }
}
```

Add a small copy of the buttons inside the collapsible `.navbar-collapse` with `class="navbar-buttons-mobile"` so the login/signup remain accessible on mobile.

---

## How to run quick checks locally
- Open `index.html` in Chrome.
- Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M) → test 320/375/412/768 widths.
- Run Lighthouse (DevTools → Lighthouse) and inspect accessibility and performance.

---

If you want, I can now (choose one):
- Apply the quick fixes automatically (add viewport to top-level pages and add the `container-max` + responsive nav CSS). — I will update `index.html` and `style.css`.
- Or keep the checklist only and walk you through each fix interactively.

Which do you prefer? Reply with `Apply fixes` or `Checklist only`.