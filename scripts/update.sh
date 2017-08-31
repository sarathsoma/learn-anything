#!/bin/bash

node scripts/parser/index.js maps .
rm -r maps

if [[ -f scripts/.last-update ]]; then
  # Get all maps that changed since last uploaded commit.
  maps=($(
    git diff --name-only $(cat scripts/.last-update) HEAD |
      grep .json |
      grep -v package.json |
      grep -v package-lock.json |
      grep -v scripts/
  ))
else
  # TODO - walk dir and get all maps
  exit
fi

# Loop all maps and upload to ES.
for map in ${maps[@]}; do
  node scripts/updateSingle.js $map
done

# Write hash of last commit
echo $(git rev-parse HEAD) > scripts/.last-update
