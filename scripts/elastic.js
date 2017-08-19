const elasticsearch = require('elasticsearch');
const walkDir = require(`${__dirname}/walkDir`);

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error',
});

const action = process.argv[2];

// Create index to store all maps
const createIndex = () => {
  const body = {
    settings: {
      analysis: {
        filter: {
          autocomplete_filter: {
            type: 'ngram',
            min_gram: 1,
            max_gram:10,
          },
        },

        analyzer: {
          autocomplete: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'autocomplete_filter'],
          },
        },
      },
    },

    mappings: {
      map: {
        properties: {
          title: { type: 'string', index: 'not_analyzed' },
          key: { type: 'string', analyzer: 'autocomplete' },
        },
      },
    },
  };

  client.indices.create({ index: 'maps', body })
    .then(() => {
      console.log('index for maps created.');
    })
    .catch((err) => {
      console.error('There was an error creating the index:', err);
      process.exit();
    });
};


const createAll = () => {
  // Resolved promise, will be used to chain all the other promises
  let chain = new Promise(resolve => resolve());
  const visited = [];
  let id = 0;

  // Return a promise that resolves when the new map is created.
  const create = (map, i) => new Promise((resolve, reject) => {
    const parsedMap = Object.assign({}, map);
    delete parsedMap.id;

    // Set the map key for each search. If there's a tag use that,
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
        console.log(parsedMap.title, 'added');
        resolve();
      })
      .catch((err) => {
        console.error('There was an error with map:', parsedMap.title);
        reject(err);
      });
  });

  walkDir('.', (map) => {
    if (!visited.includes(map.title)) {
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

// Delete all maps
const deleteAll = () => {
  client.deleteByQuery({ index: 'maps', q: '*' })
    .then(() => {
      console.log('all maps were successfully deleted.');
    })
    .catch((err) => {
      console.error('There was an error deleting all maps:', err);
      process.exit();
    });
};

// Delete index containing all maps
const deleteIndex = () => {
  client.indices.delete({ index: 'maps' })
    .then(() => {
      console.log('maps index deleted successfully.');
    })
    .catch((err) => {
      console.error('There was an error deleting the index:', err);
      process.exit();
    });
};


client.ping({ requestTimeout: 1000 })
  .then(() => {
    const options = [
      'create-index',
      'create',
      'delete-index',
      'delete',
    ];

    switch (action) {
      case 'create-index':
        createIndex();
        break;

      case 'create':
        createAll();
        break;

      case 'delete':
        deleteAll();
        break;

      case 'delete-index':
        deleteIndex();
        break;

      default:
        console.log('Run the command with one of the following arguments', options);
    }
  })
  .catch((err) => {
    console.error('Error reaching elasticsearch:', err);
    process.exit();
  });
