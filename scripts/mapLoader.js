const { writeFile } = require('fs');
const AWS = require('aws-sdk');
let map;

if (process.argv.length > 2) {
  map = require(process.argv[2]);
} else {
  console.log('No maps were uploaded due to insufficient arguments \nPlease run the command with the following command: npm run upload:single -- path/to/map');
  process.exit();
}

// Removes all attributes with empty strings from an object.
const clean = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      // If attribute is an object, iterate on all its items and clean them.
      if (obj[key].length) {
        obj[key].forEach(el => clean(el));
      } else {
        clean(obj[key]);
      }
    }

    if (obj[key] === '') {
      delete obj[key];
    }
  });

  return obj;
};

// Load AWS configuration file.
AWS.config.update({
  region: 'us-west-1',
  accessKeyId: process.env.DYNAMO_UPDATE_KEY_ID,
  secretAccessKey: process.env.DYNAMO_UPDATE_SECRET_ACCESS_KEY,
});
const docClient = new AWS.DynamoDB.DocumentClient();

const parsedMap = Object.assign({}, map);

// Set the map key for search. If there's a tag use that,
// otherwise use the leftmost topic on the title.
if (map.tag) {
  parsedMap.key = map.tag;
} else {
  const splitTitle = map.title.split(' - ');
  parsedMap.key = splitTitle[splitTitle.length - 1];
}

// Convert all spaces in the title with dashes.
parsedMap.title = parsedMap.title.replace('learn anything - ', '').replace(/ /g, '-');

if (parsedMap.title === '') {
  parsedMap.title = 'learn-anything';
}

// Insert map into DB.
docClient.put({
  TableName: 'LA-maps',
  Item: clean(parsedMap),
}, (err) => {
  if (err) {
    console.log(parsedMap);
    throw err;
  }

  console.log(parsedMap.title);
});
