# Button Task Review

**Scope**
- Reviewed button styling changes in [src/index.css](src/index.css#L78-L122)
- Reviewed Playwright setup in [playwright.config.js](playwright.config.js#L1-L28)
- Reviewed button-task tests in [tests/button-task.spec.js](tests/button-task.spec.js)
- Reviewed scripts and test dependency in [package.json](package.json#L7-L26)

**Findings (ordered by severity)**
- Medium: Lint fails due to `module` being undefined in the template helper file, not in the new Playwright files, which blocks a clean lint run in CI. See [templates/skills/webapp-testing/test-helper.js](templates/skills/webapp-testing/test-helper.js#L52).
- Low: UI tests assert specific RGB values and underline style; these checks can be brittle if colors change or if browser rendering differs. This is acceptable for now but may require updates with visual tweaks in [tests/button-task.spec.js](tests/button-task.spec.js).
- Low: The base `.btn:hover` applies to all buttons; variant hover rules override for primary/destructive and toggle buttons, but any new variants could inherit the base hover color unexpectedly in [src/index.css](src/index.css#L86-L122).

**Correctness vs requirements**
- Primary (`.btn__primary`) and destructive (`.btn__danger`) hover styles are distinct and implemented; filter selected state uses underline + border + weight for non-color signaling in [src/index.css](src/index.css#L86-L122).
- Playwright tests cover primary/destructive styling, filter selected/hover states, and add/edit/delete flows in [tests/button-task.spec.js](tests/button-task.spec.js).

**Edge cases**
- No disabled button styling exists; if introduced, hover states may still apply unless disabled-specific rules are added in [src/index.css](src/index.css#L86-L122).
- The edit flow test uses the first textbox found inside the list item; if additional inputs are added to task items, the locator may become ambiguous in [tests/button-task.spec.js](tests/button-task.spec.js).

**Accessibility**
- Selected filter state is not color-only (underline + weight + border) in [src/index.css](src/index.css#L97-L101). Focus-visible styles remain intact.

**Performance/regressions**
- CSS-only changes and a lightweight Playwright suite; no runtime regressions expected. Playwright server reuse is configured to avoid repeated dev server startups in [playwright.config.js](playwright.config.js#L14-L23).

**Lint/build status**
- Lint: failed due to [templates/skills/webapp-testing/test-helper.js](templates/skills/webapp-testing/test-helper.js#L52) referencing `module` without a Node environment.
- Build: passed (`vite build`).

**Test coverage**
- Playwright coverage now exists for button styles and critical flows in [tests/button-task.spec.js](tests/button-task.spec.js).
- No unit tests for CSS states; visual checks rely on Playwright.

**Risks and follow-ups**
- Risk: Lint is red due to a template file; follow up by updating lint config or adding a Node env comment to that file.
- Risk: CSS color assertions may be brittle; follow up by centralizing CSS variables or loosening assertions to class-based checks if design evolves.
