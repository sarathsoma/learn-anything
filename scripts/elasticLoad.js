const elasticsearch = require('elasticsearch');
const walkDir = require(`${__dirname}/walkDir`);

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error',
});


const action = process.argv.length > 2 ? process.argv[2] : '';

client.ping({ requestTimeout: 1000 })
  .then(() => {
    switch(action) {
      case 'create-index':
        createIndex();
        break;

      case 'create':
        createAll();
        break;

      case 'delete-index':
        deleteIndex();
        break;

      case 'delete':
        deleteAll();
        break;

      default:
        console.log('Run the command with one of the following arguments [create, delete]');
    }
  })
  .catch((err) => { throw err; });


const deleteIndex = () => {
  client.indices.delete({ index: 'maps' })
    .then(() => {
      console.log('Deleted maps index.');
    })
    .catch((err) => {
      console.error('There was an error deleting the index.');
      console.error(err);
      process.exit();
    });
};

const deleteAll = () => {
  client.deleteByQuery({ index: 'maps', q: '*' })
  .then(() => {
    console.log('Deleted all maps.');
  })
  .catch((err) => {
    console.error('There was an error deleting all maps.');
    console.error(err);
    process.exit();
  });
};

const createIndex = () => {
  const body = {
    mappings: {
      map: {
        properties: { title: { type: 'string', index: 'not_analyzed' } },
      },
    },
  };

  client.indices.create({ index: 'maps', body })
    .then(() => {
      console.log('maps index created.')
    })
    .catch((err) => {
      console.error('There was an erorr creating the index.');
      console.error(err);
      process.exit();
    });
};

const createAll = () => {
  // Resolved promise, will be used to chain all create promises.
  let chain = new Promise(resolve => resolve());
  const visited = [];
  let id = 0;

  const create = (map, i) => new Promise((resolve, reject) => {
    const parsedMap = Object.assign({}, map);
    delete parsedMap.id;

    // Set the map key for search. If there's a tag use that,
    // otherwise use the leftmost topic on the title.
    if (map.tag) {
      parsedMap.key = map.tag;
    } else {
      const splitTitle = map.title.split(' - ');
      parsedMap.key = splitTitle[splitTitle.length - 1];
    }

    const options = {
      id: i,
      index: 'maps',
      type: 'map',
      body: parsedMap,
    };

    client.create(options)
      .then(() => {
        console.log(`${parsedMap.title} added`);
        resolve();
      })
      .catch((err) => {
        console.error(`There was an error with map: ${parsedMap.title}`);
        reject(err);
      });
  });

  walkDir('.', (map) => {
    if (visited.indexOf(map.title) === -1) {
      visited.push(map.title);
      map.id = id;
      id += 1;

      chain = chain
        .then(() => create(map, map.id))
        .catch((err) => {
          console.error(err);
          process.exit();
        });
    }
  });
};
