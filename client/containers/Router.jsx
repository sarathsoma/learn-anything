import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Auth from 'utils/Auth';
import store from 'store/store';
import actions from 'constants/actions.json';
import HomePage from 'containers/HomePage';
import LearnPage from 'containers/LearnPage';
import ExplorePage from 'containers/ExplorePage';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';


const Callback = () => {
  window.laAuth.handleAuthentication();
  return null;
};


@withRouter
export default class Router extends Component {
  componentWillMount() {
    // Initialize Auth component and set it as a global vairable,
    // then send a pageview to GA.
    window.laAuth = new Auth(this.props.history);
    store.dispatch({
      type: actions.ga.pageview,
      payload: this.props.history.location.pathname,
    });
  }

  componentWillUpdate(nextProps) {
    // A new page is going to be loaded, send a pageview.
    store.dispatch({
      type: actions.ga.pageview,
      payload: nextProps.history.location.pathname,
    });
  }

  render() {
    return (
      <div className="app-container">
        <Header history={this.props.history} />
        <Sidebar />

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/callback" component={Callback} />
          <Route path="/learn/:topic" component={LearnPage} />
          <Route path="/explore/:topic" component={ExplorePage} />
        </Switch>
      </div>
    );
  }
}
