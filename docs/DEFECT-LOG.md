# Defect Log (Inclusive UniTime)
Defects below were found by self-audit, by writing the automated tests, or by axe-core running in jsdom. Browser-based findings (axe DevTools, Lighthouse, keyboard walkthrough, 375px/1280px) must be ADDED by the student after real runs.

| ID | Description | Requirement | Found by | Priority | Status / Resolution |
|---|---|---|---|---|---|
| DEF-001 | All students saw the same timetable; design promises a personalised view | FR01 | Design-vs-prototype review | M | Fixed: per-student enrolments (js/data.js, js/logic.js); verified UT-08, UT-09, IT-02 |
| DEF-002 | App pages had no `h1` (page titles were `h2`) | NFR-03/04 | Self-audit of markup | M | Fixed: page titles now `h1`; verified ST-01 and ST-09 |
| DEF-003 | Timetable accessibility panel was an `aside` (complementary landmark) nested inside `main` | NFR-04 | Self-audit of markup | L | Fixed: now a labelled `section`; ST-09 shows no landmark violations |
| DEF-004 | Unread badge: white text on light red in dark theme, roughly 2.6:1 contrast (calculated by hand) | NFR-03 | Manual contrast calculation | M | Fixed (dark text on that colour). NOT yet machine-verified: re-check in axe DevTools / Lighthouse |
| DEF-005 | Form errors not associated with fields and focus not moved to the invalid field | NFR-02/04 | Self-audit of markup | M | Fixed: `aria-describedby`, `aria-invalid`, focus management; verified ST-02, ST-07 |
| DEF-006 | `api.updateClass` accepted any caller and skipped collision / empty-venue checks (the UI checked, the service did not). Design section 8.3 requires server-side authorisation | FR04, security | Writing IT-03 / IT-04 | H | Fixed: role, collision and venue checks in js/api.js; verified IT-03, IT-04 |
| DEF-007 | Heading levels skipped from `h1` to `h3` on dashboard and timetable (axe `heading-order`, moderate) | NFR-04 | axe-core in jsdom (first full run) | M | Fixed: card headings are `h2` (styled by CSS); ST-09 re-run shows none |

## Open / not yet verified
- Colour contrast in all themes (light, dark, high contrast): not machine-verified.
- Lighthouse accessibility score: not run.
- Keyboard-only walkthrough, visible focus, 375px and 1280px layouts: manual, not run.
- Read/unread state is shared between students in the demo data (prototype limitation, deferred: no real accounts or backend).

## Test-process notes (not application defects)
- First UI test run: 8 failures were caused by the tests not waiting for the mock API delay or for React state to settle. Tests were corrected, not the app.
- The first "dashboard" axe pass was in fact auditing the sign-in page because the test did not wait for the dashboard. That result was discarded and the test fixed.
