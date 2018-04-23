#!/bin/bash

if [ ! -f ./deps.zip ]; then
  curl -L 'https://www.dropbox.com/s/7a8jpd7vgobiosq/deps.zip?dl=0' -o deps.zip
fi

if [ ! -d ./deps ]; then
  unzip deps.zip
fi

