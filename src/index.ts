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
