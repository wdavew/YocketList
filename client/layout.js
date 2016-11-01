import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';
import QueueApp from './components/queueapp';
/**
 * Layout is the react-router component that defines the structure of the page.
 * this.props.children changes based on the current route.
 */
class Layout extends React.Component {
 render() {
   return (
     <Router history={hashHistory}>
       <Route path="/queue" component={QueueApp} />
     </Router>
    )
  }
}

export default Layout;