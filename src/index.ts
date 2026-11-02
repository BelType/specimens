// The list of specimens and the lookup. The folders under `specimens/` are the product; this file names them.

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

// The package root is the nearest folder upward holding package.json, so the paths hold from src/ and from dist/src/.
let root = path.dirname(fileURLToPath(import.meta.url));
while (!fs.existsSync(path.join(root, 'package.json'))) root = path.dirname(root);
const folder = path.join(root, 'specimens');

function make(name: string, title: string, exercises: readonly string[]): Specimen {
  const dir = path.join(folder, name);
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

export function specimen(name: string): Specimen {
  const found = specimens.find((s) => s.name === name);
  if (!found) throw new ValidationError(`No specimen named "${name}"; the known ones are ${specimens.map((s) => s.name).join(', ')}.`);
  return found;
}
