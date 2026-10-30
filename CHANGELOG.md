# Changelog

## 0.1.0 — 2026-10-30

- **`paper`**, a short scientific article on A4, moved byte for byte from the cli's `samples/paper/` at v0.1.1, with its three woff2 fonts and their OFL licences.
- **`specimens` and `specimen(name)`**: the list, and the lookup, which refuses an unknown name by listing the known ones. Paths resolve from the package's own location, so they hold from source and from `dist/`.
- **`test/specimens.test.ts`** holds the list to the folders and every reference in a specimen to its own folder.
