#!/usr/bin/env bash

set -euo pipefail

# Remove caches without deleting production runtime artifacts such as
# apps/ui/.next or the Strapi dist directory.
pnpm exec rimraf --glob \
  ".turbo" \
  "apps/**/.turbo" \
  "packages/**/.turbo" \
  "qa/**/.turbo" \
  "apps/**/.next/cache" \
  "apps/**/out" \
  "apps/**/node_modules/.cache" \
  "packages/**/node_modules/.cache" \
  "qa/**/node_modules/.cache"
