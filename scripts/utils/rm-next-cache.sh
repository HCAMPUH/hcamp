#!/usr/bin/env bash

# Remove generated application and build-tool caches.
pnpm exec rimraf --glob \
  "apps/**/.next" \
  "apps/**/out" \
  ".turbo" \
  "apps/**/.turbo" \
  "packages/**/.turbo" \
  "qa/**/.turbo" \
  "apps/**/node_modules/.cache" \
  "packages/**/node_modules/.cache" \
  "qa/**/node_modules/.cache"
