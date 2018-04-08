import React from 'react';

import SearchBar from 'components/SearchBar';
import 'sass/_Header.sass';


export default props => (
  <header className="app-header">
    <SearchBar history={props.history} docked />
  </header>
);
