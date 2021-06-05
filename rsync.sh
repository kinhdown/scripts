#!/bin/sh
git add .
git commit -m "`cat commit.txt`"
git push
