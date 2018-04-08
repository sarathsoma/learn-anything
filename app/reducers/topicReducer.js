import actions from 'constants/actions.json';


const initialState = {
  name: '',
  wiki: null,
  summary: null,
  resources: [],
  map: {
    nodes: {},
    rootNode: '',
    relationships: {},
  },
};


export default (state = initialState, action) => {
  switch (action.type) {
    case actions.topic.fetchResources.fulfilled: {
      const { resources, meta } = action.payload.data;

      return {
        ...state,
        ...meta,
        resources,
      };
    }

    case actions.topic.fetchNodes.fulfilled: {
      const { nodes, rootNode, relationships, meta } = action.payload.data;

      return {
        ...state,
        ...meta,
        map: {
          nodes,
          rootNode,
          relationships,
        },
      };
    }

    default:
      return state;
  }
};
