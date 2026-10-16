---
name: Browser workflow checks
description: How to verify interactive local web-app flows in this workspace without installing a browser automation package.
---

When interactive browser testing is needed and no browser automation dependency is present, the shell environment can drive the installed headless Chromium through its Chrome DevTools Protocol using Node's built-in WebSocket.

**Why:** This provides real browser interaction checks without modifying project dependencies.

**How to apply:** Check that `/repl/tools/bin/chromium` and Node's global `WebSocket` are available, launch Chromium with an isolated temporary user-data directory and remote debugging enabled, then drive the app through CDP.
