# specimens

The documents every BelType interface is shown and tested on. A specimen is a finished HTML document with its assets, self-contained and readable by any engine: every file it names sits in its own folder, and nothing is fetched.

```ts
import { specimens, specimen } from '@beltype/specimens';

specimen('paper').entry; // absolute path of specimens/paper/index.html
specimens.map((s) => s.name); // ['paper', 'delibera', 'trattato', 'mostra', 'bolletta', 'provvedimento-imu']
```

| Name | Title | Exercises |
| :--- | :--- | :--- |
| `paper` | A scientific article (A4, invented data) | `@page` size and margins, `@page :first`, margin boxes, `string-set` and `string()`, `counter(page)`, counters, `target-counter()`, `hyphens: auto`, orphans and widows, `break-inside: avoid`, a table, inline SVG, `@font-face` woff2 |
| `delibera` | A resolution of the Regional Government of Sardinia (A4, Italian, a real act's text) | `@page` size and margins, `@page :first`, margin boxes, `string-set` and `string()`, `counter(page)`, `counter(pages)`, `hyphens: auto` with `lang="it"`, orphans and widows, `break-after: avoid`, `break-inside: avoid`, grid on a `dl`, a table with a `colgroup`, `font-variant-numeric: tabular-nums`, `list-style-position: outside`, `::marker`, inline SVG, `@font-face` woff2 variable at several weights |
| `trattato` | A book: the consolidated Treaty establishing the European Community (2002), in Italian, 156 × 234 mm | `@page :left`, `:right`, `:first` and `:blank`, named pages, margin boxes on three sides, `string-set` and `string()` with `start`, `counter(page)`, nested counters, `target-counter()` for pages and for author counters, `break-before: right` and `break-after: right`, `break-inside: avoid`, orphans and widows, `hyphens: auto` with `lang="it"`, small capitals and old-style figures, a variable `@font-face` with an optical-size axis |
| `mostra` | An exhibition leaflet on the Roman Empire in the year 117 (A4, Italian, an invented exhibition around a real map) | `@page :first` with no margin and a dark `@page` background, margin boxes, `counter()` in `upper-roman`, `::first-letter`, `print-color-adjust: exact`, linear, radial, conic, repeating-linear and repeating-conic gradients layered, sized and positioned, gradients held in custom properties, `border-radius` on a gradient, `outline-offset`, `box-shadow` several and inset, `text-shadow`, `filter: drop-shadow()`, `clip-path: polygon()`, `transform: rotate()`, `z-index`, grid and flex, a downloaded SVG map in an `img` (408 paths, `feGaussianBlur`, text in a system font), inline SVG with a luminance `mask`, `mix-blend-mode`, patterns, `use` and `feDropShadow`, `@font-face` woff2 variable, and a ttf `@font-face` for the family the map's legend names |
| `bolletta` | A mail-merge template: an electricity bill from an invented supplier (A4, Italian), from the studio's demo | microdata fields (`itemscope`, `itemid`, `itemprop`, one value shown in several places) bound to a JSON-LD data block with XForms binds in XPath 3.1, a `<template data-repeat>` over a CSV described by CSVW metadata, `<data>` cells with a typed value, `tr:has()` over a value the file carries, `string-set` and `string()`, `target-counter()`, margin boxes, tables over a page break, `@font-face` woff2 variable |
| `provvedimento-imu` | A mail-merge template: a municipal property-tax assessment (IMU) from an invented town (A4, Italian), modelled on a council's JasperReports layout, with `batch.html`, its merged print run of four notices in five copies | named pages (`page`, `@page prima`, `@page seguito`), `break-before: recto` and `@page :blank`, `counter-reset: page` on an element and `target-counter()` in a running element for each notice's own "Pagina n/N", a different running element per notice, an `@page` background image, an absolutely placed envelope window, sections shown or hidden by `:has()` over a value the data carries, seventeen XForms binds summing five tables, a table drawn twice, a barcode set in Libre Barcode 39, `@font-face` ttf |

`mostra`'s emblem is a luminance mask driven by a gradient. Measured 2026-11-04 on a reduced copy: Chromium's own print writes it as a 300 ppi image with a soft mask of its own, and Caster writes it as a vector soft mask over a shading, with no image.

## Merging the bolletta

`bolletta` is a template, saved the way a store host saves it: its fields hold the first customer's values, its JSON-LD block (`#__beltype-store`) holds the same values with a `csvw:Table` reference to `letture.csv`, and its readings table is a `<template data-repeat="letture">`, inert. Printed as it is, it shows the first customer's bill with an empty readings table; a host fills it.

The data a merge needs sits in `merge/`, each file described by CSVW metadata beside it (delimiter `;`, decimals with a comma):

- `merge/clienti.csv`: one row per customer, twelve of them, keyed by `codice`. Every column is a key of the `#doc` item and is written as text.
- `merge/letture.csv`: the daily readings of every customer, keyed by the same `codice`; the template's `letture.csv` is the first customer's, without the key. Customers are billed for one month or two, 30 or 61 rows.

A merge for one customer opens the block with that customer's readings as the rows of `letture.csv` (`openBlock(text, { rows })` in `prosemirror-stores/graph`), sets every column of their row on `#doc`, writes the fields from the graph (`writeMicrodata` in `prosemirror-stores/microdata`), clones the template once per reading, and writes the block back. The binds compute `giorni`, `f1`, `f2`, `f3` and `consumo` from the rows; every other value comes from `clienti.csv`, and `test/bolletta.test.ts` holds each bill's arithmetic to the cent, so a merge can be checked against the data. Under a DOM that exposes a `<template>`'s content as its children (linkedom does; a browser does not), a crawl over children reaches the template's own fields: skip `template` when writing.

## Merging the provvedimento-imu

`provvedimento-imu` is a template like the bolletta, and a harder one: one notice of assessment, a single item `#avviso`, whose data comes from five tables, and a print run in which the notices follow one another. Its layout is modelled on a council's JasperReports template (a master report and 42 subreports) and its sample prints; none of their files is here, and every name, code, address and amount is invented.

`index.html` is the template: its fields hold the first notice and its first copy, its block holds the same values, a `csvw:Table` reference for each of `immobili`, `versamenti`, `interessi`, `sanzioni` and `eredi`, and seventeen binds that compute every sum of the notice from the tables (what is due, what was paid, the difference, interest, penalties, the total rounded to the euro, the same with adesione). `batch.html` is what a merge of the whole run must print: every copy merged and repeated, the templates gone, no block. It is the oracle a mail-merge venue compares its output against.

The data in `merge/`, each file with its CSVW metadata (delimiter `;`, decimals with a comma and a dot for thousands), keyed by `avviso`, the notice's number:

- `merge/avvisi.csv`: one row per notice, four of them: a partial payment with adesione, a refund, an undeclared shop with adesione and an empty payments table, and a deceased taxpayer with two heirs.
- `merge/destinatari.csv`: one row per printed copy, five of them. A notice goes to each recipient once; only the address, the protocol number and the delivery ID change. The heirs' notice prints twice.
- `merge/immobili.csv`, `versamenti.csv`, `interessi.csv`, `sanzioni.csv`, `eredi.csv`: the notice's rows. The template's own `immobili.csv` and the rest are the first notice's, without the key.

A merge of one copy opens the block with that notice's rows, sets every column of its `avvisi.csv` row and of the copy's `destinatari.csv` row on `#avviso`, writes the fields, and clones each template once per row. A run puts the copies one after another, each `article` with its own `id` and `itemid` and its page-total link (`href="#fine…"`) pointing at its own end: ids are the merge's to make unique. `test/provvedimento-imu.test.ts` holds the arithmetic to the cent, under rules it states in its header, and holds every copy in the batch to its data. The same template merged with `prosemirror-stores` (`openBlock`, `writeMicrodata`) and the studio's CSV reader gives the batch's 245 item fields exactly.

What the template asks of a merge, beyond the bolletta:

- several tables in one item, one of them (`sanzioni`) drawn by two templates;
- a row that is a whole section with two tables, not one table row;
- one record printed for several recipients;
- sections that show only for some notices, written as selectors over a field's value: a `<data itemprop="esito">` or `itemprop="adesione"` flag at the head of the notice, read by `:has()`. No code writes a class;
- an empty table that says so (`Non sono stati eseguiti versamenti`), by `:has()` over its rows;
- a repeated value blanked by `tr:has(data[value]) + tr:has(data[value])`.

What it cannot ask yet: repeats are flat, so a property with two tax-rate periods would need a table inside a row; the specimen gives each property one period. A CSVW decimal column with an empty cell is a null under CSVW, but the studio's reader refuses it, so the declared figures of a property (`dic_*`) are plain text.

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
