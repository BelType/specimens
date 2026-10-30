// The folder is the repo's real product: this test holds the list to the folders, and each folder to itself.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { specimens, specimen } from '../src/index.ts';

const root = new URL('../specimens/', import.meta.url).pathname;

const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

test('every listed specimen has its folder and index.html, and every folder is listed', () => {
  for (const s of specimens) {
    assert.ok(fs.statSync(s.dir).isDirectory(), `${s.name} has a folder`);
    assert.ok(fs.statSync(s.entry).isFile(), `${s.name} has an index.html`);
    assert.ok(s.exercises.length > 0, `${s.name} lists what it exercises`);
  }
  const folders = fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
  assert.deepEqual(folders, specimens.map((s) => s.name).sort());
});

test('the closure: every reference stays inside the specimen own folder', () => {
  for (const s of specimens) {
    for (const file of walk(s.dir).filter((f) => /\.(html|css)$/.test(f))) {
      const text = fs.readFileSync(file, 'utf8');
      const refs: string[] = [];
      for (const m of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']*)["']/g)) refs.push(m[1]!);
      for (const m of text.matchAll(/url\(\s*["']?([^"')]*)["']?\s*\)/g)) refs.push(m[1]!);
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
  for (const s of specimens) {
    for (const font of walk(s.dir).filter((f) => /\.(woff2?|ttf|otf)$/.test(f))) {
      const licences = fs.readdirSync(path.dirname(font)).filter((n) => /^(OFL|LICEN[CS]E)/i.test(n));
      assert.ok(licences.length > 0, `no licence beside ${path.relative(root, font)}`);
    }
  }
});

test('an unknown name is refused, naming the known ones', () => {
  assert.equal(specimen('paper').name, 'paper');
  assert.throws(() => specimen('nope'), /paper/);
});
