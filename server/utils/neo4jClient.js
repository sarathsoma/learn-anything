const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'password'));


const getSession = (context) => {
  if (context.neo4jSession) {
    return context.neo4jSession;
  }

  context.neo4jSession = driver.session();
  return context.neo4jSession;
};


const parseResponse = response =>
  response.records.reduce((obj, record) => {
    record._fields.forEach((field, index) => {
      const _field = {
        id: `${field.identity.low}|${field.identity.high}`,
        ...field,
      };
      delete _field.identity;

      if (index === 0) {
        obj.rootNode = _field.id;
      }

      // `start` and `end` are present only on relationships.
      if (_field.start && _field.end) {
        _field.start = `${field.start.low}|${field.start.high}`;
        _field.end = `${field.end.low}|${field.end.high}`;
        obj.relationships[_field.id] = _field;
      } else {
        obj.nodes[_field.id] = _field;
      }
    });

    return obj;
  }, { relationships: {}, nodes: {} });


module.exports = {
  getSession,
  parseResponse,
};
