#!/bin/sh

npm run compile
node lib/index.js "$@"
