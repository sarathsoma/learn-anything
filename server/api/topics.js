const express = require('express');
const { cache } = require('../utils/cache');
const Topics = require('../helpers/topics');
const { cacheKeys } = require('../constants.json');
const { logger } = require('../utils/errors');

/*
  // learn section - contains resources about the topic
  /topic

  // explore section - shows the graph starting from the topic
  /topic/explore

  /maps?q
  /maps/id
  /maps/path

  /search/topics?q
  /topics/name/nodes
  /topics/name/resources
*/

const router = express.Router();


// Get adiacent nodes of a given topic.
router.get('/:name/nodes', (req, res) => {
  const name = req.params.name.toLowerCase();

  cache(cacheKeys.topics.getNodes + name, Topics.getNodes(req, name), 0)
    .then(data => res.send(data))
    .catch(err => logger(err, res));
});

// Get resources of a given topic.
router.get('/:name/resources', (req, res) => {
  const name = req.params.name.toLowerCase();

  cache(cacheKeys.topics.getResources + name, Topics.getResources(req, name), 0)
    .then(data => res.send(data))
    .catch(err => logger(err, res));
});


module.exports = router;
