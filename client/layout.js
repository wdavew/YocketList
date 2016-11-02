import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import Home from './components/Home';
import RouteNotFound from './components/RouteNotFound'
import QueueApp from './components/Queueapp';
/**
 * Layout is the react-router component that defines the structure of the page.
 */
class Layout extends Component {
 render() {
   return (
     <Router history={browserHistory}>
       <Route path="/" component={Home} />
       <Route path="/queue/:roomName" component={QueueApp} />
       <Route path='*' component={RouteNotFound} />
     </Router>
    );
  }
}

export default Layout;