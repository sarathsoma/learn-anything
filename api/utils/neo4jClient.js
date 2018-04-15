const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'password'));

const getSession = (context) => {
  if (context.neo4jSession) {
    return context.neo4jSession;
  }

  // eslint-disable-next-line
  context.neo4jSession = driver.session();
  return context.neo4jSession;
};


const parseResponse = response =>
  response.records.reduce((obj, record) => {
    const newObj = { ...obj };
    record._fields.forEach((field, index) => {
      const newField = {
        id: `${field.identity.low}|${field.identity.high}`,
        ...field,
      };
      delete newField.identity;

      if (index === 0) {
        newObj.rootNode = newField.id;
      }

      // `start` and `end` are present only on relationships.
      if (newField.start && newField.end) {
        newField.start = `${field.start.low}|${field.start.high}`;
        newField.end = `${field.end.low}|${field.end.high}`;
        newObj.relationships[newField.id] = newField;
      } else {
        newObj.nodes[newField.id] = newField;
      }
    });

    return newObj;
  }, { relationships: {}, nodes: {} });


module.exports = {
  getSession,
  parseResponse,
};
