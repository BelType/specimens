// The bolletta's merge data holds together: every customer has readings and every reading a customer, each bill's amounts add up to the cent, and the template's own block holds the first customer.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { specimen } from '../src/index.ts';

const dir = specimen('bolletta').dir;
const table = (file: string): Record<string, string>[] => {
  const [head, ...lines] = fs.readFileSync(path.join(dir, file), 'utf8').trimEnd().split('\n').map((l) => l.split(';'));
  return lines.map((cells) => Object.fromEntries(head!.map((h, i) => [h, cells[i]!])));
};
// "1.234,56 €" in cents, "613,3" in tenths.
const cents = (s: string) => Math.round(Number(s.replace(' €', '').replace(/\./g, '').replace(',', '.')) * 100);
const tenths = (s: string) => Math.round(Number(s.replace(/\./g, '').replace(',', '.')) * 10);

const clienti = table('merge/clienti.csv');
const letture = table('merge/letture.csv');

test('every customer has readings, and every reading a customer', () => {
  const codes = new Set(clienti.map((c) => c.codice));
  assert.equal(codes.size, clienti.length, 'one row per customer');
  for (const c of codes) assert.ok(letture.some((r) => r.codice === c), `${c} has readings`);
  for (const r of letture) assert.ok(codes.has(r.codice), `a reading of ${r.codice} has its customer`);
});

test('each bill adds up to the cent', () => {
  for (const c of clienti) {
    const rows = letture.filter((r) => r.codice === c.codice);
    const band = (b: string) => rows.reduce((s, r) => s + tenths(r[b]!), 0);
    for (const r of rows) assert.equal(tenths(r.totale!), tenths(r.f1!) + tenths(r.f2!) + tenths(r.f3!), `${c.codice} ${r.data}: a day's total is its bands`);
    const kwh = band('f1') + band('f2') + band('f3');
    const at = (tenthsKwh: number, microEuro: number) => Math.round((tenthsKwh * microEuro) / 1e5);
    assert.equal(cents(c.e_f1!), at(band('f1'), 152400), `${c.cliente}: F1`);
    assert.equal(cents(c.e_f2!), at(band('f2'), 141800), `${c.cliente}: F2`);
    assert.equal(cents(c.e_f3!), at(band('f3'), 129600), `${c.cliente}: F3`);
    assert.equal(cents(c.materia!), cents(c.e_f1!) + cents(c.e_f2!) + cents(c.e_f3!) + cents(c.comm!), `${c.cliente}: materia`);
    assert.equal(cents(c.qen!), at(kwh, 8400), `${c.cliente}: quota energia`);
    assert.equal(cents(c.trasporto!), cents(c.fissa!) + cents(c.qpot!) + cents(c.qen!), `${c.cliente}: trasporto`);
    assert.equal(cents(c.oneri!), at(kwh, 36800), `${c.cliente}: oneri`);
    assert.equal(cents(c.accise!), at(kwh, 22700), `${c.cliente}: accise`);
    assert.equal(cents(c.imponibile!), cents(c.materia!) + cents(c.trasporto!) + cents(c.oneri!) + cents(c.accise!), `${c.cliente}: imponibile`);
    assert.equal(cents(c.iva!), Math.round(cents(c.imponibile!) / 10), `${c.cliente}: IVA`);
    assert.equal(cents(c.importo!), cents(c.imponibile!) + cents(c.iva!), `${c.cliente}: importo`);
  }
});

test('the template holds the first customer, and its sample readings are theirs', () => {
  const html = fs.readFileSync(specimen('bolletta').entry, 'utf8');
  const block = JSON.parse(html.match(/<script type="application\/ld\+json" id="__beltype-store">([\s\S]*?)<\/script>/)![1]!);
  const doc = block['@graph'].find((n: { '@id'?: string }) => n['@id'] === '#doc');
  for (const [key, value] of Object.entries(clienti[0]!)) assert.equal(doc[key], value, `the block's ${key}`);
  const sample = table('letture.csv');
  const first = letture.filter((r) => r.codice === clienti[0]!.codice).map(({ codice: _, ...r }) => r);
  assert.deepEqual(sample, first);
});
