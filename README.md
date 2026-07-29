# LineWork

Linear lighting takeoff from architectural PDFs. No build step and no backend —
serve the repo root as a static site, or open `index.html` directly. pdf.js is
vendored in `vendor/`, so it works offline and installs as a PWA.

**Version 1.20.1**

## What it does

Import a plan, elevation, or millwork shop drawing, calibrate it against a known
dimension, then measure every linear run and get a cut list and bill of materials
out the other end.

- **Measure** — dimension runs (drag to trace a curve, or tap each corner), poly
  lengths that report each segment separately with an optional closing leg, and
  arcs measured from three points on the curve. Measurements snap to the
  drawing's own corners and endpoints.
- **Regions** — trace a room for its area, its perimeter, and the run of cove at
  a set distance in from the wall. The inset is real geometry rather than
  perimeter minus a guess, and a treatment linked to a region orders the cove run.
- **Count** — stamp a symbol for the things you tally rather than measure, and
  each group lands in the BOM alongside everything else.
- **Parallel runs** — offset a traced path sideways, one or several evenly spaced
  rows, with the option to copy the treatment too.
- **Revision clouds** — clouds with a delta and a note. *Compare revisions*
  renders two versions of a sheet, diffs them, and clouds what changed.
- **Drivers** — place supplies on the plan, assign what each feeds, and see its
  load against its usable capacity plus the longest home run.
- **Mark up** — text, text boxes, callout notes, area boxes, freehand ink, and
  links from a plan to the millwork shop drawing that details it. Line weight is
  adjustable per markup. Every markup stays editable: drag it to move, drag a
  handle to reshape, double-click to retype.
- **Take off** — one treatment per lighting condition, each carrying a TYPE
  designation, its LED product, channel, power supply, feed points and the detail
  that shows how it is mounted, rolled up into a cut list and BOM with waste and
  supply-load allowances. A treatment can be **approved**, which freezes its cut
  and says so if the drawing moves underneath it.
- **Order** — a per-piece cut list with piece marks (`COVE Z1-3`, 3 of 7),
  off-cut nesting into stock lengths with a yield report that separates a
  re-usable off-cut from scrap, and rollups by zone and by sheet.
- **Price** — rates on the library items, labour as hours per foot and per feed
  point, a material markup, and a cost per LED foot. Anything unpriced is
  reported as unpriced rather than counted as free.
- **Compare** — **alternates** price the same takeoff with a different product
  without touching it, and a **baseline** turns every later change into a
  reported difference rather than an argument.
- **Export** — a real `.xlsx` workbook of every table; a printable takeoff report
  including piece labels for the bench; cut list, BOM, pieces, nesting, drivers,
  rollups and cost as CSV; the marked-up sheet as a flat PDF; the whole project
  as one file; and the product library as its own file to reuse across jobs.

Built for iPad as much as desktop: Apple Pencil draws while your palm rests on
the sheet, and pinch-zoom works throughout.

## Reading the drawings

Imported sheets have their number and name read from the PDF's text layer, so a
set arrives already indexed. This is the text layer and not OCR: a scanned
drawing says "no text layer" rather than inventing a number.

Drawings are kept in this browser (IndexedDB), so reopening a job needs no
re-import. The project file is still the portable copy — it never carries the
PDFs — and the store can be turned off, sized and cleared in Settings.

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

Three more things keep a busy job responsive: a small **tile cache**, so panning
back to where you just were is a copy rather than a re-render; **off-screen
rasterising** where the browser supports it; and an **incremental overlay**, so
dragging one vertex re-formats one markup instead of every markup on the page.
The drawing geometry used for snapping is cached per page too, and long tables
render a capped number of rows — while still totalling the whole job.

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

A run sits between two cut points. The Calculated panel offers **next shortest**,
**nearest** and **next longest**, each in decimal feet and in inches, with how far
each is from the measurement. Picking one **locks** the cut for that treatment, so
re-measuring the markup no longer moves it. Unlock to go back to following the
measurement.

Treatment tags are built from **TYPE** and **Zone #** — set those and the tag
becomes e.g. `COVE Z2`, shown on the drawing, in the cut list and in exports.

## Saving

Every change auto-saves in the browser. **Save project file** (⌘S / Ctrl-S)
writes the whole takeoff — sheets, calibration, markups, treatments, and product
libraries — to a single `.linework.json` file. In Chrome and Edge that file stays
linked, and auto-save keeps writing to it.

The PDFs themselves are never stored *in the project file* — that keeps it small
and portable. They are kept separately in this browser, so reopening a job on the
same machine needs no re-import; on another machine, open the project file,
re-import the same drawings, and every dimension, note and link reattaches by
filename and size.

## Keyboard

| key | tool |
|---|---|
| `V` | select / pan |
| `C` | calibrate scale |
| `L` | dimension run |
| `G` | poly length |
| `A` | arc length |
| `R` | region — area, perimeter, cove run |
| `M` | count |
| `Q` | revision cloud |
| `D` | place a driver |
| `B` | area box |
| `T` | text |
| `X` | text box |
| `N` | callout note |
| `K` | link a shop drawing |
| `P` | pencil ink |
| `E` | erase |

| key | action |
|---|---|
| `Esc` | cancel and return to select |
| `⏎` | finish the current run |
| `⇧`-click / `⇧`-drag | add to the selection / sweep one |
| `⌘A` | select every markup on the page |
| `⌘Z` / `⇧⌘Z` | undo / redo |
| `⌘Y` | history |
| `⌘S` / `⌘O` | save / open project file |
| `⌘,` | settings |
| `[` `]` `\` | hide the left rail / the right rail / swap them |
| `+` `-` | zoom; arrow keys change page |

## Settings

`⌘,` (or the ⚙ in the header) opens a settings page covering the whole
application, grouped into tabs:

- **View** — theme, which rails show and on which side, automatic markup colours,
  performance (tile re-use, off-screen rendering) and the row cap for long tables.
- **Measuring** — units, display precision (lengths can read to the nearest
  1/8", 1/4" or foot while the arithmetic stays exact), snapping to the drawing's
  geometry, which way a run rounds to a cut point by default, and the default
  cove inset for new regions.
- **Labels** — content-aware placement, per-segment poly labels, arc radius
  readouts, label size, default line weight.
- **Estimating** — material waste, the supply load ceiling, nesting scope and
  the smallest off-cut worth keeping, labour hours and rate, material markup, and
  the longest acceptable driver home run.
- **Input** — what the scroll wheel does, and whether a finger draws or pans.
- **Files** — auto-save to the linked file, the undo history, whether drawings
  are kept in this browser and how much they take, project name and number.
- **About** — application version, project-file schema, PDF engine and offline
  status, and what the project currently holds.

Everything is saved with the project, so a job keeps the way you set it up, and
**Reset to defaults** puts the preferences back without touching the takeoff.

## Working on a busy sheet

Markups can be hidden by kind while measuring, and coloured automatically by
TYPE or Zone # instead of by hand. Every list and table sorts — the markup list,
treatments, the library, the cut list, BOM, rollups and the piece list — and the
order is remembered. Treatments also filter by tag, type, zone, room or product.

**Content-aware labels** keep measurement labels from stacking on top of each
other when two runs sit close together; each steps aside to the nearest clear
slot. Drag any label to place it yourself and a leader line ties it back to its
measurement — everything else then avoids where you put it. The setting can be
turned off if you would rather labels sat exactly where the measurement puts them.

On a poly length, **every label moves independently** — each segment label and
the run total are dragged and remembered separately, and "Put the labels back"
in the right-click menu clears them all. The **run total reads differently from
the segment labels** — filled and heavier, where the segments are outlined — so
the number you order by never gets mistaken for one of the legs.

Either side panel can be **hidden** (`[` / `]`) and the two can be **swapped**
(`\`) so the takeoff sits on whichever side you work from. The choice is saved
with the project.

Several markups can be worked on at once: `⇧`-click or sweep a selection, then
align, distribute, recolour, reweight, hide or delete the lot in one step —
dragging any one of them moves the set.

Runs are editable point by point: double-click a run to break it at that point,
⌥-click a handle to remove one, or use the right-click menu for both. The footer carries a running total for the page you are on as well as
the whole job. A light theme is available for printing and for bright site
conditions.

Calibration is the one step that silently invalidates every number downstream,
so an uncalibrated sheet says so, and a traced scale is checked against standard
scales — and against the sheet size it implies — before it is applied. A sheet
whose pages mix scales is normal, so **Scales…** lists every page, says which
carry their own scale and which inherit the sheet's, and sets or clears them over
a page range.

Every undo step is labelled with what it was, so the history can be aimed rather
than counted — `⌘Y`, or `⌥`-click the undo button.

## Versioning

`APP_VER` at the top of the script is the application version, shown in the
titleblock and recorded in every saved project. `FILE_VER` is the project-file
schema, and only changes when the saved shape changes incompatibly.
