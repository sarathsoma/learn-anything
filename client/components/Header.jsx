import React, { Component } from 'react';

import SearchBar from 'components/SearchBar';
import 'sass/_Header.sass';


export default class Header extends Component {
  render() {
    return (
      <header className="app-header">
        <SearchBar history={this.props.history} docked={true} />
      </header>
    );
  }
}
