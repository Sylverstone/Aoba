#!/bin/sh

echo "$1"

ls
git fetch --all
git checkout prod
git branch
ls