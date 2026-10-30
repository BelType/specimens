# Working on specimens

Read the [README](README.md) first.

- **The folders under `specimens/` are the product**; `src/index.ts` only names them. A specimen is moved or changed byte for byte, never tidied.
- **A specimen is self-contained**: every `href`, `src` and CSS `url()` stays inside its folder. `test/specimens.test.ts` holds it.
- **A change to a specimen is checked by eye**: print it and look at every page. Then tag, publish, and move the pin in the cli and the testbench.
- TypeScript `strict` with `noUncheckedIndexedAccess`; errors are `@beltype/common/errors` subclasses; no hard-wrapping.
- New decision records go to `codeberg.org/BelType/decisions`.
