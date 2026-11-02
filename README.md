# specimens

The documents every BelType interface is shown and tested on. A specimen is a finished HTML document with its assets, self-contained and readable by any engine: every file it names sits in its own folder, and nothing is fetched.

```ts
import { specimens, specimen } from '@beltype/specimens';

specimen('paper').entry; // absolute path of specimens/paper/index.html
specimens.map((s) => s.name); // ['paper', 'delibera', 'trattato']
```

| Name | Title | Exercises |
| :--- | :--- | :--- |
| `paper` | A scientific article (A4, invented data) | `@page` size and margins, `@page :first`, margin boxes, `string-set` and `string()`, `counter(page)`, counters, `target-counter()`, `hyphens: auto`, orphans and widows, `break-inside: avoid`, a table, inline SVG, `@font-face` woff2 |
| `delibera` | A resolution of the Regional Government of Sardinia (A4, Italian, a real act's text) | `@page` size and margins, `@page :first`, margin boxes, `string-set` and `string()`, `counter(page)`, `counter(pages)`, `hyphens: auto` with `lang="it"`, orphans and widows, `break-after: avoid`, `break-inside: avoid`, grid on a `dl`, a table with a `colgroup`, `font-variant-numeric: tabular-nums`, `list-style-position: outside`, `::marker`, inline SVG, `@font-face` woff2 variable at several weights |
| `trattato` | A book: the consolidated Treaty establishing the European Community (2002), in Italian, 156 × 234 mm | `@page :left`, `:right`, `:first` and `:blank`, named pages, margin boxes on three sides, `string-set` and `string()` with `start`, `counter(page)`, nested counters, `target-counter()` for pages and for author counters, `break-before: right` and `break-after: right`, `break-inside: avoid`, orphans and widows, `hyphens: auto` with `lang="it"`, small capitals and old-style figures, a variable `@font-face` with an optical-size axis |

## Adding one

1. Make a folder under `specimens/` holding an `index.html` and everything it names.
2. Add its entry to `src/index.ts`: name, title, and what it exercises in CSS's own words.
3. Run `pnpm test`. It holds the list to the folders, every reference to the folder (a remote URL, an absolute path or a `../` that escapes fails), and every font to a licence file.

A specimen is changed only by eye: print it and look at every page before trusting a test. The companions pin a version of this package, so a change here is followed by a pin move there.

## Working on it

```bash
pnpm install
pnpm run check
pnpm test
pnpm run build
```
