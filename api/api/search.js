const express = require('express');
const { cache } = require('../utils/cache');
const Topics = require('../helpers/topics');
const { cacheKeys } = require('../constants.json');
const { logger } = require('../utils/errors');

const router = express.Router();


// Get suggestions for maps or get random map (if no query is specified).
router.get('/topics', (req, res) => {
  const q = req.query.q;

  const key = cacheKeys.topics.search + (q && q.replace(/\s/g, '-'));
  cache(key, Topics.fuzzySearch(q), 5)
    .then(data => res.send(data))
    .catch(err => logger(err, res));
});


module.exports = router;
