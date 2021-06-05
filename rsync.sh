#!/bin/sh
git add .
git commit -m "`git log --pretty='%B' |head -n 1`"
git push
