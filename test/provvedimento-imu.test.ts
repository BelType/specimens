// The IMU assessment's merge data holds together and the batch is its print: every table row has its notice, every amount
// follows the rules below to the cent, every merged copy in batch.html shows what the data says, and the template holds the first notice.
//
// The rules, the specimen's own and not the law's in full: a building's value is its cadastral rent x 1.05 x the category's multiplier,
// a plot's is its rent x 1.25 x 135; the year's tax is value x rate per mille x share of ownership x months / 12, a main home deducting
// 200 euro a year; the first instalment is half the tax, the balance the rest; what is due per instalment is rounded to the euro;
// interest is amount x yearly rate x days / 365, day by day year by year; a penalty is a percentage of the tax, and a third of it with adesione;
// the notice's total is rounded to the euro. Every rounding is XPath's round(), half toward +infinity, as the binds round.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { specimen } from '../src/index.ts';

const dir = specimen('provvedimento-imu').dir;
type Row = Record<string, string>;
const table = (file: string): Row[] => {
  const [head, ...lines] = fs.readFileSync(path.join(dir, file), 'utf8').trimEnd().split('\n').map((l) => l.split(';'));
  return lines.map((cells) => Object.fromEntries(head!.map((h, i) => [h, cells[i] ?? ''])));
};
// "1.234,56" in hundredths: cents for money, hundredths of a per mille or a per cent for rates.
const h = (s: string) => Math.round(Number(s.replace(/\./g, '').replace(',', '.')) * 100);
// n / d rounded half toward +infinity, on integers.
const round = (n: number, d: number) => Math.floor((2 * n + d) / (2 * d));
const euro = (cents: number) => round(cents, 100) * 100;
const money = (cents: number) => {
  const a = Math.abs(cents);
  const e = String(Math.floor(a / 100)).replace(/\B(?=(\d{3})+$)/g, '.');
  return `${cents < 0 ? '-' : ''}${e},${String(a % 100).padStart(2, '0')}`;
};
const day = (s: string) => Date.UTC(+s.slice(6), +s.slice(3, 5) - 1, +s.slice(0, 2)) / 864e5;
const sum = (rows: Row[], col: string) => rows.reduce((s, r) => s + h(r[col]!), 0);

const MULT: Record<string, number> = { A02: 160, A03: 160, A08: 160, C02: 160, C06: 160, C01: 55 };
const TERMINE: Record<string, string> = { Acconto: '16/06/2021', Saldo: '16/12/2021' };
const TASSO: Record<number, number> = { 2021: 1, 2022: 125, 2023: 500, 2024: 250 };

const avvisi = table('merge/avvisi.csv');
const copie = table('merge/destinatari.csv');
const tables = Object.fromEntries(['immobili', 'versamenti', 'interessi', 'sanzioni', 'eredi'].map((t) => [t, table(`merge/${t}.csv`)]));
const of = (t: string, n: string) => tables[t]!.filter((r) => r.avviso === n);

// What a notice's summary must read, computed from its tables.
function summary(a: Row) {
  const imm = of('immobili', a.avviso!);
  const ver = of('versamenti', a.avviso!);
  const da = euro(sum(imm, 'acc_netta')), ds = euro(sum(imm, 'sal_netta'));
  const va = sum(ver.filter((v) => v.rata === 'Acconto'), 'versato'), vs = sum(ver.filter((v) => v.rata === 'Saldo'), 'versato');
  const i = sum(of('interessi', a.avviso!), 'interesse'), s = sum(of('sanzioni', a.avviso!), 'sanzione'), r = sum(of('sanzioni', a.avviso!), 'ridotta');
  const t = da + ds - va - vs + i + s + h(a.spese!), ta = da + ds - va - vs + i + r + h(a.spese!);
  return {
    dovuto_acconto: da, dovuto_saldo: ds, dovuto_totale: da + ds, versato_acconto: va, versato_saldo: vs, versato_totale: va + vs,
    diff_acconto: da - va, diff_saldo: ds - vs, diff_totale: da + ds - va - vs, tot_interessi: i, tot_sanzioni: s, tot_ridotte: r,
    arrotondamento: euro(t) - t, importo: euro(t), arrotondamento_adesione: euro(ta) - ta, importo_adesione: euro(ta), importo_rimborso: -euro(t),
  };
}

test('every row has its notice, and every notice its copies and its properties', () => {
  const ids = new Set(avvisi.map((a) => a.avviso));
  assert.equal(ids.size, avvisi.length, 'one row per notice');
  for (const [name, rows] of Object.entries({ ...tables, destinatari: copie })) for (const r of rows) assert.ok(ids.has(r.avviso), `a row of ${name} has its notice (${r.avviso})`);
  for (const id of ids) {
    assert.ok(copie.some((c) => c.avviso === id), `notice ${id} has a copy`);
    assert.ok(of('immobili', id!).length > 0, `notice ${id} has a property`);
  }
});

test('each property is valued and taxed to the cent', () => {
  for (const r of tables.immobili!) {
    const where = `notice ${r.avviso}, ${r.immobile}`;
    const valore = r.immobile!.startsWith('Terreno') ? round(h(r.rendita!) * 125 * 135, 100) : round(h(r.rendita!) * 105 * MULT[r.categoria!]!, 100);
    assert.equal(h(r.valore!), valore, `${where}: value`);
    const annua = round(valore * h(r.aliquota!) * h(r.possesso!) * +r.mesi!, 1000 * 100 * 100 * 100 * 12);
    const detr = r.abitazione ? round(20000 * +r.mesi! * h(r.possesso!), 12 * 10000) : 0;
    assert.equal(h(r.tot_lorda!), annua, `${where}: the year's tax`);
    assert.equal(h(r.tot_detr!), detr, `${where}: the deduction`);
    assert.equal(h(r.acc_lorda!), round(annua, 2), `${where}: first instalment`);
    assert.equal(h(r.sal_lorda!), annua - round(annua, 2), `${where}: balance`);
    assert.equal(h(r.acc_detr!) + h(r.sal_detr!), detr, `${where}: the deduction split`);
    for (const p of ['acc', 'sal', 'tot']) assert.equal(h(r[`${p}_netta`]!), h(r[`${p}_lorda`]!) - h(r[`${p}_detr`]!), `${where}: ${p} net`);
    assert.equal(r.riga, r.dichiarata === 'si' ? 'Liq' : 'Oms', `${where}: an undeclared property is marked Oms`);
  }
});

test('interest runs day by day from the day after the deadline, and penalties are their percentage', () => {
  for (const a of avvisi) {
    const s = summary(a);
    const rows = of('interessi', a.avviso!);
    for (const q of ['Acconto', 'Saldo']) {
      const mine = rows.filter((r) => r.quota === q);
      const diff = q === 'Acconto' ? s.diff_acconto : s.diff_saldo;
      if (diff === 0) { assert.equal(mine.length, 0, `notice ${a.avviso}: no interest on a settled ${q}`); continue; }
      assert.equal(day(mine[0]!.dal!), day(TERMINE[q]!) + 1, `notice ${a.avviso} ${q}: from the day after the deadline`);
      assert.equal(mine.at(-1)!.al, a.data_atto, `notice ${a.avviso} ${q}: to the date of the notice`);
      for (const r of mine) {
        assert.equal(h(r.su_importo!), diff, `notice ${a.avviso} ${q}: on the difference`);
        assert.equal(+r.giorni!, day(r.al!) - day(r.dal!) + 1, `notice ${a.avviso} ${q} ${r.dal}: days`);
        assert.equal(h(r.tasso!), TASSO[+r.dal!.slice(6)], `notice ${a.avviso} ${q} ${r.dal}: the year's rate`);
        assert.equal(h(r.interesse!), round(diff * h(r.tasso!) * +r.giorni!, 100 * 100 * 365), `notice ${a.avviso} ${q} ${r.dal}: interest`);
      }
    }
    for (const r of of('sanzioni', a.avviso!)) {
      assert.equal(h(r.sanzione!), round(h(r.imponibile!) * h(r.percentuale!), 10000), `notice ${a.avviso} ${r.violazione}: penalty`);
      assert.equal(h(r.ridotta!), round(h(r.sanzione!), 3), `notice ${a.avviso} ${r.violazione}: a third with adesione`);
    }
  }
});

test('every copy in the batch shows its notice, its recipient and its sums', () => {
  const batch = fs.readFileSync(path.join(dir, 'batch.html'), 'utf8');
  const articles = batch.split(/(?=<article )/).slice(1);
  assert.equal(articles.length, copie.length, 'one notice printed per recipient');
  const field = (html: string, name: string) => {
    const m = html.match(new RegExp(`<(\\w+)\\b[^>]*\\bitemprop="${name}"[^>]*>([^<]*)</\\1>`))!;
    return m[1] === 'data' ? m[0].match(/value="([^"]*)"/)![1]! : m[2]!;
  };
  const seen = new Map<string, number>();
  for (const [i, copy] of copie.entries()) {
    const html = articles[i]!;
    const k = (seen.get(copy.avviso!) ?? 0) + 1;
    seen.set(copy.avviso!, k);
    const suffix = `-${copy.avviso}-${k}`;
    assert.ok(html.startsWith(`<article class="avviso" id="avviso${suffix}"`), `copy ${i + 1} is notice ${copy.avviso}, copy ${k}`);
    assert.match(html, new RegExp(`href="#fine${suffix}"`), `copy ${suffix}: the page total points at its own end`);
    assert.match(html, new RegExp(`id="fine${suffix}"`), `copy ${suffix}: its end is marked`);
    const a = avvisi.find((x) => x.avviso === copy.avviso)!;
    for (const [key, value] of Object.entries({ ...a, ...copy })) assert.equal(field(html, key), value, `copy ${suffix}: ${key}`);
    for (const [key, cents] of Object.entries(summary(a))) assert.equal(field(html, key), money(cents), `copy ${suffix}: ${key}`);
    for (const t of Object.keys(tables)) assert.equal(html.split(`itemscope itemprop="${t}"`).length - 1, of(t, a.avviso!).length * (t === 'sanzioni' ? 2 : 1), `copy ${suffix}: the rows of ${t}`);
  }
});

test('the template holds the first notice and its first copy, and its sample tables are theirs', () => {
  const html = fs.readFileSync(specimen('provvedimento-imu').entry, 'utf8');
  const block = JSON.parse(html.match(/<script type="application\/ld\+json" id="__beltype-store">([\s\S]*?)<\/script>/)![1]!);
  const doc = block['@graph'].find((n: { '@id'?: string }) => n['@id'] === '#avviso');
  const [a, c] = [avvisi[0]!, copie[0]!];
  for (const [key, value] of Object.entries({ ...a, ...c })) assert.equal(doc[key], value, `the block's ${key}`);
  for (const [key, cents] of Object.entries(summary(a))) assert.equal(doc[key], money(cents), `the block's ${key}`);
  for (const t of Object.keys(tables)) {
    assert.deepEqual(doc[t], { '@type': 'csvw:Table', 'csvw:url': `${t}.csv` }, `the block refers to ${t}.csv`);
    assert.deepEqual(table(`${t}.csv`), of(t, a.avviso!).map(({ avviso: _, ...r }) => r), `${t}.csv is the first notice's`);
  }
  const binds = block['@graph'].filter((n: { '@type'?: string }) => n['@type'] === 'Bind').map((b: { property: string }) => b.property).sort();
  assert.deepEqual(binds, Object.keys(summary(a)).sort(), 'a bind for every sum');
});
