#!/bin/sh

mkdir ../temp
curl https://my.mindnode.com/HDaZ1qVM4HpobymKEtzyQ1CWUGsEBVuvsUAEqEhD.json -o ../temp/thank-you.json

react-mindmap-parse ../temp ..

npm run upload:single -- ../thank-you.json
rm -r ../temp ../thank-you.json





