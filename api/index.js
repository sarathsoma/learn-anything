#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const api = require('./api/index');

const app = express();
// const googleTrackingID = process.env.NODE_ENV === 'production' ? 'UA-74470910-2' : '';

// Compress files sent.
app.use(compression({ threshold: 0 }));

// JSON encoded bodies on POST requests.
app.use(bodyParser.json());

// API router.
app.use('/api', api);

// Start the party on port 4000
app.listen(4000, () => {
  console.log('Server started.');
  const envs = [
    'NODE_ENV',
    'DOCKER',
    'MEMCACHED_HOST',
    'DYNAMODB_HOST',
    'ELASTICSEARCH_HOST',
  ];
  envs.forEach(env => console.log(`${env}: ${process.env[env]}`));
});
