import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import QueueApp from './components/Queueapp';
import Home from './components/Home';
/**
 * Layout is the react-router component that defines the structure of the page.
 */
class Layout extends Component {
 render() {
   return (
     <Router history={browserHistory}>
       <Route path="/" component={Home} />
       <Route path="/queue/:roomName" component={QueueApp} />
     </Router>
    );
  }
}

export default Layout;