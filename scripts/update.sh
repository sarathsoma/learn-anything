#!/bin/bash

# array with all maps URLs
maps=(
  $(grep '"map":' scripts/triggers.json |
  sed -e 's/"map": "\(.\{40\}\)\(#.*\)\?",\?/https:\/\/my\.mindnode\.com\/\1\.json/g')
)

# array with all maps tags
IFS=$'\n'
tags=(
  $(grep '"name":' scripts/triggers.json |
  sed 's/.*"name": "\(.*\)",\?/\1/g')
)
unset IFS

pids=()
mkdir -p tmp_maps

# download maps in background and save PID of each curl process
for i in "${!maps[@]}"; do
  curl -s -o tmp_maps/$i.json ${maps[$i]}
  # pids[$i]=$!
# done

# for i in "${!maps[@]}"; do
  # wait ${pids[$i]}
  echo ${tags[$i]}

  tmp_file=tmp_maps/$i.json

  # get path to map
  map_path=$(
    cat $tmp_file |
    sed 's/.*"title":"\([^"]*\)".*/\1.json/' | # get title
    sed 's/ - /\//g' | # replace divisions between topic with slashes
    sed 's/ /-/g' # replace all spaces with dashes
  )

  # create the folders that will host the map json if
  # they don't already exist
  mkdir -p tmp_maps/$(dirname $map_path)

  # edit file and move it in the right place
  cat $tmp_file |
  sed "s/}$/,\"trigger\": \"${tags[$i]}\"}/" | # add trigger attribute
  sed 's/https:\/\/my\.mindnode\.com\//\/id\//g' > tmp_maps/$map_path

  rm $tmp_file
done

echo 'Parsing maps...'
react-mindmap-parse tmp_file .
rm -r tmp_maps
