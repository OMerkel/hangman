#!/usr/bin/env bash
mkdir -p bin
pushd bin
cmake ../src
make DESTDIR=. install
./hangman
popd
