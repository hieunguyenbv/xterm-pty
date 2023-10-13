#!/bin/bash

set -ex

emcc \
	-Os \
	-s ASYNCIFY \
	-s EXPORT_ES6 \
	-s ENVIRONMENT=web \
	-s RETAIN_COMPILER_SETTINGS \
	--js-library ../../emscripten-pty.js \
	-o ../static/example-core.js \
	example.c
