# LineWork

Linear lighting takeoff from architectural PDFs. No build step and no backend —
serve the repo root as a static site, or open `index.html` directly. pdf.js is
vendored in `vendor/`, so it works offline and installs as a PWA.

**Version 1.52.0**

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

## Tools, turned on and off, and pinned

Every tool is an entry in one registry, and the toolbar is rendered from it. That
makes two things possible.

**Settings › Tools** turns any tool off. It only comes off the toolbar: its key
still works and it still appears in the palette picker, because hiding is about
clutter, not capability. *Select* and *Calibrate* are core and cannot be hidden —
and a project file that claims otherwise is corrected on load. **Show every tool**
puts them all back.

**Palettes** are floating sets of the tools a particular job needs — the Tool Chest
idea. Pin one, put any tools on it, drag it by its bar to wherever suits the
drawing. A tool lights up on the toolbar and on every palette at once.

Each palette has the three states a panel has anywhere:

- **Pinned** (◉, amber border) — stays open.
- **Unpinned** (○) — folds back to its bar the moment you take a tool off it, so it
  stops covering the drawing. The bar keeps a count of what is on it; the triangle
  opens it again.
- **Hidden** (×) — off screen but kept. Settings › Tools shows it back.

**Managing one in place.** The **⋯** button picks which tools are on it.
Right-click a tool on a palette — long-press on a tablet — to take just that one
off. Nothing about the tool itself changes: a palette is only a shortcut to it, and
the tool stays on the toolbar and on its key.

**Recent tools** is a palette that fills itself with the last eight tools you
reached for, so the second and third use of anything is one press. Nothing to
choose on it, and it can be cleared. Only one palette can be the recent one.

**After placing a markup**, Settings › Tools decides whether the tool stays
selected for the next one or goes back to Select — Bluebeam's drawing and
properties modes. The tools that ask "keep placing?" start from that answer.

Where every palette sits, what is on it, and which tools are off the toolbar all
travel in a **preset**, so an office standard is one file — the profile idea.

However many tools are on, the toolbar stays **one row**: the tool strip yields
space to the zoom and page controls and scrolls sideways inside itself, so those
never move. On a tablet the whole row scrolls instead, so one swipe reaches
everything.

## Reading cutsheets

A manufacturer's downloads page is a folder of PDFs, and every number in it is a
number the takeoff needs. **Library › Read cutsheet PDFs** takes the whole folder
at once:

- each PDF is read **here in the browser** — nothing is uploaded anywhere
- it is matched to a product by its **file name**, so `QTL_SW24_1_5.pdf` finds
  SW24/1.5 and is not mistaken for SW24/3.0 — the longer agreement wins, and an
  extrusion is also matched through the tail of its catalogue link
- every row is listed as **file → product**, with the figures found underneath, so
  a wrong match is unticked before it is applied rather than discovered later
- sheets matching nothing can be **added as new items**, filed by what the sheet
  says: watts or lumens per foot make an LED product, a stock length a channel, a
  wattage a supply. A sheet that says only "24V" is not filed on a guess. An
  encapsulated or neon product is created as a made-to-length fixture rather than
  as cuttable tape, because getting that wrong makes the cut list nonsense.
- by default the sheets **only fill in what is unset**, so a figure you have already
  checked stands; one tick lets the sheets win instead
- the whole reading is **one undo**

What comes out: volts, watts and lumens per foot, the cut point, the maximum and
minimum lengths it is made in, CRI, the colour temperatures offered, the connector
options, a lumens-per-CCT table, reel lengths, stock length and clip spacing,
made-to-length limits, rated watts, Class 2 and the dimming protocols — plus the
sheet's own revision, so a newer one can be spotted later. Reading a sheet marks
that item checked and records which file it came from.

**What kind of product a sheet is about is settled before any number is read**,
because these sheets cross-reference each other. An extrusion sheet prints a
compatibility matrix listing the watts per foot of every strip that fits it, and a
strip sheet lists the extrusions it fits. Read without that gate, LALO comes out as
a 5 W/ft LED product. The title block decides, and only then are that kind's fields
looked for. In the same spirit: the 10 in `QZ-PRO-PH/0-10V` is not an output
voltage, the 120" maximum on a bare-wire lead is not the strip's maximum length,
and "PWM output" is not a dimming input — that is how a driver drives the LED, not
how it is told what to do.

**One sheet is often several products.** A supply covering 30W, 60W, 96W, 192W and
288W is five supplies; a flexible fixture offered in 1.0, 2.0 and 4.0 W/ft is
three. Taking the first would quietly order the smallest, so a sheet new to the
library becomes one item per output, each named for its own wattage.

**Made to length.** Two ways an extrusion is bought: bar stock you cut from, which
leaves off-cuts to nest, or ordered at the length you want in its own increment up
to the longest piece it is made in. For the second there is nothing to nest and no
waste to report, and the last piece is rounded up to the increment instead of being
carried as an off-cut. A **minimum** length works the other way: a piece below what
a fixture is made in is called out as not orderable rather than quietly rounded.

**While it reads**, a bar says which file it is on and how far through it is, and
it can be **stopped part way** — whatever it read up to then is still offered. Each
sheet is let go as soon as it has been read, and only the pages actually needed are
read, so the size of the folder does not matter. (Before that, reading a whole
downloads folder held every document open at once and took the tab out of memory.)

This is the PDF's **text layer, not OCR**. A sheet whose figures are drawn as part
of a picture, or a scan, has nothing to read: it is reported by name as
unrecognised rather than guessed at, and *Read specs* on the individual item takes
pasted text instead. Everything it does find is still worth checking against the
sheet — it reads text, it does not understand it.

## Flatten

Locks markups to the sheet so they cannot be picked up, dragged or edited by
accident. They still **draw**, at a slightly softer weight so you can tell which
ones are locked. Choose what it covers:

- **this page**, **this sheet** or **the whole job**
- **notes and review markups only** (the default — it leaves the takeoff alone),
  **measurements and counts only**, or all of them
- whether to **allow unflattening later**. Leave it ticked and Document ›
  Unflatten puts a batch back; untick it and a second dialog asks again, because
  from then on nothing in the app can recover them.

Each run of it is a **batch**, stamped with when it happened, so Unflatten can put
back just the batch you meant. Permanently locked batches are reported by count and
never offered.

Two places this deliberately differs from Revu:

- **A flattened markup keeps counting in the takeoff**, and a run whose markup is
  flattened keeps measuring it. Locking the drawing should not change what is being
  ordered — what flattening takes away is editing, not arithmetic.
- **The file is untouched.** A genuinely flat PDF comes from Export marked-up PDF,
  which burns everything into the image; this is about the project.

While flattened, a markup leaves the markups list and the markup list in the
sidebar, and layer toggles no longer hide it — it is part of the sheet now.

## Spaces (Z)

A named region of the drawing — a room, a level, a zone — so a markup is
attributed to **where it actually is** rather than to whatever someone typed.
Trace it, name it, and everything whose middle falls inside belongs to it:

- the markups list gets a **Space** column, and the filter searches it
- the cut list and the workbook carry it
- there is a **By space** rollup beside by zone and by sheet
- a legend can group by it
- the run card says where the run is

Where spaces **nest, the smallest one wins**, so a level and a room inside it both
work and the finer answer is the one reported — and deleting the inner one hands
its contents back to the outer. Moving a markup moves what it belongs to; its typed
zone is left alone, because a space attributes rather than rewrites.

A space is a label, not a measurement — it never feeds a run. One left unnamed is
not kept, since it would attribute nothing, and neither is one with fewer than three
corners.

## The markups list

Every markup in the job as rows — sheet and page, kind, subject, what it measures,
a status, and any columns you add. Click a row to jump to the markup. Filter across
every field at once, show **this page**, **this sheet** or **the whole job**, and
export what is showing. The value column **totals by unit**, so feet and degrees
are never added together.

**Statuses** — one per markup, from a set you can rewrite to match how the office
tracks work; the standard set is Open, In review, Closed, Accepted, Rejected.
Setting one records the time with it. A status decided before the set changed is
kept, still shown, and marked *off the set* — changing the set never quietly
rewrites a decision.

**Custom columns** — text, number, choice or date against any markup: a cost code,
a trade, a room, a due date. This is how a takeoff becomes priced data. Columns are
part of the job and export with it. A duplicate name and a choice column with no
choices are refused; removing a column drops the values in it and says so.

## Find a symbol (I)

Drawings repeat a symbol, and counting them by hand is where an evening goes. Box
one and this finds the rest: the page is rendered, both the symbol and the page are
reduced to ink-or-paper, and every window the symbol's size is scored on how much
of its ink lands on ink. A summed-area table gates each window in four lookups, so
a full page is scanned in about a second.

Search **this page**, **every page of this sheet**, or **every sheet that is
open**. Nothing is stamped until you have seen how many it found and the range they
scored — then it puts a count on each, in a group and symbol you pick, and can
**leave out any that already carry one** so a second pass does not double the
tally. Counts flow into the BOM like any other.

Two sliders: how close a match must be, and what counts as ink. What it will not
do is guess — it matches the symbol **as drawn**, same size and rotation, because a
drawing repeats a block rather than a variation of one; a box too small, one that
is most of the sheet, or a patch with almost no ink in it are each refused with the
reason; and a sheet that is not open cannot be searched.

## Legends

A key placed on the sheet itself, so a colour-coded takeoff reads without the
panels. Tap where it should sit and pick what it lists:

- **Runs by TYPE**, **by Zone #** or **by status** — a swatch, the number of runs,
  and the LED total per row, with a total line
- **Counted items** — each count group with its symbol and tally
- **Markups by kind** — how many of each

It counts **this page**, **this sheet** or **the whole job**, and it is generated
from the markups every time it is drawn — change a run's type and the legend
follows with nothing to touch. Change what it lists, what it counts and its text
size from the inspector rather than placing a new one. The swatches use the same
colours as the matching colour-by mode, so the legend and the drawing agree.

## Five more measurements and markups

- **Ellipse (O)** — a round cove. Drag it out, ⇧ keeps it a circle, and it measures
  the way round its edge (Ramanujan, good to a part in ten million), with the radius
  or both axes and the area alongside. It carries a treatment like any other
  measurement, so a circular cove orders properly.
- **Angle (Y)** — click the corner, then a point down each leg. Reads the angle,
  what the run turns through, both leg lengths, and the **mitre to cut on each
  side**, which is half the angle.
- **Radius (U)** — three points anywhere along a curve and it fits the circle
  through them: radius, diameter, the arc between the outer two, the included angle
  and the chord. Read a radius off a plan, then type it into a run's segment to match.
- **Arrow** — drags tail to head, ⇧ for straight.
- **Highlight** — a band that multiplies rather than covers, so what is under it
  still reads.

**Curved segments.** A cove that turns a corner on a radius is not two straight
legs, and measuring it as a chord loses real feet.

**Drag it into shape.** Every segment of a selected run carries a round grip
halfway along it. Drag that and the segment bows into an arc, with the radius, the
included angle and the length live in the status bar as you go. It is magnetic at
straight and at 45, 60, 90, 120 and 180°; **⇧** forces a quarter circle;
**alt-click** straightens it again. The grip sits on the chord while the segment is
straight and rides the arc once it is curved.

**Curve as you trace.** Hold **ctrl** (or **⌘**) as you place a point and the
segment just laid becomes a 90° arc, so a run can be drawn with its curves in it
rather than converted afterwards.

**Round all corners.** The other way a cove turns: the legs are where they should
be and the corner between them is radiused. Rounding pulls both legs back by the
tangent distance and puts an arc between them, so the run gets *shorter* — the
opposite of curving a chord, and both are real. On a right-angle corner of two 100"
legs at R 24", the legs become 76" each with a 37.7" arc between: 200" becomes
189.7". A corner too tight for the radius is left alone and reported, and nothing
goes on the undo stack if none of them fit.

For an exact figure rather than a drag: right-click any segment of a run — or press
the **arc** button beside it in the inspector's segment list — and give it an
**included angle** or a **radius**. 90° is the usual cove corner; give
one and the other follows. A radius too tight to reach across the chord is refused,
and it tells you the smallest that fits.

The length then follows the curve everywhere it matters: the segment readout, the
run total, the treatment, the cut list, the piece list, the order code, feed-point
positions and the wire schedule. On a 4'-8" chord across a corner, a 90° arc reads
5'-3" — the six inches a chord would have lost.

The curve is stored the way a CAD polyline stores one, as a bulge on that one
segment, so it stays **one segment with two ends you can drag**, the label sits on
the arc where the length is, and the bounding box grows to hold the bow. A new arc
bows *away from the rest of the run* — the side the wall is on when you have cut a
corner off — and can be flipped.

Editing around a curve is refused rather than fudged: adding or removing a vertex
inside an arc, and halving one, all say what they will not do. Deleting a vertex
that owned an arc says the arc went with it. Splitting a run in half still works
with curves in it — the halves are measured by true length and each curve goes to
the half it belongs to — unless the halfway point lands *inside* an arc, which is
reported with the segment named.

**Split in half (S).** Two different things, and they are not the same.

*Splitting a run* gives **two runs of equal length**. The point is found by walking
the path, so a dog-legged polyline halves by length rather than by vertex count — a
300" leg and a 100" leg cut at 200" along the first, not at the corner — and an arc
halves into two arcs. Press **S** again for quarters. Available on the selected
markup from the inspector, the right-click menu, the palette, or the key.

*Halving a segment* instead — click any segment in the inspector's list — puts a
vertex at its midpoint and **changes no length at all**.

What a split carries: the first half keeps the original run, so anything pointing
at it still does. The second half can become its own run with the same product
choices, arriving without a zone number and unapproved. Placed feed points and
splices move to the half they are actually on and are rescaled to it. A stated
length is halved with the run. The original loses its approval, because it was
approved against a length that no longer exists. A closed region and anything
without a length are refused with a reason rather than silently ignored.

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
