import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchNodes } from 'actions/Topic';


@connect(store => ({
  topic: store.topic,
}))
export default class ExplorePage extends Component {
  componentWillMount() {
    const { topic } = this.props.match.params;

    if (this.props.topic.name.toLowerCase() !== topic.toLowerCase()) {
      this.props.dispatch(fetchNodes(topic));
    }
  }

  componentWillUpdate(nextProps) {
    const { topic } = nextProps.match.params;

    if (nextProps.topic.name.toLowerCase() !== topic.toLowerCase()) {
      this.props.dispatch(fetchNodes(topic));
    }
  }

  render() {
    console.log(this.props.map);

    return (
      <div>
        <h1>
          {this.props.topic.name}
        </h1>
      </div>
    );
  }
}
