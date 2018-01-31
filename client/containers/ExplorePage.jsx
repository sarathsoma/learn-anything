import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchNodes } from 'actions/Topic';


@connect(store => ({
  map: store.topic.map,
}))
export default class ExplorePage extends Component {
  componentDidMount() {
    const { topic } = this.props.match.params;
    this.props.dispatch(fetchNodes(topic));
  }

  render() {
    console.log(this.props.map);

    return (
      <div></div>
    );
  }
}
