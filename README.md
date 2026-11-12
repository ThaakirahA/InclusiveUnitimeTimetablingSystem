# Inclusive UniTime - accessible timetabling prototype
Web Technology capstone (Postgraduate Diploma in ICT). A front-end prototype with a simulated service layer; it is not connected to the real UniTime system.

## Demo accounts (sample data only)
Student `S1001 / student123` (Thaakirah Agherdien) | Student `S1002 / student456` (Thandi) | Staff `L2001 / staff123` (Dr Hendricks)

## Run it
No build step. Serve the folder and open it (React is loaded from a pinned CDN, so internet is needed):
```
python3 -m http.server 8080      # then open http://localhost:8080
```
Optional single-file build: `python3 tools/build_single.py` -> `dist/inclusive-unitime.html`.

## Run the tests
Requires Node 18+ (developed on Node 22).
```
npm install
npm test
```
`tests/logic.test.js` (unit), `tests/api.test.js` (integration), `tests/ui.test.js` (system, jsdom + axe-core). jsdom is a DOM simulation, not a browser; colour contrast and layout need the manual tests in `docs/manual-test-log.md`.

## Structure and mapping to the Design Phase
| Design tier (HLD 3.1) | Files |
|---|---|
| Data layer (mock JSON, Fig 4/5) | `js/data.js` |
| Application logic layer (3.2.2) | `js/logic.js` (filtering, collision, visibility, time maths) |
| API / service layer (3.2.3, 7.1.2) | `js/api.js` (simulated endpoints, role + collision checks) |
| Accessibility & personalisation module (3.2.1) | `js/preferences.js`, plus `data-*` attributes and CSS in `css/styles.css` |
| Presentation layer (3.2.3) | `js/components/*.js` (login, student, staff, settings, common, app shell) |
Scripts are classic `<script>` files loaded in dependency order (see `index.html`); no bundler.

## Requirement IDs used in tests
FR01 personalised timetable | FR02 filtering | FR03 notifications | FR04 staff update | FR05 accessibility settings | NFR-01 responsive | NFR-02 keyboard/focus | NFR-03 contrast and text size | NFR-04 screen reader/semantics | NFR-05 consistent navigation

## Docs
`docs/test-output.txt` (real run output) | `docs/DEFECT-LOG.md` | `docs/manual-test-log.md` (to complete)

## Known limitations
Simulated data and API (localStorage, no HTTP backend); sign-in is a demo only; read/unread state is shared between demo students; Rooms & Venues, Reports, Campus Map and Module Details screens from the design are not built.

## Suggested version-control workflow
Work on short-lived branches (`feature/filters`, `fix/heading-order`), commit small and often with messages such as `fix: add service-layer collision check (DEF-006)`, and tag the submission `v1.0-implementation`.


## Exam timetable extension (demo)
- Student Exams navigation shows only their assigned PGDip ICT stream; S1001 is Web Technology and S1002 is Software Development.
- Staff can add, edit and delete exams for both streams; date/time and venue or same-stream overlaps are checked. Changes create stream-targeted in-app notifications, visible after refresh/login (same browser).
- Class and exam timetable downloads are **PDF only**, using jsPDF loaded from a CDN; downloads include a DEMO University of Tech stamp, timetable type and generated date. Internet is needed for the CDN.
- Exam PDF email handoff offers optional speech recognition where browser-supported and a typed fallback. It opens the device email application with a prefilled message; **the user must manually attach the downloaded PDF and send**. No email is transmitted by this prototype.
- All exam data is fictional and browser-local. The demo does not implement a real university backend or multi-device real-time sync.


## Presentation refinements
The demonstration student S1001 is Thaakirah Agherdien and staff L2001 is Dr Hendricks. Timetable PDFs have a square fictional University of Tech demo stamp and a modern layout. The staff exam date field uses change events and the API normalises ISO-style dates before validation.
