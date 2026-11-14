# Local page-flip bundle

The browser and module bundles contain the same Safari hard-cover workaround.
During a hard-page rotation, Safari explicitly hides the face whose rotation
points away from the viewer; soft pages and other browsers retain the original
rendering behavior. Keep both bundle entry points in sync when changing it.

The regression test is `qa/tests/playwright/e2e/flipbook-hard-cover.spec.ts`.
