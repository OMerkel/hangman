#!/usr/bin/env bash
sort $1 | uniq > tmp.out ; mv tmp.out $1
