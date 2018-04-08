import axios from 'axios';
import actions from 'constants/actions.json';

export const fetchResources = topic => ({
  type: actions.topic.fetchResources.def,
  payload: axios.get(`/api/topics/${topic}/resources`),
});

export const fetchNodes = topic => ({
  type: actions.topic.fetchNodes.def,
  payload: axios.get(`/api/topics/${topic}/nodes`),
});

