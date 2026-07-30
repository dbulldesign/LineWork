# LineWork

Linear lighting takeoff from architectural PDFs. No build step and no backend —
serve the repo root as a static site, or open `index.html` directly. pdf.js is
vendored in `vendor/`, so it works offline and installs as a PWA.

**Version 1.39.0**

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

## On an iPad

Built for iPad as much as for a desktop, and it adapts rather than shrinking:

- **The sheet gets the screen.** With a finger as the pointer, the two rails stop
  being columns and slide over the drawing one at a time — tap *Sheets* or
  *Takeoff* to bring one in, tap the sheet or the dimmed area to send it away.
  Attach a Magic Keyboard or trackpad and iPadOS reports a precise pointer, which
  puts the columns back.
- **One toolbar row**, swiped sideways, instead of four stacked rows eating 140 px
  of drawing. Zoom, Fit and the page arrows float over the sheet so they are
  always to hand.
- **A finger draws** by default — on an iPad with no Pencil nearby, "finger pans"
  meant tapping the dimension tool and having nothing happen. The moment an Apple
  Pencil is used the finger goes back to panning, which is what you want with a
  palm on the sheet; the toolbar toggle overrides either way. Two fingers or a
  pinch always move and zoom the sheet.
- **Long-press is right-click.** Hold for half a second on a markup or on bare
  paper and the same menu opens. A press that turns into a drag stays a drag.
- **No shift key, no problem**: the ⧉ button in the toolbar turns on
  add-to-selection, so tapping markups builds a set to align, recolour or delete
  together. It is also in the long-press menu.
- Tap targets are sized for a thumb, form fields are 16 px so iOS never zooms the
  page when you tap into one, and the titleblock clears the clock and battery when
  the app is installed to the home screen.
- **The version is in the titleblock**, next to the name, and tapping it opens
  About. An installed copy opens from its own cache, so it also checks what is on
  the server: the chip turns amber with an arrow when a newer build is waiting,
  and the answer is always to close the app fully and reopen it.

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

## The product library

The library is seeded with **QTL** products — the static white and high-efficacy
linear strips, the Q-CAP encapsulated flexible fixtures, the aluminium extrusions
and the DC power supplies — each carrying a link to its own page on qtl.lighting.

A product is described in seven terms, in this order: **name, voltage, watts per
foot, the colour temperatures it is offered in** (a multi-select), **minimum cut
increment, maximum length**, and **the connector options** it can be ordered with
(BW bare wire, BRL barrel, CLS closed end, CON6, CON24 — also a multi-select).
The longest single run a product is made in is also the most one feed will carry,
so that is **one figure, not two** — feed points are worked out from it. A
treatment then picks one colour temperature, and a connector for **each end**,
from what that product actually offers; the light output follows the CCT.

**Stated lengths.** Plans are not to scale everywhere. Where the sheet prints a
dimension, type it into the markup and it governs — but never quietly. The
inspector shows what the markup traces, what it is ordering to, and the difference
between them; a polyline shares the stated total over its segments in proportion so
the parts still add up to the whole; and the run says *every time* that it is
ordering to a stated length rather than the trace.

**Renumber.** Zone numbers leave holes when runs get deleted. Renumbering fills
them in the order you ask for — as added, down the sheet, or longest first —
counting from the start within each type, since a zone number means something
inside its type and nothing across types. Approved runs keep their numbers because
they are the record of what was issued, and the numbers they hold are stepped over
so no two runs end up sharing a tag (two runs on one tag would merge their piece
marks).

**Array.** Repeated bays hold the same run over and over. Array steps a markup by a
real distance as many times as you like, and can give each copy its own run
carrying every product choice from the original. No copy arrives approved, and none
inherits the original's zone number — press **Renumber** and they fall into line.

**The issues panel.** Every warning on the job in one place, grouped by kind — so
a systemic gap reads as one line with a count of forty rather than forty identical
notes buried in forty cards. Click a run to jump straight to it. Exports as a CSV.

**Quieting a kind.** Some warnings are permanent facts of an office rather than
problems: a shop that always orders to the exact length does not need telling
there is no cut increment. Quieting a kind stops it showing on runs and stops it
colouring them — but it does not decide the question. The issues panel still
lists it, still counts it, marks it *quieted*, and still exports it. Nothing goes
silent.

**Colour by status.** A fourth colour mode paints the drawing by where each run
stands: changed by a revision, has a warning, approved, measured and clean, or not
measured yet. Worst news wins, so a flagged run reads as flagged whether or not it
also warns. The key counts each one, which turns the plan into the punch list.

**Defaults by type.** A run's type says most of what it is, so the product, build,
colour temperature, both connectors, wire colour and type, dimming, channel,
supply and rounding are remembered against it. Name a new run's type and it
arrives filled in — which is most of an order code already done. A saved default
never overwrites a decision already made: applied by hand it fills only the
blanks, and replacing an existing choice takes an explicit tick.

**Editing several runs.** Tick runs in the list and set any field on all of them
at once. Every field starts at *leave alone*, so nothing moves unless it is
chosen, and the option lists are built from the picked runs' own products so
nothing impossible is offered. Approved runs are skipped and counted rather than
quietly unlocked.

**Revision impact.** What moved is half the answer; which runs are in it is the
other half. After a compare, every run whose markup crosses a changed area is
listed — tested *segment against rectangle*, so an L-shaped cove is not blamed for
a change in a corner it never enters. Flag them for a re-measure and, where they
were approved, withdraw those approvals in the same step. A flagged run carries a
red **REV** badge, warns in the Calculated panel, is searchable, and appears in the
cut list, the workbook and a section of the printed report. Approving a run clears
the flag, because approving *is* the re-measure the flag asked for. Runs on other
sheets are set aside rather than reported clear.

**Command palette (⌘K).** One searched list of every tool, action, setting, sheet
and run in the job. Every word has to appear somewhere, so `cove z4` narrows to
that run — and picking it opens the sheet, selects the markup and opens the card.
Arrows to move, return to run, escape to close. Thirty-nine shortcuts are more
than anyone remembers; this is how you find them.

**Presets.** The settings an office reuses on every job — rates, units, precision,
rounding, labour hours, wire allowances, the defaults by type and the quieted
warning kinds — saved as one file, optionally with the product library. Applying
one replaces those settings and leaves the sheets, markups and runs alone. It runs
through the same validation a project file gets, so a hand-edited preset cannot
put nonsense into the settings.

**Photos (H).** Pin a site photo where it was taken, with a caption. The picture is
kept in this browser alongside the drawings and travels inside a *Save with
drawings* file, so the one file really is the whole job. A pin whose picture is not
in this browser says so rather than showing a blank.

**A grouped card.** With fourteen fields on a run, the card is split into Product,
Order code, Channel, Power and Documentation, each under a quiet rule that
summarises what the group amounts to — the order-code group's heading *is* the code
it builds.

**Feed points, routed home runs, splices.** Three tools that turn assumptions
into measurements.

*Feed points* (**F**) were only ever a count worked out from voltage drop, which
is why the wire schedule had to take every whip at the same distance. Place them
on a run and the drawing answers instead: the count comes from what is placed, and
each feed measures its own way back to its driver. Placing fewer than voltage drop
needs is flagged rather than silently corrected, and a placed count beats a typed
override — with the disagreement reported.

*Home runs* (**W**) route the wire: click the driver, each turn, then the feed. The
schedule then uses what would actually be pulled rather than the straight line — a
dog-leg that measures 450" no longer counts as 180". A route whose ends find no
driver and no feed still measures, and says it is **not attached** rather than
quietly counting for something.

*Splices* (**J**) mark where two pieces of a run actually join, and the piece list
is cut there instead of shipping one length. Each piece keeps its own order code at
its own length, and they still add up to the run.

Deleting a run takes its feed points and splices with it. Routes survive as
measurements with their dangling ends cleared.

**Home-run wire.** A placed driver knows how far it is from each run it feeds, so
that distance is measured off the sheet and multiplied by the whips the run needs
— one per feed point, per identical run. **Slack per whip**, a **spare
percentage** and a **rate per foot** are in Settings › Drivers; the schedule sits
under the drivers table and the total lands in the BOM, the cost, the report, its
own CSV and a **Wire** sheet in the workbook.

Two things it will not fake. Where a run has several feed points, only the nearest
is measurable, so the extra whips are taken at that same distance and the row says
so — the assumption is on screen, not buried. And a run on a different sheet from
its driver is *counted* but contributes no length, reported as **not measured**
rather than estimated.

**Dimming.** A run is specified to dim a particular way and a supply either does
that or it does not, so the protocols live on the supply and the run names the one
it needs. Ask a phase-only driver for DALI and it says so, naming what it does do.
The protocols on the seeded supplies are only the ones written into the model
numbers themselves — `PH` is phase, `/0-10V` is 0-10V; where a model number says
nothing the list is left unset and the calculator reports that compatibility
*cannot be checked*, which is not the same as reporting it fine. A driver carrying
runs that want two different protocols is flagged as well — one driver dims one
way.

**Order codes.** A part number is a fixed run of positions, and each product
carries the format its own cutsheet prints — so a product without one gets no
code rather than a guessed one. The positions fill from choices already made:
build, colour temperature, both connectors, wire colour, wire type, and the
piece's own cut length. A 48" dry 3000K run of SW24/1.5 with bare wire at both
ends comes out as `SW24/1.5-DRY-30-BW-BW-WH-CL2-48"` — character for character
the sample part number printed on its sheet.

Because length is one of the positions, **every physical piece gets its own
orderable code**, on the Pieces tab and in both the CSV and the workbook. A
position that is not filled in comes out as `?` and is named in plain words, so
an incomplete code reads as incomplete rather than plausible. Two rules the sheet
states are enforced: CL2P only with bare-wire leads, and a barrel connector takes
`N/A` for wire colour.

Where a product comes in **dry, damp and wet-location builds**, the run picks
one. The wet build is a different product for takeoff — it runs shorter and it is
dimmer — so it overrides the maximum length and the lumens per foot, and with it
the feed-point count. On SW24/1.5 that is 30 ft and 141 lm/ft against 64 ft and
172. Leave the build unspecified and the base figures are used, with the
calculator saying so rather than assuming dry. The build and its IP rating travel
into the cut list.

A run is ordered with a connector at both ends — that is what the two connector
positions in a QTL order code are — so the treatment has **Connector in** and
**Connector out**. Which codes are available differs from product to product, so
they come off that product's own list, and a product with no list on file shows no
dropdowns rather than offering codes it may not be made with. A **closed end**
is only offered as the outgoing one, because it cannot feed anything. Both start
*not specified*: leave one blank and the calculator says the order line is
incomplete instead of choosing an end for you. Both ends travel into the cut-list
CSV and the workbook, alongside the colour temperature.

A product transcribed from its actual spec sheet also carries everything else the
sheet publishes: the cut point, watts per foot, **lumens per foot at every CCT**, CRI,
the longest single run, the IP variants with their own maxima and outputs, and the
sheet's revision date. A treatment then picks its colour temperature from that
table and the light output follows. SW24/1.5 is the worked example.

Only the figures the catalogue pages state are filled in for the rest. Where a cut point, a
maximum length or a stock length is not stated, it is **left unset and the
item is marked unverified**: the library shows the badge, and the calculator says
which number is missing rather than rounding on a guess. A blank that announces
itself is safe; a plausible number nobody checked is not.

Every LED product, channel and supply has a **cutsheet link**, and two buttons:

- **check** — confirms the link still resolves and dates it. A cross-origin
  response cannot be read by a browser, so a link that answers but cannot be
  inspected is reported as exactly that rather than as good.
- **read specs** — paste the cutsheet text, or hand it the cutsheet **PDF**, and
  it pulls out volts, watts per foot, lumens per foot, the cut point (including
  "8 diodes per 2\"" and metric increments), the maximum length, and stock
  lengths. Nothing changes until you confirm each number.

*Load QTL starter library* puts the seeded set back, merging or replacing, and
*Check every cutsheet link* walks the whole library at once.

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

Feed points come from the maximum length — the longest single run a product is
made in is also the most one feed will carry — and can be overridden per
treatment. Setting fewer than that limit allows is flagged rather than silently
accepted, and a product with no maximum length on file says feed points cannot be
checked instead of reporting one.

A run sits between two cut points. The Calculated panel offers **next shortest**,
**nearest** and **next longest**, each in decimal feet and in inches, with how far
each is from the measurement. Picking one **locks** the cut for that treatment, so
re-measuring the markup no longer moves it: the box you chose is ringed and the
other two grey out, because they are no longer the answer. Unlock and all three
come back. Nearest often lands on the same length as one of its neighbours, so
the box that lights up is the one you actually pressed.

Treatment tags are built from **TYPE** and **Zone #** — set those and the tag
becomes e.g. `COVE Z2`, shown on the drawing, in the cut list and in exports.

## Saving

Every change auto-saves in the browser. **Save project file** (⌘S / Ctrl-S)
writes the whole takeoff — sheets, calibration, markups, treatments, and product
libraries — to a single `.linework.json` file. In Chrome and Edge that file stays
linked, and auto-save keeps writing to it.

The PDFs are not in that file — that keeps it small. They are kept separately in
this browser, so reopening a job on the same machine needs no re-import; on
another machine, open the project file, re-import the same drawings, and every
dimension, note and link reattaches by filename and size.

**Save with drawings** writes one file that holds everything: a `.linework.zip`
containing the project and every sheet's PDF byte for byte. Open it anywhere and
the job comes back with its drawings already there — nothing to re-import. Put it
in iCloud Drive, Dropbox or OneDrive and that single file *is* the job, on every
machine you use. It is a plain stored zip, so the sheets can also be pulled out
of `sheets/` by hand, and a `README.txt` inside says what the file is. Expect it
to be about as big as the drawings are.

In Chrome and Edge a `.linework.zip` can stay linked like the JSON does, but
because the whole archive is rewritten each time, auto-save writes it every 15
seconds rather than after every change — and always when you leave the tab.

**One tab at a time.** Two tabs open on the same job would both auto-save to the
same browser storage, last write winning with nothing said. So one tab holds the
pen; any other says *This job is open in another tab*, stops writing, and offers
**Take over**. Closing or reloading a tab hands the pen straight back.

## The manual

`?` (or the **?** button in the header) opens a manual covering every tool, what
each one is for, how the takeoff works, the library and its cutsheets, sheets and
revisions, exports, iPad gestures, the full shortcut list, and what to check when
a number looks wrong. **Print or save** turns it into one self-contained page you
can pin up next to the plotter.

The shortcut list below and the one in the manual are the same list the
application binds its keys from, so they cannot drift apart.

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

**Labels turn.** A length label can lie flat or run along the measurement it
belongs to — per markup, or as the default in Settings — and any single label can
be turned by hand from its right-click or long-press menu. Text, text boxes,
callout notes and area boxes turn too: drag the round grip above a selected one,
or type an angle in the inspector. Angles snap to 15° when you get close, and
carry into the exported sheet.

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
titleblock on every screen size — tap it for About — and recorded in every saved
project. `FILE_VER` is the project-file
schema, and only changes when the saved shape changes incompatibly.
