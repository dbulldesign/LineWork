# LineWork

Linear lighting takeoff from architectural PDFs. A single self-contained
`index.html` — no build step, no server. Open it in a browser, or serve the repo
root as a static site.

**Version 1.3.0**

## What it does

Import a plan, elevation, or millwork shop drawing, calibrate it against a known
dimension, then measure every linear run and get a cut list and bill of materials
out the other end.

- **Measure** — dimension runs (drag to trace a curve, or tap each corner) and
  poly lengths that report each segment separately, with an optional closing leg.
- **Mark up** — text, text boxes, callout notes, area boxes, freehand ink, and
  links from a plan to the millwork shop drawing that details it. Every markup
  stays editable: drag it to move, drag a handle to reshape, double-click to
  retype.
- **Take off** — one treatment per lighting condition, each carrying its LED
  product, channel, and power supply, rolled up into a cut list and BOM with
  waste and supply-load allowances.
- **Export** — cut list and BOM as CSV, and the whole project as one file.

Built for iPad as much as desktop: Apple Pencil draws while your palm rests on
the sheet, and pinch-zoom works throughout.

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
