# LineWork

Linear lighting takeoff from architectural PDFs. A single self-contained
`index.html` — no build step, no server. Open it in a browser, or serve the repo
root as a static site.

**Version 1.6.0**

## What it does

Import a plan, elevation, or millwork shop drawing, calibrate it against a known
dimension, then measure every linear run and get a cut list and bill of materials
out the other end.

- **Measure** — dimension runs (drag to trace a curve, or tap each corner) and
  poly lengths that report each segment separately, with an optional closing leg.
- **Mark up** — text, text boxes, callout notes, area boxes, freehand ink, and
  links from a plan to the millwork shop drawing that details it. Line weight is
  adjustable per markup. Every markup stays editable: drag it to move, drag a
  handle to reshape, double-click to retype.
- **Take off** — one treatment per lighting condition, each carrying a TYPE
  designation, its LED product, channel, power supply, and feed points, rolled up
  into a cut list and BOM with waste and supply-load allowances.
- **Export** — cut list and BOM as CSV, and the whole project as one file.

Built for iPad as much as desktop: Apple Pencil draws while your palm rests on
the sheet, and pinch-zoom works throughout.

## How the sheet is drawn

Two layers, so panning and zooming stay smooth on large drawings:

- a **base layer** — one cheap full-page render, stretched by CSS, so something
  correct is always on screen at any zoom;
- a **detail layer** — a sharp render of just the visible window, double-buffered.
  The off-screen buffer is painted and swapped in only once it is complete, so the
  view is never cleared mid-render.

The consequence: a wide sheet at high zoom never asks for a canvas the browser
refuses to allocate, and the sheet never blanks or flashes while it catches up —
it only goes momentarily soft.

## Lengths and cut increments

Imperial lengths read as decimal feet with the inch equivalent alongside — for
example `20.42 ft (245.3")`. Decimal feet is what gets ordered; inches is what
gets cut. Any of `20.5 ft`, `246"`, or `20'-6"` is accepted as input.

Only the LED product carries a cut increment. **Tape** and **neon flex** cut in
fixed increments; **fixtures** come in fixed lengths and cannot be cut at all, so
they round up to whole units. **Channel is always cut to length** — its stock
length only says how it is bought, and never rounds the run. The BOM therefore
lists channel twice: the linear length actually needed, and the number of stock
lengths to buy.

Feed points are computed from the product's voltage-drop limit, and can be
overridden per treatment. Setting fewer than the limit allows is flagged rather
than silently accepted.

A run sits between two cut points — the next shortest and the next longest
increment. The Calculated panel offers both (marking which is nearest); picking
one **locks** the cut for that treatment, so re-measuring the markup no longer
moves it. Unlock to go back to following the measurement.

Treatment tags are built from **TYPE** and **Zone #** — set those and the tag
becomes e.g. `COVE Z2`, shown on the drawing, in the cut list and in exports.

## Saving

Every change auto-saves in the browser. **Save project file** (⌘S / Ctrl-S)
writes the whole takeoff — sheets, calibration, markups, treatments, and product
libraries — to a single `.linework.json` file. In Chrome and Edge that file stays
linked, and auto-save keeps writing to it.

The PDFs themselves are not stored in the project. Open a project file, re-import
the same drawings, and every dimension, note, and link reattaches by filename and
size.

## Keyboard

| key | tool |
|---|---|
| `V` | select / pan |
| `C` | calibrate scale |
| `L` | dimension run |
| `G` | poly length |
| `B` | area box |
| `T` | text |
| `X` | text box |
| `N` | callout note |
| `K` | link a shop drawing |
| `P` | pencil ink |
| `E` | erase |
| `Esc` | cancel and return to select |
| `⏎` | finish the current run |
| `⌘Z` / `⇧⌘Z` | undo / redo |
| `⌘S` / `⌘O` | save / open project file |
| `+` `-` | zoom; arrow keys change page |

## Versioning

`APP_VER` at the top of the script is the application version, shown in the
titleblock and recorded in every saved project. `FILE_VER` is the project-file
schema, and only changes when the saved shape changes incompatibly.
