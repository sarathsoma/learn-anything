const elastic = require('../utils/elasticClient');
const { cache } = require('../utils/cache');
const neo4j = require('../utils/neo4jClient');
const { cacheKeys } = require('../constants.json');
const { APIError } = require('../utils/errors');


// Fuzzy search maps by key name.
async function fuzzySearch(query) {
  // If the query is specified search for that, otherwise return a
  // random document.
  const response = await elastic.client.search({
    index: 'nodes',
    body: query ? elastic.fuzzy('text', query) : elastic.random(),
  });

  // Format results nicely before returning them.
  return response.hits.hits.map((hit) => {
    return {
      name: hit._source.text,
      id: hit._id,
      // TODO - consider adding number of resources here.
    };
  });
}


// In this function we assume that name is lowecase.
async function getNodes(context, name) {
  const session = neo4j.getSession(context);
  let response = await (session.run(`
    MATCH (n1:Topic)-[rel]-(n2:Topic)
    WHERE toLower(n1.name) = {name}
    RETURN n1, rel, n2`,
    { name },
  ));
  response = neo4j.parseResponse(response);

  if (Object.entries(response.nodes).length === 0) {
    throw new APIError(404, 'topic not found');
  }

  const meta = {};
  const rootNode = response.nodes[response.rootNode];
  meta.name = rootNode.properties.name;
  meta.wiki = rootNode.properties.wiki;
  meta.summary = rootNode.properties.summary;

  return {
    meta,
    response,
  };
}

// In this function we assume that name is lowecase.
async function getResources(context, name) {
  const session = neo4j.getSession(context);
  let response = await (session.run(`
    MATCH (n1:Topic)-[rel]-(n2:Resource)
    WHERE toLower(n1.name) = {name}
    RETURN n1, rel, n2`,
    { name },
  ));
  response = neo4j.parseResponse(response);

  if (Object.entries(response.nodes).length === 0) {
    throw new APIError(404, 'topic not found');
  }

  const meta = {};
  Object.values(response.nodes).some((node) => {
    if (node.labels.includes('Topic')) {
      meta.name = node.properties.name;
      meta.wiki = node.properties.wiki;
      meta.summary = node.properties.summary;
      return true;
    }

    return false;
  });

  const resources = Object.values(response.nodes)
    .filter(node => node.labels.includes('Resource'))
    .map(node => ({
      id: node.id,
      ...node.properties,
    }));

  return {
    meta,
    resources,
  };
}

/* a specific map by title.
  async function byTopic(title) {
  // Query elasticsearc for metadata of a map, given its title.
  const metaByTopic = elastic.client.search({
    index: 'nodes',
    body: elastic.get({ title }),
  });

  const key1 = cacheKeys.mapID.byTopic + title.replace(/\s/g, '-');
  const response = await cache(key1, metaByTopic);

  const hits = response.hits.hits;

  // There can't be more than one result, as the limit for this ES query is 1,
  // and in any case, map titles should be unique.
  if (hits.length !== 1) {
    throw new APIError(404, 'map not found');
  }

  // Now that we have the ID, let's retrieve the whole map.
  const key2 = cacheKeys.maps.byID + hits[0]._id;
  return cache(key2, byID(hits[0]._id));
}
*/

module.exports = {
  fuzzySearch,
  getNodes,
  getResources,
};
