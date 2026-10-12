# MedByte — SVD RAM Defender

An educational browser application exploring the tradeoff between low-rank matrix compression and reconstruction error. It combines a memory-management game, an approximate SVD visualizer, and a bundled project report.

## Features and scope

- Canvas-based game: choose whether to compress or store simulated pages.
- Rank slider and structured/random matrix inputs.
- Approximate truncated SVD using power iteration and deflation.
- Reconstruction-error and storage-ratio visualization.
- [Project report](assets/MedByte_Report.pdf).

This is a browser simulation. It does not integrate with an operating-system memory manager or compress real RAM pages. Game savings are illustrative; they are not measured OS benchmarks. The visualizer uses a 16 × 16 matrix and randomized numerical approximation.

## Engineering decisions

`app.js` keeps the numerical helpers separate from canvas drawing functions within a single script. For an m × n matrix at rank k, storing U, singular values, and V takes approximately k(m+n+1) scalar values, compared with mn for the original matrix. Real memory usage additionally depends on data types, metadata, and allocation overhead. Low-rank reconstruction is generally lossy.

Vanilla HTML/CSS/JavaScript avoids a build toolchain. Power iteration makes the concept inspectable, but this implementation is not a production numerical library and does not guarantee deterministic output.

## Structure and run

| Path | Purpose |
| --- | --- |
| `index.html` | Page and controls |
| `styles.css` | Layout and appearance |
| `app.js` | Game, numerical helpers, canvas rendering |
| `assets/MedByte_Report.pdf` | Bundled research/project report |
| `tests/svd.test.cjs` | Numerical regression checks against actual helper functions |

Open `index.html` in a browser or serve the repository root:

```bash
python -m http.server 8000
```

Open http://127.0.0.1:8000/. Use the left arrow/compress button or right arrow/store-raw button in the game. Use the matrix-type control and rank slider in the visualizer. External fonts or icons may require internet access.

## Verification

Node.js 22 or newer, with no npm dependencies:

```bash
node --check app.js
node --test tests/svd.test.cjs
```

Tests exercise matrix/vector arithmetic, rank-one reconstruction, zero reconstruction, and error calculations. They do not automate the browser game or establish OS compression performance.

## Limitations and next steps

- Numerical initialization is random and results can vary.
- Game behavior approximates memory pressure rather than modeling a real allocator.
- Move numerical functions into a dedicated module if the app grows; add keyboard/accessibility and browser interaction tests.
- Add repeatable experiments before making real-system memory or speed claims.
