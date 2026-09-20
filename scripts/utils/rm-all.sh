#!/usr/bin/env bash

find . -type d -name node_modules -prune -exec rm -rf {} +
find . -type d \( \
  -name .next -o \
  -name .turbo -o \
  -name .strapi -o \
  -name .cache -o \
  -name dist -o \
  -name build \
\) -prune -exec rm -rf {} +
