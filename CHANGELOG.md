# Changelog

## Unreleased

- **`mostra`**, an exhibition leaflet on A4 in Italian: a cover drawn to the paper's edge in layered gradients and shadows, cards, three flags drawn in CSS, an inline SVG diagram with its own filter, and the flag of Ecuador downloaded from Wikimedia Commons (public domain, 1 227 paths), kept byte for byte with its `SOURCE.txt`. The exhibition is invented; the flag is real. Four pages under Paged.js, checked by eye.
- **`cases/`**, a second kind beside the specimens: reduced test cases, one defect each, with `cases` and `testCase(name)` and an `expects` on each saying what a correct print shows. The test holds them to the same rules as the specimens.
- **The first five cases**, moved byte for byte from a tester's report of 2026-11-03 against the published cli 0.1.3, only each entry renamed to `index.html`: `contatori-a-zero`, `font-senza-nome-postscript`, `url-in-media-print`, `matrice-2d` and `elemento-personalizzato`. Liberation Mono comes with its OFL; the two barcode fonts are the tester's, contributed under this repository's MIT licence.

## 0.1.0 — 2026-10-30

- **`paper`**, a short scientific article on A4, moved byte for byte from the cli's `samples/paper/` at v0.1.1, with its three woff2 fonts and their OFL licences.
- **`specimens` and `specimen(name)`**: the list, and the lookup, which refuses an unknown name by listing the known ones. Paths resolve from the package's own location, so they hold from source and from `dist/`.
- **`test/specimens.test.ts`** holds the list to the folders and every reference in a specimen to its own folder.
