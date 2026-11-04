# Changelog

## Unreleased

- **`mostra`**, an exhibition leaflet on A4 in Italian about the Roman Empire in the year 117: a porphyry cover framed by gold hairlines, a tabula ansata cut by clip-path, numbered sections in Roman numerals, a drop capital, cards, three coins drawn in CSS, an inline SVG section of a Roman road, a mosaic emblem dissolved into the paper by an SVG luminance mask, and the Empire's map downloaded from Wikimedia Commons (public domain, 408 paths, two blur filters), kept byte for byte with its `SOURCE.txt`, and Liberation Sans 2.1.5 (OFL) from its official release for the family the map's legend names. The exhibition is invented; the map is real. Four pages under Paged.js, checked by eye.
- **`cases/`**, a second kind beside the specimens: reduced test cases, one defect each, with `cases` and `testCase(name)` and an `expects` on each saying what a correct print shows. The test holds them to the same rules as the specimens.
- **The first five cases**, moved byte for byte from a tester's report of 2026-11-03 against the published cli 0.1.3, only each entry renamed to `index.html`: `contatori-a-zero`, `font-senza-nome-postscript`, `url-in-media-print`, `matrice-2d` and `elemento-personalizzato`. Liberation Mono comes with its OFL; the two barcode fonts are the tester's, contributed under this repository's MIT licence.

## 0.1.0 — 2026-10-30

- **`paper`**, a short scientific article on A4, moved byte for byte from the cli's `samples/paper/` at v0.1.1, with its three woff2 fonts and their OFL licences.
- **`specimens` and `specimen(name)`**: the list, and the lookup, which refuses an unknown name by listing the known ones. Paths resolve from the package's own location, so they hold from source and from `dist/`.
- **`test/specimens.test.ts`** holds the list to the folders and every reference in a specimen to its own folder.
