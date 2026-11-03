# specimens

The documents every BelType interface is shown and tested on. A specimen is a finished HTML document with its assets, self-contained and readable by any engine: every file it names sits in its own folder, and nothing is fetched.

```ts
import { specimens, specimen } from '@beltype/specimens';

specimen('paper').entry; // absolute path of specimens/paper/index.html
specimens.map((s) => s.name); // ['paper', 'delibera', 'trattato', 'mostra']
```

| Name | Title | Exercises |
| :--- | :--- | :--- |
| `paper` | A scientific article (A4, invented data) | `@page` size and margins, `@page :first`, margin boxes, `string-set` and `string()`, `counter(page)`, counters, `target-counter()`, `hyphens: auto`, orphans and widows, `break-inside: avoid`, a table, inline SVG, `@font-face` woff2 |
| `delibera` | A resolution of the Regional Government of Sardinia (A4, Italian, a real act's text) | `@page` size and margins, `@page :first`, margin boxes, `string-set` and `string()`, `counter(page)`, `counter(pages)`, `hyphens: auto` with `lang="it"`, orphans and widows, `break-after: avoid`, `break-inside: avoid`, grid on a `dl`, a table with a `colgroup`, `font-variant-numeric: tabular-nums`, `list-style-position: outside`, `::marker`, inline SVG, `@font-face` woff2 variable at several weights |
| `trattato` | A book: the consolidated Treaty establishing the European Community (2002), in Italian, 156 × 234 mm | `@page :left`, `:right`, `:first` and `:blank`, named pages, margin boxes on three sides, `string-set` and `string()` with `start`, `counter(page)`, nested counters, `target-counter()` for pages and for author counters, `break-before: right` and `break-after: right`, `break-inside: avoid`, orphans and widows, `hyphens: auto` with `lang="it"`, small capitals and old-style figures, a variable `@font-face` with an optical-size axis |
| `mostra` | An exhibition leaflet on the Roman Empire in the year 117 (A4, Italian, an invented exhibition around a real map) | `@page :first` with no margin and a dark `@page` background, margin boxes, `counter(pages)`, `print-color-adjust: exact`, linear, radial, conic, repeating-linear and repeating-conic gradients layered as one background, gradients held in custom properties, `box-shadow` several and inset, `text-shadow`, `filter: drop-shadow()`, `border-radius`, `clip-path: polygon()`, `transform: rotate()`, `z-index`, `opacity`, grid and flex, a downloaded SVG map in an `img` (408 paths, `feGaussianBlur`, text in a system font), inline SVG with `feDropShadow`, patterns and a `clipPath`, `@font-face` woff2 variable |

## Cases

A case is a reduced test case: one defect in a page or less, the thing a fix is proved against. It lives under `cases/`, follows the same rules as a specimen, and says in `expects` what a correct print shows.

```ts
import { cases, testCase } from '@beltype/specimens';

testCase('matrice-2d').expects; // what a correct print shows
```

The first five come from a tester's print of administrative documents with the published cli 0.1.3, on 2026-11-03. Their names are the tester's, in Italian.

| Name | Title | A correct print shows |
| :--- | :--- | :--- |
| `contatori-a-zero` | Page counters inside a running element | Every page foot reads "Pagina N di T" with its page number and the total, and the first paragraph names the total; Paged.js and WeasyPrint print it so. |
| `font-senza-nome-postscript` | A font with no PostScript name | The second line prints in the barcode face, or the print refuses naming the font and why; Chromium and WeasyPrint accept the font. |
| `url-in-media-print` | A `url()` in a `@font-face` inside `@media print` | The text prints in Liberation Mono, fetched from `css/liberation-mono.ttf`, since a `url()` resolves against the stylesheet that holds it. |
| `matrice-2d` | A sixteen-glyph font for two-dimensional codes | Three lines of code glyphs print between "Prima" and "Dopo", drawn and extractable in the PDF; Chromium with Paged.js prints them. |
| `elemento-personalizzato` | An inline custom element | The name prints as ordinary text, and a tagged PDF carries the element as a Span or transparently, keeping its PDF/UA-2 claim. |

## Adding one

1. Make a folder under `specimens/`, or `cases/` for a case, holding an `index.html` and everything it names.
2. Add its entry to `src/index.ts`: name, title, and what it exercises in CSS's own words; a case also says what it `expects`.
3. A file downloaded from elsewhere carries a `SOURCE.txt` beside it: where it came from, when, its size and hash, and its licence.
4. Run `pnpm test`. It holds each list to its folders, every reference to the folder (a remote URL, an absolute path or a `../` that escapes fails), and every font to a licence file.

A specimen is changed only by eye: print it and look at every page before trusting a test. The companions pin a version of this package, so a change here is followed by a pin move there.

## Working on it

```bash
pnpm install
pnpm run check
pnpm test
pnpm run build
```
