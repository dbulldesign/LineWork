# LineWork

Linear lighting takeoff from architectural PDFs. No build step and no backend —
serve the repo root as a static site, or open `index.html` directly. pdf.js is
vendored in `vendor/`, so it works offline and installs as a PWA.

**Version 1.78.0**

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
- **Long-press is right-click — everywhere.** Half a second on a markup, a label
  or bare paper opens the same menu a right-click gives, and so does half a second
  on any row in either rail: a sheet, a markup, a run, a library product, a piece
  in the cut list. A press that turns into a drag stays a drag.
- **A ring of tools under your finger.** Press and hold on bare paper and the six
  tools you reach for most come to you — Select, Dimension, Poly, Region, Count,
  Note — with Undo and a *More…* that falls through to the full list. On a markup
  you still get the list, because those actions are specific and named. Settings ›
  Input swaps the ring back for the list if you would rather.
- **Two fingers tapped is undo, three is redo**, the way iPadOS does it everywhere
  else, and it says what it undid. Tapped, not dragged: both fingers must land
  within a moment of each other and close together, come up quickly, and not
  travel — and it is ignored for two seconds after the Pencil was near the glass,
  because a hand resting on a drawing is not a gesture. Both can be turned off.
- **Pinching to zoom keeps the run you are tracing.** Two fingers landing part way
  through tapping out a run used to throw it away; now you can zoom in and carry on
  with it. Only a shape still being dragged out is dropped, since the finger
  holding it has gone.
- **A tap that slides is still a corner.** A tap on glass always travels a few
  pixels, and that used to abandon the run half-drawn.
- **Units, and converting between them.** Write the unit after the number and the
  arithmetic keeps it: `500 mm`, `2.5 m`, `60 W`, `0.5 kW`, `4.2 A`, `250 mA`,
  `24 V`, `3 W/ft`, `150 lm/ft`, `120 sqft`, `15%`. Feet, inches, millimetres and
  metres all add up together, and the answer comes back **in the unit you wrote it
  in** — nobody types mm to be told feet. Under the answer sits the same figure in
  the other units of its kind; press one and it becomes that. In writing, `… in mm`
  or `… to W/ft` says which. One thing to know: `in` straight after a bare number
  is inches, so **`to` is the one that always means convert**.
  - **The electrics** are the rules a lighting job actually uses. Volts × amps =
    watts; watts ÷ volts = amps; watts ÷ amps = volts. **Watts per foot × a length
    = watts**, watts ÷ a length = watts per foot, and `120 W ÷ 3 W/ft` = `40'-0"`
    — the sizing question asked directly. Same three for lumens per foot. A
    percentage multiplies anything.
  - Everything else is **refused and says why**: volts plus amps don't add up,
    volts times volts isn't a thing. Two lengths multiplied is an area; an area
    over a length is a length. A figure with no unit on it is a plain number, and
    adding one to a length is refused rather than guessed at.
- **A floating calculator (⇧C).** On the desk rather than in the app: it floats
  over the drawing where you put it, works in feet and inches, and — the part that
  makes it worth having here rather than reaching for a phone — **the answer goes
  into the box you were in**. Click into a run's length, a waste percentage, a wire
  allowance; work it out; press *Use*. The button names the box it is about to
  fill, and the app takes the figure exactly as if it had been typed. A length goes
  into a text box as feet and inches; into a box with no unit on it a length is
  **refused rather than guessed at**. It runs on the same arithmetic the written
  sums do, so it knows lengths, the names sums have saved, and every run by its
  zone — `Z4 × 2` is a real question, and *Selected run* puts the zone in for you.
  *To the run* states the answer as the selected run's length. The last eight
  answers stay on the tape. Where it sits, what is in it and its tape travel in the
  project.
- **Write the sum on the drawing.** Adding feet and inches is most of a takeoff,
  and the answer belongs beside the thing it is about. Pick the sum tool, write
  `12'6" + 3'4" =` with the Pencil, and `15'-10"` appears in the same kind of line
  you wrote in. An `=` closes the sum; so does a pause, or the tick on the draw bar.
  Keep writing beside one to add to it.
  - **Feet and inches are real units.** A length times a number is a length; a
    length divided by a length is a plain number; two lengths multiplied is an
    area; and a length plus a bare number is **refused rather than guessed at** —
    in a takeoff that is precisely the mistake worth catching.
  - **Names and runs.** `cove = 42'6"` saves the answer under that name, and every
    other sum using `cove` follows when it changes. A run's zone stands for its
    length, so `Z4 × 2` is a real question. The answer drops straight onto a run as
    its stated length.
  - **How it reads your writing, honestly.** Apple's Math Notes is an OS feature
    with a trained model behind it, and no browser can call it. This matches each
    symbol's *shape* against built-in ones — fine for digits and operators written
    plainly, and not good enough to be trusted quietly. So it shows what it made of
    your writing, marks what it was unsure of, and takes a correction: retype it and
    it both re-reads the sum and **remembers those shapes as yours**, weighing them
    above its own from then on. Correct a 7 once and your 7 reads as a 7. What it
    learns travels in the project.
  - It is a note on the sheet. It measures nothing and orders nothing by itself.
- **A ruler to draw against.** ▭ Ruler in the toolbar, or ⇧R, lays a straightedge
  on the drawing the way it lies on a board. Draw against either edge and the marks
  land on it exactly, so a freehand drag along it comes out dead straight at the
  ruler's angle. **One finger moves it, two fingers on it turn it** about the point
  between them — the ruler takes those two fingers, so the sheet does not zoom under
  them. The angle is magnetic every 15° so level, plumb and 45° land exactly, and ⌥
  gives any angle; the wheel turns it with a mouse and the grip at its right end
  drags it round. It is **ticked in real units** off the scale in force where it sits
  — a scale region's own scale included — so it doubles as a scale rule, and the chip
  above it reads the angle and how long the ruler is on the drawing. The drawing's
  own corners still beat it: where there is a snap point the mark goes to the corner,
  and the ruler takes over where there is none. It never appears in an export.
- **What the Pencil is about to do.** Where iPadOS reports the Pencil hovering, a
  dot shows where the point would land before it touches down and turns green over
  a corner it will snap to — and part way through a run it says what the next
  segment would add. The snap is confirmed before the mark is made rather than
  after.
- **The eraser end erases.** Turn the Pencil over and the markup under it goes,
  named in the message so you know what went; a run measured off it keeps its
  length as a typed figure rather than losing it. Where iPadOS does not report the
  eraser this simply does nothing.
- **Your palm is ignored** while the Pencil is near the glass, so you can rest
  your hand on the drawing.
- **What Apple does not give a web app:** the Pencil's own double-tap and the
  squeeze on a Pencil Pro are reserved for native apps, so no browser can see
  them. That is why the ring is on press-and-hold rather than on a double-tap of
  the Pencil. Everything else the Pencil reports — pressure, tilt, hover, the
  eraser end — is used.
- **No shift key, no problem**: the ⧉ button in the toolbar turns on
  add-to-selection, so tapping markups builds a set to align, recolour or delete
  together. It is also in the long-press menu.
- Tap targets are sized for a thumb, form fields are 16 px so iOS never zooms the
  page when you tap into one, and the titleblock clears the clock and battery when
  the app is installed to the home screen.
- **An Update button, beside the name.** When a newer build is on the server the
  button appears — `⟳ Update to 1.72.0` — and pressing it does the whole thing:
  your work is written down, the cached copy of the app is thrown away, the old
  service worker is let go, and the page comes back on the new version with the job
  still open. Nothing to close and reopen.
  - **It looks by itself**: shortly after opening, whenever you come back to the
    app, and every half hour it is left open. The version chip also goes amber with
    an arrow, and tapping it still opens About.
  - **Why it never used to notice.** An installed copy opens from its own cache, and
    the check asked that same cache what the current version was — so the answer was
    always the version already on the device. It now reads the version out of the
    service worker's own file, which no cache is allowed to answer for, and the
    worker passes any no-store request straight to the network.
  - Pressing it when there is nothing new says so instead of clearing the cache for
    nothing and leaving you offline with no app.

## The Power pane

Circuits, drivers and the whips between them, read as **capacity rather than as
numbers**: every row says what it carries against what it may carry, with a bar on
the same measure, so one glance down the list finds the one in trouble.

- a **circuit** names its panel, breaker and voltage, and whether it is inside the
  80% continuous ceiling
- a **driver on no circuit** is a dashed row, not a silent omission
- a driver **past its ceiling** goes red and says to split the load or move up a
  supply
- the **wire size** is six buttons here rather than buried in Settings, because
  changing it is how you find out whether a whip is long enough to matter — the drop
  table underneath moves with it
- clicking a driver **goes to it on the sheet**

## Buying the tape

The choice and its consequence together, at the top of the cut list: *ordered to
length* or *by the reel*. Pick reels and the plan appears underneath, one card per
product — how many reels, how much comes off them, the yield, what is left over and
the longest piece still worth keeping. A product whose sheet lists no reels is never
offered one, and it says so rather than showing an empty list.

## The schedule, the panel, and the wire

**Fixture schedule.** The table a lighting drawing is issued with — one row per TYPE
— in the printed report and as its own workbook sheet. Everything in it was already
known; this only gathers it. A TYPE is meant to be one thing, so where two runs share
a designation but not their product, colour temperature or driver, the row says
**mixed** and names which field disagrees. A schedule that quietly reports one of two
different products is worse than one that admits the drawing contradicts itself.

**Circuits and the panel schedule.** A driver has a load; a circuit is the breaker
feeding it. Name a circuit against its panel, give it a breaker and a voltage, and
put drivers on it from the driver's own panel. A breaker is not loaded past 80%
continuously, so a 20 A circuit at 120 V carries 1920 VA — and a circuit over that is
reported with the figures. The load counted is what the drivers deliver; a driver is
not perfectly efficient, so where a supply carries an efficiency the figure is
**grossed up** by it, and where it does not the row says the losses are not counted
rather than pretending the two sides are equal. A driver on no circuit is reported
too, because nothing then checks what feeds it.

**Voltage drop.** Feed points come from the product's maximum run, which is the drop
along the strip itself. The whip from the driver to the run is a different conductor
and was not checked at all — yet its length is measured off the drawing and its load
is known, so the only thing missing was the wire size. Set that and the allowance in
Settings › Drivers and every whip reports its current, its drop in volts and as a
percentage, and whether it is past the allowance. The figures use the DC resistance
of copper at 20 °C, so a hot conductor is a little worse than reported.

## Bending, and checking the scale

**A flexible product only takes a curve down to a radius**, and the drawing already
carries the geometry: an arc markup has a radius, and a bulged polyline segment is a
circular arc whose radius follows from its chord and its bulge. Every curve on a run
is checked against the radius on the product's own sheet — KURV states 6" — and the
run card lists them tightest first with a cross against any that are too tight.
Where a sheet states no radius the curves are reported as **uncheckable rather than
passed**: ANYBEND prints the heading and puts the figure in a picture, so nothing is
invented.

**Hard corners are treated separately, and only on a made-to-length fixture.** On
cuttable tape a corner is no problem — you cut it and rejoin. A fixture has nothing
to cut, so a corner has to be a bend, and a bend has a minimum radius: a right angle
traced on the drawing is not something that can be built, and it also makes the
traced length shorter than the real one. Rounding the corners fixes both, and the
message says so.

**Checking the scale.** A stated scale is only right if the PDF is at its plotted
size, and the only way to know is to measure something you can read. *Check the
scale against a dimension* traces a line and **compares** rather than replacing: it
reports what that line measures at the current scale against what you say it is, as
a percentage, and offers the scale that would fit. Under half a percent it says it
checks out. An error over about ten percent usually means the sheet was printed to
fit a smaller page — in which case every sheet in the set is out by the same amount,
and it says so. Nothing changes unless you ask for it, and the line traced to check
it does not stay on the drawing.

## How things are actually bought

**Reels.** A cuttable tape is sold two ways: to length, or on the reel it is wound
on — SW24/1.5 comes on 64 ft and 100 ft reels. Which you buy is a decision for the
job (Settings › Estimate › Buying), and only a product whose own sheet lists reels
is ever reeled; a made-to-length fixture never is. Buying by the reel is the same
problem as nesting off-cuts into bar stock, so the runs are **nested into reels**:
the BOM says how many reels, how much is cut from them, how much is left over and
what the longest single remainder is. **A reel is bought whole**, so the cost is the
whole reel, not the footage used. A run longer than the reel it would come off is
reported rather than quietly split.

**Clips come with the extrusion.** QTL supplies them with the profile and sells
extras separately, so the clips a run needs at the profile's own spacing are
**listed but not ordered**, and only a spacing closer than the extrusion provides
becomes a line to buy. Counting all of them was charging twice for the ones already
in the box. The switch is on the channel, because it is not true of every
manufacturer.

**A closed end is coded differently by different products.** SW24/1.5 closes an end
with `CLS`; ANYBEND closes the same thing with `N/A`. Which code a product uses is
read off its own sheet, so ANYBEND can now be ordered with a closed far end at all —
before, its only option was to leave the order line incomplete. `N/A` is
deliberately not scanned for generally, since it appears on every sheet as the wire
colour and type for a barrel.

## Setting the scale, and deleting a sheet

**Click the scale in the titleblock.** Pick from the standard architectural, civil
and metric scales — typed into, like every other list — or write it however the
titleblock does: `3/32" = 1'-0"`, `1" = 30'`, `1:75`. Apply it to the whole sheet or
to this page alone. A bare `1/4` is **refused rather than guessed at**: as a ratio it
is 1:4, on a drawing it means `1/4" = 1'-0"`, and those are twelve times apart.

The dialog shows **the page size**, named where it is a standard sheet, because a
stated scale is only right if the PDF is at its plotted size. A drawing printed to
fit a smaller page is wrong by exactly however much it was shrunk, and a
letter-sized page is called out as one. Calibrating with the ruler measures what is
actually on the sheet, so it stays the sure way and is worth doing once against a
dimension you can read.

**A scale for part of a sheet.** An enlarged plan, a section or a detail sits on the
same page as the plan and is drawn at its own scale. Trace a **scale region** round
it and give it that scale: anything whose middle falls inside is measured at it, and
the rest of the page carries on at the page's. Where regions nest **the smallest one
containing a markup wins**, so a blow-up inside an enlarged plan still reads
correctly — the same rule spaces use. It is drawn dash-dot in amber with its name and
its scale on it, so a sheet never measures at a scale you cannot see, and the status
bar says how many are on the page. A region with no scale on it is not kept, because
it would change nothing.

Everything measured now goes through the region-or-page scale rather than whatever
page happens to be open, which also fixes a quieter thing: a markup on a sheet you
are not looking at is measured at **that sheet's** scale.

**Deleting a sheet** is the ✕ on its row. It counts what goes with it first —
markups, runs measured off it, links pointing at it, its scale — and asks twice.
Runs measured off it are **kept by default with their measured length written in as
a typed figure**: the takeoff is what was priced, and losing a drawing is not a
reason to change it. Untick that and they go too. The PDF is dropped from this
browser as well, so undo brings the sheet, its markups and its runs back, but the
drawing needs re-importing — and the row says so.

## The window

**Every tool is on the toolbar.** However many are turned on, the strip wraps onto a
second row rather than hiding what will not fit — it used to hold itself to one row
and scroll the tools inside whatever space the controls after it left over, which on
a narrower window was almost none, so most of the drawing tools simply were not
there. Settings › Tools turns off the ones you do not use.

**A rail scrolls up and down, never sideways.** It used to be plain `overflow:auto`,
so anything inside it that came out wider — the tab strip with seven tabs across, a
row of buttons, a row of fields whose inputs each want their default twenty
characters — pushed the whole rail sideways and took every label off the left edge
with it. On an iPad, where the fields are 16 px and the rail is a narrow overlay,
that happened as soon as a run card was open. The strip and those rows wrap now, the
field rows reflow onto fewer columns in a narrow rail, and sideways is shut. The wide
tables that genuinely need to scroll across still do, inside their own scroller.

**The rails resize.** Drag the inner edge of either one; double-click it to put that
rail back to its usual width. A takeoff rail wide enough to read a cut list across is
worth the sheet being narrower, and which way that trade goes is nobody's business
but yours. The widths travel in the project.

**The markup panel is foldable.** Its bar carries the figure, so it reads folded:
press the chevron to fold or open it, and it remembers which. On a tablet it starts
folded and stays short — a panel the height of the screen, over the drawing you are
measuring, is worse than one more tap. While a run is being traced it goes away
entirely and comes back when the run is done.

**Create treatment from this** now brings the takeoff rail in with it. On a tablet
the rail is an overlay, so switching to the takeoff pane changed the tab behind a
closed rail and nothing appeared to happen.

## What an iPad keyboard does to a typed length

iOS turns a typed `'` into `’` and a `"` into `”` before the field ever sees them, so
a perfectly good `10'-6"` arrives as `10’-6”` — and the length reader refused it
outright, which is why calibrating from the ruler on an iPad said it could not read
the scale. Every reader of a typed length or scale now straightens the punctuation
first: the curly quotes, the primes a keyboard offers instead, the dashes, and the
spaces that are not spaces. The dialog fields also tell iOS not to rewrite what is
typed. And when something really is unreadable, the message quotes back what arrived
— including what it came through as, if that differs — and says what it would accept.

## Closing a poly

**Tap the corner it started from.** Once there are three corners a ring appears on
the first one; it fills green when a tap would close it, and tapping closes the loop
and finishes the run in one go. A region behaves the same way. `⏎` still finishes an
open run, and a loop can be opened or closed afterwards from the inspector.

## Two taps for a dimension

The dimension tool is one segment: **tap where it starts, tap where it ends**, and
that is the measurement — nothing to press afterwards. Drag instead and it traces a
curve freehand, as it always did. Poly (`G`) is the tool that keeps going until you
finish it, for a run that turns corners.

## Splitting a run

A run splits into **halves, thirds or quarters** — three buttons in the inspector, three
entries in the right-click menu and in ⌘K, with **S** on the keyboard for halves. Halving
twice only ever gives you quarters; a cove that has to be made in three pieces is as
ordinary as one that arrives in two.

The cut points are found by **walking the path**, so a dog-legged polyline divides by
length rather than by vertex count and each part measures exactly the same. An arc divides
into arcs, each with its own point along the curve. What travels with the parts:

- a **stated length** divides by the same number
- **feed points and splices** move to the part they are actually on, rescaled to it
- where the run carried a **treatment**, you are asked whether the other parts become runs
  of their own — they arrive without a zone number and unapproved, and Renumber folds them
  in
- the run was **approved against a length that no longer exists**, so the approval is
  dropped
- the first part keeps the original markup id, so anything pointing at it still does

A cut that would land **inside a curved segment** is refused and names the segment, rather
than quietly straightening it. A curve on a segment the cuts left whole travels with the
part that kept it.

### Splitting one segment

Splitting a *segment* is a different thing: it puts vertices along that one leg and
**changes no length at all** — the run is the same run, just with somewhere to grab. Every
row of the inspector's segment list has a **Split** button, and the field under the list
says how many parts it makes: **any number from 2 to 24**. Two until you say otherwise, and
the number is remembered, so a leg divided into five bays is one number and then one press
per leg. The button says the count and its tooltip says what each piece will measure.

A curved segment is refused — splitting an arc is not the same as splitting its chord — and
it says which one.

That segment list had a bug worth naming: the inspector body is a grid, and a grid track
sized `auto` gives a **scroll container** nothing to size against, so the list was drawing
as a 2px line with its rows laid out inside a box that had no height. On any inspector
narrow enough to matter it was simply invisible. It is wrapped in a plain block now, which
gives the track something ordinary to measure; the scroller inside still caps a long run at
its own height.

## Live sync

Two devices, one takeoff: draw on the iPad and watch it land on the computer, and the
other way round.

**What it is, and what it cannot be.** LineWork is one file with no server behind it — it
is served as static bytes and everything else happens in the browser. Live sync therefore
cannot go through anything of ours, because there is nothing of ours for it to go through.
What is left is a direct connection between the two devices, and the one thing that cannot
do by itself is introduce the peers to each other. That introduction is the pairing code:
it is what a server would normally carry, handed over once by whatever you already use to
send a link between your own two machines.

So: **one code out, one code back**, and after that the two devices talk to each other and
to nothing else. Nothing about the job leaves them, no account is involved, and it keeps
working with the internet unplugged as long as both are on the same network.

That is the version that needs nobody's server, and it stays. If you are willing to run
one small thing of your own, *[Seamless pairing](#seamless-pairing)* below reduces the
whole of the above to **six characters, once, ever** — and after that the two devices find
each other by themselves.

- **Pairing** — *Live › Invite a device* makes an invitation and draws it as a **QR code**.
  Point the iPad's camera at the screen; it offers to open the link, and that is the whole
  of the first half. Sending the link some other way — AirDrop, message, mail — does the
  same thing. Opening it there shows a reply code; copy that back and paste it.
- **The code has to point somewhere both devices can reach.** A QR carries the address this
  copy is open at, so `localhost` or a `file://` produces a code that scans and finds
  nothing. The panel says so when that is the case.
- **What crosses** — the whole job first (takeoff, drawings, pinned photos), then only what
  changed. Moving one markup sends that markup, not the file.
- **Who wins** — records are matched by id and the later write wins. One person drawing
  while the other watches is exact. Two people editing the same run at the same instant is
  not, and it does not pretend otherwise.
- **If it will not connect** — the two devices have to be able to see each other. A guest
  or *client isolation* Wi-Fi is the usual reason two machines in the same room cannot.
  Settings › Files has a switch for a public STUN server for reaching a device on another
  network; that is the only part of this that talks to anybody else, it sees that a
  connection is being made and nothing about the job, and it is off by default.

### Seamless pairing

Copying a code across is a fine thing to do once and a tedious thing to do every morning.
The reason it has to happen at all is narrow: WebRTC opens a direct connection between two
devices, but it cannot *start* one — each side has to be told where the other is before
there is any channel to tell it over. Everything else about live sync already needs nobody.

So the smallest possible thing that solves exactly that, and nothing else: a **rendezvous**.
It is a numbered pigeonhole. Each device leaves its half of the handshake in it, takes the
other's, and the note is deleted on the way out. That is the entire server:

```
POST /?room=ABC123&side=a    leave a note
GET  /?room=ABC123&side=b    take the other one, once
```

What goes through it is an SDP offer or answer — network addresses and a certificate
fingerprint, a few hundred bytes, worthless the moment the connection is up. **The job
never touches it.** The drawings, the takeoff and every change still go straight between
the two devices, exactly as they did before.

Two implementations ship, because the objection to a server is either *I don't want to
deploy anything* or *I don't want to depend on anybody*, and they have opposite answers:

- **`rendezvous/worker.js`** — a Cloudflare Worker, about forty lines. `wrangler deploy`
  and you have a URL. Pairing is two small requests and a few polls per session, so the
  free tier covers a firm doing this all day roughly a hundred thousand times over.
- **`rendezvous/node.js`** — the same logic on `node:http`, for a machine in the office
  that is already on. `node rendezvous/node.js 8787`, and both devices point at it.

Either way the URL goes into *Settings › Files › Rendezvous* on both devices. Notes live
five minutes and are held **in memory, never written down** — long enough to walk across
the room with an iPad, short enough that a code read over somebody's shoulder is dead
before they can type it. A room name that is not `[A-Za-z0-9_-]{4,80}` is refused, and so
is any body over 8 KB, which a handshake never is.

**Then the part that makes it seamless.** Once two devices have met, each stores the pairing
in `localStorage`: a **24-character random room** — not the six characters, which have
already expired — plus the other's device id and what it calls itself. Next launch, both
post to that room and connect with nothing asked of anyone. The six characters happen once
in the life of the pair.

Which side of the pigeonhole each device uses has to be agreed before there is any way to
agree on anything. Opening a room settles it by fiat (the opener takes `a`); a remembered
pair settles it by comparing the two device ids, so both machines reach the same answer
independently and neither sits waiting for a peer that is also waiting. The room itself is
named by whichever device opened it and announced over the data channel once it is up,
rather than invented on both sides — two devices each inventing a private room is two
devices that never meet again.

Reconnecting is careful about not destroying anything. Handing the whole job over is right
when a fresh iPad meets a computer with a job on it, and wrong when both have work: the
join only auto-sends to an *empty* peer, and where both are occupied the panel says so and
offers a button rather than picking a winner.

None of this is compulsory. Leave the rendezvous empty and the panel does not mention a
code it cannot make; the QR path is what you get, unchanged.

The suite runs the real `rendezvous/node.js` and two real browser contexts against it, and
covers the pigeonhole itself (leave, collect, read-once, a bad room, an oversize body), the
six characters appearing at 44px, the iPad joining by typing them, the job and its drawing
crossing, **both devices storing the same** 24-character room, a page reload not losing it,
reconnecting with no code and no tapping, a run drawn on the iPad arriving over the
reconnected link, forgetting, the panel with no rendezvous set, and a rendezvous that is
not there reporting rather than hanging.

### The QR encoder

Written here rather than vendored — it is a page of arithmetic and the app is one file.
Byte mode, error level L, automatic version and mask. A pairing link is about 620
characters, which lands at **version 17: 85×85 modules**, drawn as an SVG at four pixels a
module with `shape-rendering: crispEdges`, because a blurred module is one a camera has to
guess at.

It is checked **module for module against an independent encoder** — sixteen inputs from
one character to 2400, across all eight masks and fourteen versions, every module
identical. Three of those matrices are kept as fixtures so the arithmetic cannot drift.
Two real bugs came out of that comparison, both invisible without it: the format
information's two copies run in *opposite* directions around the code and I had them
mirrored, and the second copy puts seven bits up the left side rather than eight — an
eighth lands on the dark module, which is not a format bit.

The suite pairs two real browser contexts, hands the codes across programmatically and
checks the lot: the code compresses and unpacks, both ends go live, the job and its drawing
cross, a run drawn on one appears on the other with its shape and colour and *on the
sheet*, changes and deletions travel both ways, a diff of nothing sends nothing, hanging up
is noticed at the far end, and a code that is not one is refused with a reason.

## Undo, with somebody else drawing

Undo restores a snapshot of the whole job. That is right when you are working
alone and wrong the moment you are not: the snapshot was taken before your
colleague drew their last three runs, so putting it back takes those off their
screen as well as yours. They did not ask for that and would have no way of
knowing what happened.

So every undo step now records **how much of the other device's work it had
seen** — a counter bumped each time a delta lands — and restoring one reinstates
everything that has arrived since. Your change is undone; theirs is left where it
is, and the toast says how many of their changes it stepped around, so nothing is
quietly different from what you expected.

The same reasoning runs the other way: a record *they deleted* after your
snapshot stays deleted rather than reappearing on both screens. And a record you
edit yourself stops counting as theirs, whoever originally drew it.

Nothing changes when you are alone: with no connection the map is empty, the
step counter is zero, and undo is undo. Hanging up clears both.

`undosync.mjs` pairs two real browsers and plays out the sequence that motivates
it — I draw, you draw two, I undo — then checks my run is gone from *both*
screens and both of yours are still on both. Then it checks the deletion case,
that redo does not revert them either, and that a single device is unaffected.

## What changed between two revisions

Comparing two renders of a sheet and clustering the changed blocks was already
here. Two things were missing, and both are about not misleading the reader.

**Which way the change went.** A page is dark ink on light paper, so a patch that
got *darker* gained ink and one that got *lighter* lost it. Each block votes, and
each cluster is called **added**, **removed** or **changed** — clouded green, red
and amber, and labelled.

The third category is the one that earns its keep. A detail that *moved* gains
and loses ink in about equal measure, and a cluster where the weaker direction is
more than a quarter of the stronger is reported as redrawn rather than as either
half of itself. Calling a moved detail "added" sends somebody looking for
something that is not there; calling it "removed" tells them to stop looking for
something that is.

**Nothing is clouded until it is accepted.** Clouding everything a diff finds is
right when the diff is right and wrong the rest of the time — a rescanned sheet,
a shifted titleblock or a new plot date each produce areas nobody wants clouded,
and once they are on the drawing they come off one at a time. So every change is
offered first, with what happened, how big it is, and **which runs are inside it**,
that last being what actually decides whether an area matters. Everything starts
ticked, because on a clean compare the answer is usually yes; cancelling leaves
the sheet untouched. *Cloud everything* and *cloud nothing* are both still there.

`revdiff.mjs` works against two revisions of one sheet with the deltas planted:
a block only on the old one, a block only on the new one, and a detail moved.
It checks each is called the right thing, that the clouds carry the label and the
colour and sit over the right part of the sheet, that turning one down in the
review leaves it out, that nothing is drawn until the review finishes, that
cancelling draws nothing at all, that a run inside a changed area is reported and
one clear of them is not, and that a sheet compared with itself finds nothing.

## What leaves the app

Three documents for three different people, and deliberately not one document
with three stylesheets.

**The bench ticket** (*Pieces › Bench ticket*). One page per zone, in the order
the pieces come off the run: the mark that goes on the tape, the cut length, the
item, the order code, and a **box to tick** — the way anybody keeps their place
in forty cuts is by ticking them off. Fourteen point body with the mark and the
length at eighteen, so it reads from arm's length on a bench under a saw; black
on white, because a shop printer is not a colour one. Each zone starts a fresh
page so a ticket can be torn off and handed over alone, and each has somewhere to
sign it off. **No cost anywhere on it** — that is the office's document.

Lengths go either as `16'-8"`, which is what somebody sets a stop to, or as
decimal feet, which is what a spreadsheet wants. The ticket offers both rather
than choosing for a shop it cannot see.

**Site photos in the report.** A photo pinned on the plan now carries what it is
a photograph *of* — the tag of the nearest run and the sheet it was taken on.
"Photo 4" tells a reader nothing; "COVE Z2, A-101" does.

Near is a real question and the answer is stated rather than fudged: **within a
foot and a half of real distance**, measured in the sheet's own space so it does
not depend on where the view is scrolled. A photo dropped in the middle of a room
belongs to the room, not to the cove twenty feet away, and it says so by carrying
no tag rather than the wrong one. Pictures are embedded as data URIs, so the
report stays one file that prints from a site laptop, and one that is not in this
browser's store says so rather than printing a broken frame.

`bench.mjs` parses both documents rather than eyeballing them: one section per
zone with a page break between, a row and a tick box and a mark per piece, a
signature block on each, no currency symbol anywhere, the type sizes read out of
the stylesheet, both length formats, and — for the report — that the near photo
gets a tag, the far one does not, and nothing on the page points off it.

## Taking it off the drawing

The drawing already knows where its walls are. Two things read them rather than
asking you to.

**Snapping to a wall, not only to a corner.** Snap has always taken the corners
a drawing is made of, straight out of the PDF's operator list. But a wall is a
*line*, and the place a cove starts is very often part way along one where there
is no vertex at all — which was a click that snapped to nothing. The edges are
kept now as well as their endpoints, in their own spatial grid, and the nearest
point *on* an edge is offered when no corner is near enough. A corner still wins
where there is one: a corner is a decision somebody drew, a point on an edge is
only the nearest place to stand. The cursor distinguishes them — a square for a
corner, a diamond for a place on a wall — because they are different promises.

**Fill a room.** Click the open floor and the room's walls come off the drawing
as a region, with its area, perimeter and cove run.

Raster, not vector, and deliberately. Walls are drawn as two parallel lines with
door openings punched through them and hatching between, and no amount of
walking the operator list makes a reliable loop out of that. Ink is ink: what a
person sees as a closed room fills as one. So the page is rendered, the paper
inside the walls is scanline-flooded from the point clicked, the boundary of
what filled is walked with a marching-squares trace, and the result is simplified
with the same RDP the freehand tool uses. Corners are then pulled onto real
vector geometry where there is any — so the answer is as exact as a traced one,
and a rectangular room comes back as **four corners, not four hundred**.

What does not fill is exactly the case that needed a person anyway, and it says
so: a wall with a gap lets the flood run off across the sheet, which is caught by
an area cap and reported as a gap rather than handed back as the outline of the
whole building. Clicking a line instead of the floor says that too.

The boundary lands on the inside face of the wall, which is where a cove runs.

`room.mjs` measures both against a plan drawn on purpose — `ROOMS.pdf`, walls at
coordinates the test knows — so the traced corners are checked against arithmetic
rather than a screenshot. The room clicked comes back at x 72..306 and y 510..720
against walls drawn at exactly those, 152 sq ft and 49 ft round.

Writing that test in screen coordinates is what caught the tracer converting the
raster without flipping it: a raster counts down the page and a PDF counts up it,
and markups are kept in the PDF's space. The corners were exact and at the mirror
of the room that was clicked — a wrong answer wearing the shape of a right one.
There is now an assertion that the point you clicked is inside the room you got.

## How much of it shows

Thirty tools, seven takeoff tabs and eight pages of settings is the right amount
for somebody doing this all day, and far too much for somebody who wants the
length of a cove. So the app has a size.

**Simple** is the smallest thing that can still do a takeoff — open a drawing,
set the scale, measure a run, read the total, export it. Five tools, one takeoff
tab, nothing else. Everything past that is a **named piece you add**:

| Piece | What arrives with it |
| --- | --- |
| Curves, angles and counting | arc, ellipse, radius, angle, count, find-a-symbol |
| Marking up the drawing | ink, arrow, highlight, text, callouts, boxes, eraser, write-a-sum |
| Products, cut list and cost | the Library, Cut list & BOM and Pieces tabs, and Estimating settings |
| Drivers, circuits and wire | feed, splice, home run, driver, and the Power tab |
| Zones, revisions, photos and issues | spaces, detail scales, legends, clouds, photos, links, the Markups table and Issues |

The point of the grouping is that **nobody should have to know that a driver is a
tool and Power is a tab and voltage drop is a settings page in order to get all
three**. You ask for drivers and circuits; you get the lot.

**A piece is never hidden while there is anything in it.** That is the rule the
whole thing rests on: a pane you cannot see is work you cannot find, so a job
that already has a driver on it shows Power whatever the size says — and the
list says *why*, rather than displaying an off switch beside a thing that is
plainly on. Putting a piece away is not a deletion either; turn it back on and
the work is where it was.

**Two switches, deliberately.** The size is coarse — whole pieces, for somebody
who does not want to know what a tool is. Settings › Tools stays fine-grained on
top of it, for somebody who has a piece and wants one of its tools off the bar.
The two compose: add Power, keep the home-run tool off the toolbar.

The size travels with the job, so a simple job opens simple on the iPad too, and
a preset can carry it to every job an office starts. ⌘K finds *Simple*, *Show
everything*, and each piece by name.

`lvl.mjs` checks the shrink and what survives it, that putting away the tab you
were looking at lands you somewhere rather than on a blank rail, that adding one
piece does not drag in the others, that a job with a driver keeps Power with the
switch reading on and explaining itself, that the coarse and fine switches
compose, that the size round-trips through a save, and that the simple toolbar
fits across an iPad mini in portrait.

## Four silent ones

A standing sweep catches what it was written to catch. These four came out of
pointing an adversarial probe at entry points nobody drives angrily — degenerate
geometry, lengths typed by a person, a file that has been got at — and every one
of them was silent, which is what made them worth the trip.

- **A page range with spaces in it.** `parseRange` split on whitespace before it
  parsed the dash, so `1 - 3` came out as pages 1 and 3 — page 2 quietly missing.
  That feeds *Set a scale on some pages*, where a skipped page means every
  measurement on that page is wrong and nothing says so. The joins are closed up
  first now, and `1 - 3`, `1–3`, `1—3` and `1 to 3` all mean the same three pages.
- **A project file with a hole in it.** A `null` where a record should be — a
  truncated file, a bad merge, a hand edit — hit a pass that reads fields straight
  off each markup, and the whole job failed to open. Non-records are dropped once,
  at the top, rather than guarded at each of the twenty places that walk those
  lists; guarding twenty places is how one gets missed, and the miss costs the job
  rather than the one bad record.
- **An export that lost its markups and reported success.** `sheetBitmap` caught a
  failure to rasterise the overlay and exported the bare sheet — reasonable — but
  said nothing, so a takeoff could be issued as a clean drawing with none of the
  takeoff on it. The loss is carried back to the caller now and named page by page.
- **A hello that goes missing.** Live sync hands the job over on the strength of
  the hello, so one that is lost leaves a connection that reports itself live and
  does nothing: an unnamed peer, no takeoff, no error. It is now repeated until
  acknowledged — *acknowledged*, not answered, which was the subtle half: hearing
  who they are says nothing about whether they heard who I am, and stopping on
  that is exactly how the side whose hello was lost fell quiet. A hello carries
  whether its sender has heard one, and each side hails until a hello comes back
  saying yes. The test eats the tablet's first two hellos on the way out and
  expects the pairing to recover by itself, with the job handed over once.

## The sweep

`ui` is a standing sweep rather than a feature test: six window sizes — three laptops and
three iPads — opening every tool, every settings tab, every takeoff pane, the manual and
both rails, then asking what happened. Anything thrown, anything drawn off the window,
anything sitting on top of anything else, any target too small for a finger, any field
small enough to make iOS zoom the page. It found four faults on its first run:

- **The header clipped on a 1280px laptop** — which is most laptops. Help, the takeoff
  toggle and the swap button were off the right-hand edge and the page was 1429px wide in
  1280. It wraps at every width now, not only on a tablet.
- **Settings › Tools scrolled sideways** at every window size: a dozen tool chips beside a
  label cannot shrink. The chips get the width and go under the label.
- **Ten fields were under 16px on a tablet.** iOS Safari zooms the whole page when it
  focuses one of those and does not zoom back — tap a search box and the drawing is
  suddenly 30% bigger and off to one side. Two carried the size in a style attribute, the
  rest in classes and their own rules, so it is now stated once, last and hard, and any
  new field is covered by the same line.
- **The colour dots were 26px.** They get used all day; they are 36px on a tablet.

## The window on a tablet

Every tool and every control is **on screen**, on every iPad, both ways up, whichever
arrangement of the workspace you are in. That was not true before: the tool strip held
itself to one row and scrolled sideways, with a fade at the right-hand edge as the only
hint there was more, and on a real iPad that put two thirds of it past the edge — the
five colours, the line weight, undo and redo, Snap, Ruler, Calc and the scale. The header
did the same thing below about 1170px, taking Save, Project, Settings and Help with it.
And a workspace that stands the tools up the side pinned the rail to 68px, which is one
column of finger-sized buttons and left eleven of thirty tools below the screen.

- The **tool strip wraps** to as many rows as it takes. Rows cost height; a tool you
  cannot find costs the job.
- The **side rail wraps** into as many columns as it takes, and takes the width they came
  to — measured, because a wrapped column of flex items does not report the width of its
  own columns to the grid track it sits in.
- The **header wraps** rather than scrolling its buttons out of reach.
- **⋯** opens every tool written out by name, in its groups, with its keyboard letter —
  the answer to *where has that tool gone*, and useful even when nothing is hidden. On a
  desktop it is in ⌘K.
- The **zoom, fit and page strip** is back in the toolbar instead of floating over the
  sheet. It was pinned 8px under a 55px toolbar and sat on top of a 148px one; one fewer
  thing over the drawing is worth having anyway. A side rail is still the wrong shape for
  it, and there it floats — below the calibrate bar, not on top of its buttons.
- The **takeoff drawer** takes a share of the screen rather than a fixed 320px slab, and
  gives way before the sheet does. With it open on an 11-inch iPad the sheet used to come
  out 71px tall.

Twenty layouts — five iPads, both orientations, tools on top or down the side, takeoff at
the side or in a drawer — are checked on every run: nothing off the screen, and no strip
of controls hiding its own contents behind a scroll. The tightest of the twenty is a small
iPad with the takeoff drawer open *and* the calibrate banner still up, which leaves about
110px of sheet; calibrating dismisses the banner and gives it back.

**To shorten the strip**, Settings › Tools turns off what this job does not need. That is
the intended lever, and it is remembered with the workspace.

### Icons, not characters

Five buttons on the bar used to lead with a character rather than a drawing: `▭` for the
ruler, `🖩` for the calculator, `⊹` for snapping, `✋` and `⊕` for what a finger and a
wheel do. A character is at the mercy of whatever font the device has. **iOS has no glyph
for the pocket calculator at all**, so that button drew an empty box, and the white
rectangle drew as exactly that — an empty rectangle, which in a square button reads as a
button that has failed. Down the side rail, where the word is dropped to keep the columns
narrow, those two were all you got.

They are drawn now, like every other button, and they mean the same thing on every device.
The state changes touch the **word only** — setting a button's text takes its icon with it,
which is how the ruler lost its own label the first time round. The page arrows went the
same way. A check on every run asserts that nothing on the bar is a bare symbol: every
control is a drawn icon or a word made of letters.

## Measurements in the line

A measurement is **the number alone**, turned to the direction of the run and sitting
in it, with a gap the colour of the paper so the line breaks around it — the way a
drafted dimension has always been drawn. No box, no fill, no border. On a plan with
thirty runs on it that is the difference between reading the drawing and reading the
labels.

- A **single measured span** carries its number in the middle of itself. At the end it
  would only sit on whatever was being measured up to.
- A **poly** labels each leg on that leg, and keeps the run total at the far end, clear
  of them.
- Where a number **will not fit** between two corners it steps just off the run, still
  along it, rather than spilling over the drawing at either end. Always to the same
  side, whichever direction the run was traced in, so a row of short segments does not
  label alternately above and below.
- In the line means **along** the line, so that is the angle it takes — normalised so it
  never reads upside down. *Length label angle* can still force flat.
- A **region's edges** keep their lengths beside them rather than in them: the number
  belongs to a boundary, not to a measured run, and a small room has four of them to fit
  round along with its area and perimeter.

The gap is only as tall as **the line it interrupts** — not as tall as the digits. That is
the difference between breaking a line and covering the drawing, and it is the whole point
of labelling this way. A number that crosses no line breaks nothing and gets the
paper-coloured halo alone.

Placement follows from this. Two labels clash by **what is drawn**, not by the box a
placard would have taken, so a poly's corner no longer throws its two lengths off their
legs. A number that does clash **slides along its own line** first and steps off the run
only when the segment has no clear room left. Anything that ends up away from what it
measures — moved by the layout or by hand — grows a leader back to it. A label is grabbed
over the number itself and nowhere else, so the run stays pickable either side of it.

The gap is white, because a drawing sheet is white: that is what the PDF renders onto in
either theme and every palette, and what it prints as. The stage colour behind the page
is a different thing and deliberately not used.

Settings › Labels › **Measurement labels** offers the old placard back — filled, bordered
and unmissable — for anyone who wants it.

## Images as sheets

A **PNG, JPEG or WebP** opens as a one-page sheet and measures the same way a PDF
does — for a photograph of a marked-up print, a screenshot of a plan, or a drawing
that only ever arrived as a picture. Markups, runs, spaces, the cut list and the
report all work, because an image is handed to the rest of the app **dressed as the
one-page document a PDF would have been**: the same `getPage`, the same viewport, the
same render call. Nothing downstream knows the difference.

What an image cannot give you is a titleblock, geometry to snap to, or a plotted
size — there is no text layer, no vectors to find corners in, and no paper size to
check a stated scale against. So it says all three instead of guessing: the sheet
reads *no text layer*, the snap button says *an image has no geometry to snap to*,
and the scale dialog tells you to calibrate against a dimension with the ruler rather
than trusting a scale off the titleblock. One pixel counts as one point — arbitrary,
and it stops mattering the moment it is calibrated. The bytes are kept in this browser
like a PDF's, so it reopens without re-importing.

## Reading the drawings

Imported sheets have their number and name read from the PDF's text layer, so a
set arrives already indexed. This is the text layer and not OCR: a scanned
drawing says "no text layer" rather than inventing a number.

Drawings are kept in this browser (IndexedDB), so reopening a job needs no
re-import. The project file is still the portable copy — it never carries the
PDFs — and the store can be turned off, sized and cleared in Settings.

## Workspaces

How the window is arranged, under one name. **Settings › View** carries the rows —
Workspace, Appearance, Tools, Takeoff panel, Density — and **◫** in the titleblock
or `⌘⇧W` opens the manager.

Three palettes, each with a light and a dark:

- **Bench** — the warm drafting palette this app has always had
- **Paper** — the sheet is white, so the app is too; one ink accent
- **Slate** — neutral, so the amber is the only warm thing on screen

And two layout switches: tools **across the top** or standing up as a **60 px rail**
down the side, and the takeoff **beside the sheet** or as a **full-width drawer**
under it, where a run table can be read across. The drawer folds to its tab bar.

The arrangement travels **in the project**, so a job reopens the way it was left.
Named workspaces live **beside** the projects, being an office preference rather than
job data, and export as a `.linework-view.json` — which holds only how the window is
arranged, never sheets, markups or runs, so applying one can never change a takeoff.

Light and dark stay owned by the app: the Appearance rows drive the same `☀︎` button,
so the glyph, the body class and the setting cannot disagree.

### Your own colours

Beside the three palettes is **Custom**: start from whichever is on screen and change
what you like, one variable at a time — the window, the surfaces, the lines, the
text, the accent, and the four colours that mean something (measurement, link,
problem, good). Editing **writes straight to the app**, so what you see while you drag
is the thing itself rather than a swatch, and **Cancel puts back exactly what was
there**.

Light and dark keep **separate sets**, so a palette made in the dark does not follow
you into the light.

A **profile** is the office standard as one file — settings, rates, tool visibility
and palettes, and now the workspace too, custom colours included. Save it from
Settings › Files, hand it over, and loading it puts the arrangement on screen rather
than only into the project.

A hand-edited file cannot put anything but a colour into a colour: a value that is
not a hex, a variable the app does not have, a mode that does not exist — all dropped
rather than written.

The palettes live in `ui/linework-ui.css` and only re-point the variables the main
stylesheet already uses; `ui/linework-ui.js` sets the attributes that choose between
them and defines no colour of its own. Both are additive — with them absent the app
is exactly what it was.

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

## Typing to find a product

The LED product, channel and supply boxes are **typed into, not scrolled** — on a
run, in **batch edit**, and in the **saved-spec editor**.
A library with a manufacturer's catalogue in it is too long to browse, so the same
matching as the library search applies: a wattage, a colour temperature, a connector
code or a part number finds a product, not only its name. Arrow keys move, Enter
picks, Escape leaves the run alone.

**Browsing shows what fits; typing searches everything.** A product asked for by
name has to be findable, so one the cutsheets do not list still appears — put last,
under a heading saying so, with the reason attached. An approved run keeps its plain
read-only boxes.

Changing the product in **batch edit** or in the **spec editor** gets the same check
a run gets: options the new product is not offered with are left unset and named. A
spec that cannot be ordered matters more than a run that cannot, because it goes on
to make more of them.

## What fits what

The three choices on a run are not independent, and the sheets say so: a strip lists
the extrusions it is made to sit in, an extrusion lists the strip families that fit
it, a driver lists the LEDs it runs. Reading a cutsheet takes those lists too, and
then the three lists **narrow each other**.

On a run, each list is grouped into **what fits**, **what no sheet mentions either
way**, and **what is listed as not fitting**. Only the first two are offered, with a
count of what is hidden and a button to show everything.

Three rules keep it honest:

- **Nothing already chosen is ever hidden.** A saved job must not change under a
  compatibility list that arrived afterwards, so the current choice stays in the
  list — labelled with why it is doubtful — and the run reports the pairing rather
  than only styling it.
- **Silence is not a refusal.** Where neither sheet states anything, the pairing is
  reported as unchecked rather than wrong. An incomplete list must never make a real
  product unreachable.
- **`SW` does not match `SW-HE`.** A looser match would make every family fit
  everything, which is worse than not filtering at all.

**Voltage is not a compatibility list, it is electricity**: a 24V supply on a 12V
product is called out outright, and never offered as fitting.

**Changing the product** clears the options the new one is not offered with — a
colour temperature it is not made in, a connector it does not have, a build it does
not come in — and names what it dropped, rather than silently swapping in something
else.

## Where the library lives, and saved fixture specs

Products are saved **in the project**. That is what makes a job self-contained: it
carries what it was priced against, and nobody can change that underneath it later.
The cost is that reading a folder of cutsheets into one job leaves the next one back
on the seed — so **Use for new projects** keeps a copy beside your projects, and
every new project starts from it. It never touches a project already made, including
the one in front of you. A library file is still the portable copy, for sharing or
for loading into a job already under way.

**Saved fixture specs** are a product plus every option it is ordered with: build,
colour temperature, a connector at each end, wire colour and type, dimming, and
optionally the channel and supply. That combination is what a schedule calls a
fixture type, and it should be chosen once rather than on every run.

- **Save these options** on a run makes a spec out of what is already set
- picking a spec on another run sets the lot in one go — a channel or supply left
  blank on the spec leaves the run's own alone
- the library row shows **the part number it produces**, with only the length left
  to fill, and how many runs use it
- including **how many have changed since**, because a run that has drifted from its
  spec should say so rather than look identical to one that has not
- they travel in the project, in a library file, and into the default

**Search** is one box over the whole library, and it matches more than the name:
wattage, colour temperature, connector codes, the order-code sample, the cutsheet
revision, and whether something is still unverified. Each heading then reads
"showing of total".

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
