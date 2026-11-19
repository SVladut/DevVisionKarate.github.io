# Frontend project instructions

## Stack and existing patterns

- This is a buildless site using plain HTML, CSS, and vanilla JavaScript. There is no `package.json`, frontend framework, package manager configuration, or bundler in this checkout. Keep the existing stack; do not introduce a framework or component library for routine changes.
- Tailwind is not installed. There is no `tailwind.config.*`, Tailwind theme, or configured Tailwind color/font/spacing scale to reuse.
- No UI component library (shadcn/ui, MUI, Chakra, etc.) is installed, so there are no library components to inventory. The CDN dependency `xlsx-js-style` on the athlete payments page handles spreadsheet export; it is not a UI component library.
- Follow the existing separation of HTML markup, external stylesheets, and page-specific JavaScript. Preserve Romanian interface text and the `club` URL parameter when navigating between pages.
- `index.html` uses `style.css`, then loads `categories.js` before `script.js`. Preserve this order and the `KarateCategories` API. Follow `CATEGORII.md` for registration and category rules.
- The payment pages use `styleplati.css` with `scriptplati.js` or `scriptPlatiEchipe.js`. Preserve their API and spreadsheet export behavior.
- Both stylesheets import `common.css`, the shared source for typography, colors, spacing, navigation, and buttons. `ui.js` initializes the theme before paint and handles presentation-only accessibility and navigation context. Keep these concerns separate from the existing registration, payment, and category scripts.
- If a future change adds `package.json`, inspect it and the actual framework, component library, and styling configuration before choosing tools or components.

## Reuse existing UI patterns

These are existing HTML/CSS patterns, not packaged library components. Reuse and improve them instead of creating parallel implementations:

| Pattern | Existing classes or elements |
| --- | --- |
| Page shell, branding, navigation | `.shell`, `.site-header`, `.brand`, `.brand-logo`, `.main-nav`, `.nav-link`, `.site-footer` |
| Page headings and panels | `.page-title`, `.page-description`, `.registration-panel`, `.payments-panel` |
| Registration type and sections | `.type-selector`, `.form-section`, `.team-member`, `.hidden` |
| Fields, selects and event selection | `.field`, `.fields-grid`, `.field-error`, `.custom-select`, `.checkbox-group` |
| Category feedback | `.category-preview`, `.category-note`, `.category-error` |
| Actions and theme control | `.button`, `.button-primary`, `.submit-btn`, `.back-btn`, `.icon-button` |
| Feedback dialog | `.modal`, `.modal-content`, `.close-btn` |
| Payment tables | semantic `table`, `thead`, `tbody`, `tfoot`; `.table-responsive` for overflow |

Reuse the shared tokens and interaction states. Preserve the existing IDs, field names, option values, and API/export selectors when updating presentation.

## Visual and styling rules

- Use at most two font families, excluding generic fallback stacks. The site uses self-hosted variable Inter in `assets/fonts/`; reuse it rather than adding another family. Keep its license alongside the font files.
- Use one accent color for interactive emphasis: the existing blue `#0046c7`. Reuse the `--accent`, `--accent-ink`, and `--accent-soft` tokens for their light/dark variants. Use neutral surfaces and text around it. Semantic error colors must communicate errors rather than serve as additional decorative accents.
- Use a consistent spacing scale based on 4px: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`px. Use the same scale for margins, padding, and gaps, preferably through shared CSS custom properties.
- All interactive elements must have hover, visible keyboard focus (`:focus-visible`), and active states. Preserve a clear focus indicator; also distinguish disabled and checked/selected states when applicable.
- No inline styles unless the value is genuinely dynamic. Use CSS Modules or Tailwind classes when supported by the existing stack. This checkout supports neither, so use reusable classes in its existing external CSS files without introducing a new build toolchain. Move static page-level `<style>` rules into the appropriate stylesheet when touching them.
- Always reserve image space with explicit width/height or an aspect ratio in HTML or CSS to prevent cumulative layout shift. The existing `.brand-logo` reserves 36px by 36px in both HTML and CSS.

## Semantics, accessibility, and forms

- Use semantic HTML: links for navigation, buttons for actions, meaningful headings and landmarks, and proper table/form elements. Do not make a `span` or `div` act as a button.
- Use associated visible labels for every form control; placeholders and disabled placeholder options are not labels. Group related controls with `fieldset` and `legend` where appropriate.
- Indicate required fields visibly and keep the indicator synchronized with the native `required` state when registration sections change. Preserve optional event selection unless the business rules explicitly change.
- Provide field-specific error states and messages. Associate messages through `aria-describedby` and mark invalid controls with `aria-invalid`; make submission feedback accessible to assistive technology.
- Add ARIA labels and roles where appropriate, especially for icon-only controls and dialogs, while preferring native HTML semantics. Dialogs need an accessible name, keyboard dismissal, focus management, and focus restoration.
- Support keyboard operation for every interaction. Announce asynchronous feedback appropriately; preserve the category previews' existing `aria-live="polite"` behavior.

## Responsive layout

- Implement mobile-first base styles and progressively enhance at `min-width: 640px`, `768px`, and `1024px` as needed. Use these breakpoints consistently instead of adding arbitrary viewport thresholds.
- Keep form controls and actions usable on narrow screens. Allow action groups to wrap and put wide tables in the existing `.table-responsive` wrapper when needed.
- Check layout at narrow mobile widths and around all three breakpoints. Avoid horizontal page overflow.

## Verification

- Run checks appropriate to the files changed. This project has no package-based build or lint command; do not invent one.
- For registration/category behavior, run `node --test --test-isolation=none tests/categories.test.js`.
- Check changed JavaScript with `node --check <file.js>` and review diffs with `git diff --check`.
- For UI changes, verify keyboard navigation, focus/hover/active states, visible labels and errors, and responsive layouts when browser preview is available. Report verification limits.
