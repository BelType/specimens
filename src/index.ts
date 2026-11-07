// The lists of specimens and cases, and their lookups. The folders under `specimens/` and `cases/` are the product; this file names them.

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ValidationError } from '@beltype/common/errors';

export interface Specimen {
  /** The folder's name. */
  readonly name: string;
  readonly title: string;
  /** Absolute path of the folder. */
  readonly dir: string;
  /** Absolute path of its index.html. */
  readonly entry: string;
  /** What it puts in front of an engine, in CSS's own words. */
  readonly exercises: readonly string[];
}

/** A reduced test case: one defect in a page or less, and what a correct print shows. */
export interface Case extends Specimen {
  /** What a correct print shows, and who already prints it so. */
  readonly expects: string;
}

// The package root is the nearest folder upward holding package.json, so the paths hold from src/ and from dist/src/.
let root = path.dirname(fileURLToPath(import.meta.url));
while (!fs.existsSync(path.join(root, 'package.json'))) root = path.dirname(root);

function make(name: string, title: string, exercises: readonly string[], folder = 'specimens'): Specimen {
  const dir = path.join(root, folder, name);
  return { name, title, dir, entry: path.join(dir, 'index.html'), exercises };
}

export const specimens: readonly Specimen[] = [
  make('paper', 'A scientific article', [
    '@page size and margins',
    '@page :first',
    'margin boxes',
    'string-set and string()',
    'counter(page)',
    'counters',
    'target-counter()',
    'hyphens: auto',
    'orphans and widows',
    'break-inside: avoid',
    'table',
    'inline SVG',
    '@font-face woff2',
  ]),
  make('delibera', 'A resolution of the Regional Government of Sardinia', [
    '@page size and margins',
    '@page :first',
    'margin boxes',
    'string-set and string()',
    'counter(page)',
    'counter(pages)',
    'hyphens: auto with lang="it"',
    'orphans and widows',
    'break-after: avoid',
    'break-inside: avoid',
    'grid on a dl',
    'table with a colgroup',
    'font-variant-numeric: tabular-nums',
    'list-style-position: outside',
    '::marker',
    'inline SVG',
    '@font-face woff2 variable at several weights',
  ]),
  make('trattato', 'A book: the consolidated EC Treaty of 2002, in Italian', [
    '@page size and margins',
    '@page :left and :right',
    '@page :first',
    '@page :blank',
    'named pages',
    'margin boxes on three sides',
    'string-set and string()',
    'string(name, start)',
    'counter(page)',
    'nested counters',
    'target-counter()',
    'break-before: right',
    'break-after: right',
    'break-after: avoid',
    'break-inside: avoid',
    'orphans and widows',
    'hyphens: auto',
    'font-variant-caps',
    'font-variant-numeric',
    'letter-spacing',
    'display: flex',
    'table',
    '@font-face woff2, variable with an optical-size axis',
  ]),
  make('mostra', 'An exhibition leaflet on the Roman Empire with a downloaded SVG map', [
    '@page size and margins',
    '@page :first with margin: 0',
    '@page background',
    'margin boxes',
    'counter(page, upper-roman) and counter(pages, upper-roman)',
    'counters in upper-roman on h2::before',
    'print-color-adjust: exact',
    'letter-spacing and text-transform: uppercase',
    '::first-letter with float',
    'linear-gradient() sized and positioned as a hairline',
    'radial-gradient() with an ellipse size',
    'conic-gradient()',
    'repeating-linear-gradient()',
    'repeating-conic-gradient()',
    'several gradients layered as one background',
    'custom properties holding a gradient',
    'border-radius on a gradient background',
    'border and outline with outline-offset',
    'box-shadow, several and inset',
    'text-shadow',
    'filter: drop-shadow()',
    'clip-path: polygon() in percentages',
    'transform: rotate()',
    'position: absolute with z-index and inset',
    'opacity',
    'display: grid and display: flex',
    'break-inside: avoid',
    'an SVG file in an img: 408 paths, feGaussianBlur filters and text in a system font',
    'inline SVG with a luminance mask driven by a radial gradient under a gradientTransform',
    'inline SVG with mix-blend-mode: multiply inside a masked group',
    'inline SVG with patterns, use, feDropShadow, a clipPath on a curved path and gradients',
    'hyphens: auto with lang="it"',
    '@font-face woff2 variable',
    '@font-face ttf for a family named only inside an SVG in an img',
  ]),
  make('bolletta', 'A mail-merge template: an electricity bill whose values and readings come from a store', [
    '@page size and margins',
    '@page :first and :blank',
    'margin boxes on two sides',
    'string-set and string() with start',
    'counter(page) and counter(pages)',
    'target-counter() on a link',
    'break-before: page',
    'break-inside: avoid',
    'display: grid',
    'tables over a page break, widths on the first row',
    'tr:has() over a value the file carries',
    'font-variant-numeric: tabular-nums',
    'microdata: itemscope, itemid, itemprop, one value in several fields',
    'a JSON-LD data block with XForms binds as XPath 3.1',
    'template data-repeat over a CSV described by CSVW metadata',
    'data elements: a typed value and its text',
    '@font-face woff2 variable',
  ]),
  make('provvedimento-imu', 'A mail-merge template: a municipal tax assessment, with its merged print run of four notices in five copies', [
    'named pages: page on an element, @page prima and @page seguito',
    'break-before: recto and @page :blank with a margin box',
    'counter-reset: page on an element, to number each notice on its own',
    'target-counter() on a link inside a running element, for each notice its own total',
    'position: running() and element() with a different element for each notice',
    'string-set: content(text) and string()',
    '@page background: an SVG image on the named page',
    'position: absolute in millimetres, for an envelope window',
    'box-shadow',
    'display: grid and display: flex',
    ':has() over a value the data carries, to show or hide whole sections',
    ':empty, and tr:has() + tr:has() to blank a repeated value',
    'break-inside: avoid, break-before: avoid, orphans and widows',
    'tables: colspan, rowspan, scope, caption, tfoot, several tbody fields per row, over a page break',
    'microdata: itemscope, itemid, itemprop, one value in several fields',
    'a JSON-LD data block with seventeen XForms binds in XPath 3.1, summing five tables',
    'template data-repeat over five CSVs described by CSVW metadata, one of them drawn twice',
    'data elements: a typed value and its text, a flag with no text',
    '@font-face ttf: Liberation Sans, Liberation Mono, and Libre Barcode 39 for a barcode set as text',
  ]),
  make('estimate', 'A printer\'s estimate for a book, whose totals are formulas', [
    '@page size and margins',
    'margin boxes',
    'counter(page) and counter(pages)',
    'grid on a dl',
    'table with caption, thead, tbody and tfoot',
    'th scope and abbr naming columns and rows',
    'data-formula attributes over computed values',
    'font-variant-numeric: tabular-nums',
    'break-inside: avoid',
    '@font-face woff2 variable',
  ]),
];

// From a tester's print of administrative documents with the published cli 0.1.3, on 2026-11-03.
export const cases: readonly Case[] = [
  {
    ...make('contatori-a-zero', 'Page counters inside a running element', ['position: running() and element()', 'counter(page) in a running element', 'counter(pages) in a running element', 'counter(pages) in the flow', '@page size and margins', '@font-face ttf'], 'cases'),
    expects: 'Every page foot reads "Pagina N di T" with its page number and the total, and the first paragraph names the total; Paged.js and WeasyPrint print it so.',
  },
  {
    ...make('font-senza-nome-postscript', 'A font with no PostScript name', ['@font-face ttf without a PostScript name'], 'cases'),
    expects: 'The second line prints in the barcode face, or the print refuses naming the font and why; Chromium and WeasyPrint accept the font.',
  },
  {
    ...make('url-in-media-print', 'A url() in a @font-face inside @media print', ['link rel="stylesheet" in a subfolder', '@media print', '@font-face inside @media print', 'url() relative to its stylesheet'], 'cases'),
    expects: 'The text prints in Liberation Mono, fetched from css/liberation-mono.ttf, since a url() resolves against the stylesheet that holds it.',
  },
  {
    ...make('matrice-2d', 'A sixteen-glyph font for two-dimensional codes', ['@font-face ttf with a small glyph set', 'white-space: nowrap', 'br'], 'cases'),
    expects: 'Three lines of code glyphs print between "Prima" and "Dopo", drawn and extractable in the PDF; Chromium with Paged.js prints them.',
  },
  {
    ...make('elemento-personalizzato', 'An inline custom element', ['a custom element inline in a paragraph'], 'cases'),
    expects: 'The name prints as ordinary text, and a tagged PDF carries the element as a Span or transparently, keeping its PDF/UA-2 claim.',
  },
];

export function specimen(name: string): Specimen {
  const found = specimens.find((s) => s.name === name);
  if (!found) throw new ValidationError(`No specimen named "${name}"; the known ones are ${specimens.map((s) => s.name).join(', ')}.`);
  return found;
}

export function testCase(name: string): Case {
  const found = cases.find((c) => c.name === name);
  if (!found) throw new ValidationError(`No case named "${name}"; the known ones are ${cases.map((c) => c.name).join(', ')}.`);
  return found;
}
