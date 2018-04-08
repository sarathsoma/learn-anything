import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchResources } from 'actions/Topic';


@connect(store => ({
  topic: store.topic,
}))
export default class LearnPage extends Component {
  componentWillMount() {
    const { topic } = this.props.match.params;

    if (this.props.topic.name.toLowerCase() !== topic.toLowerCase()) {
      this.props.dispatch(fetchResources(topic));
    }
  }

  componentWillUpdate(nextProps) {
    const { topic } = nextProps.match.params;

    if (nextProps.topic.name.toLowerCase() !== topic.toLowerCase()) {
      this.props.dispatch(fetchResources(topic));
    }
  }

  render() {
    const { topic } = this.props;

    return (
      <div>
        <h1>{topic.name}</h1>
        <h1>{topic.wiki}</h1>
        <p>{topic.summary}</p>
      </div>
    );
  }
}
