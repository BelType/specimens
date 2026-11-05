// The folders are the repo's real product: this test holds each list to its folders, and each folder to itself.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { specimens, specimen, cases, testCase } from '../src/index.ts';

const root = new URL('../', import.meta.url).pathname;
const all = [...specimens, ...cases];

const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

test('every listed specimen and case has its folder and index.html, and every folder is listed', () => {
  for (const s of all) {
    assert.ok(fs.statSync(s.dir).isDirectory(), `${s.name} has a folder`);
    assert.ok(fs.statSync(s.entry).isFile(), `${s.name} has an index.html`);
    assert.ok(s.exercises.length > 0, `${s.name} lists what it exercises`);
  }
  const folders = (kind: string) => fs.readdirSync(path.join(root, kind), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
  assert.deepEqual(folders('specimens'), specimens.map((s) => s.name).sort());
  assert.deepEqual(folders('cases'), cases.map((c) => c.name).sort());
  for (const c of cases) assert.ok(c.expects.length > 0, `${c.name} says what a correct print shows`);
});

test('the closure: every reference stays inside the specimen own folder', () => {
  for (const s of all) {
    for (const file of walk(s.dir).filter((f) => /\.(html|css)$|-metadata\.json$/.test(f))) {
      const text = fs.readFileSync(file, 'utf8');
      const refs: string[] = [];
      for (const m of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']*)["']/g)) refs.push(m[1]!);
      for (const m of text.matchAll(/url\(\s*["']?([^"')]*)["']?\s*\)/g)) refs.push(m[1]!);
      // A data block's table (`"csvw:url"`) and a CSVW metadata file's own `"url"` are references too.
      for (const m of text.matchAll(/"(?:csvw:)?url"\s*:\s*"([^"]*)"/g)) refs.push(m[1]!);
      for (const ref of refs) {
        if (ref === '' || ref.startsWith('#') || ref.startsWith('data:')) continue;
        const where = `${path.relative(root, file)} -> ${ref}`;
        assert.ok(!/^[a-z][a-z0-9+.-]*:/i.test(ref) && !ref.startsWith('//'), `remote reference: ${where}`);
        assert.ok(!ref.startsWith('/'), `absolute path: ${where}`);
        const target = path.resolve(path.dirname(file), ref.split(/[?#]/)[0]!);
        assert.ok(target === s.dir || target.startsWith(s.dir + path.sep), `escapes the folder: ${where}`);
        assert.ok(fs.existsSync(target), `missing file: ${where}`);
      }
    }
  }
});

test('every font file has a licence file beside it', () => {
  for (const s of all) {
    for (const font of walk(s.dir).filter((f) => /\.(woff2?|ttf|otf)$/.test(f))) {
      const licences = fs.readdirSync(path.dirname(font)).filter((n) => /^(OFL|LICEN[CS]E)/i.test(n));
      assert.ok(licences.length > 0, `no licence beside ${path.relative(root, font)}`);
    }
  }
});

test('an unknown name is refused, naming the known ones', () => {
  assert.equal(specimen('paper').name, 'paper');
  assert.throws(() => specimen('nope'), /paper/);
  assert.equal(testCase('matrice-2d').name, 'matrice-2d');
  assert.throws(() => testCase('nope'), /contatori-a-zero/);
});
