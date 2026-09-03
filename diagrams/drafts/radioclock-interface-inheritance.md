# Radio clock interface inheritance

Faithfully restyle `public/attachments/3.8/interface-inheritance/radioclock.gif` without changing its
inheritance topology.

## Composition

- Place `Clock` at the upper right.
- Place `Radio` at middle left and `AlarmClock` at middle right.
- Place `RadioClock` centered below the two middle interfaces.
- Draw inheritance connectors from:
  - `RadioClock` to `Radio`
  - `RadioClock` to `AlarmClock`
  - `AlarmClock` to `Clock`
- Point a hollow triangular arrowhead toward the base interface on every connector.

Do not add an `Object` root or operation lists; those belong to the later figures and surrounding
text on the page.

## Presentation

- Give all four interfaces the same dimensions and neutral component treatment.
- Replace the UML `<<interface>>` line with a compact `INTERFACE` category header.
- Set interface identifiers in the shared monospace style.
- Retain the source's direct vertical and diagonal inheritance paths.
- Keep the hierarchy compact, with center-to-center spacing only large enough for clear arrowheads.
- Use a slightly darker 2-unit inheritance stroke and a strengthened hollow triangle outline so the
  relationships remain clear at the documentation's minimum rendered width.

Original reference: `public/attachments/3.8/interface-inheritance/radioclock.gif`

Canonical SVG: `public/attachments/3.8/interface-inheritance/radioclock.svg`
