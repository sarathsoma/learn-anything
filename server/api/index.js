const express = require('express');
const search = require('./search');
const topics = require('./topics');
const votes = require('./votes');
const resources = require('./resources');
const { logger } = require('../utils/errors');

// Group all API routers here, so we can import and use them with just
// one router on the server/index.js file.
const router = express.Router();

// neo4jSessionCleanup
router.use((req, res, next) => {
  res.on('finish', () => {
    if(req.neo4jSession) {
      req.neo4jSession.close();
      delete req.neo4jSession;
    }
  });
  next();
});

router.use('/search', search);
router.use('/topics', topics);
router.use('/votes', votes);
router.use('/resources', resources);

// Handle any error inside the endpoints.
router.use((err, req, res, next) => logger(err, res));


module.exports = router;
