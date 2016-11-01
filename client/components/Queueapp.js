import React, { Component } from 'react';
import Youtube from 'react-youtube';
import Queue from './Queue';
import Form from './Queueform';
import QueueList from './Queuelist';
import io from 'socket.io-client';

const HOST = "http://localhost:3000";

class QueueApp extends Component {
  constructor() {
    super();
    this.state = {
      queues: []
    }

    this.handlePlayerEnd = this.handlePlayerEnd.bind(this);    
    this.socket = io.connect(HOST);
    //initiate socket connection and set up listeners
    this.initializeListeners();
  } 
  /**
   * We GET our initial set of data here after the first render
   * has been made.
   */
  getData() {
    $.get(HOST + "/queue").done(data => this.setState({queues: data}));
  }
  /**
   * This is where the listeners for this.socket go.
   * on[newData] -> implies there is a change in data on the backend
   *                the callback will make a GET request and update state
   *                with the new list of Youtube URLs
   */
  initializeListeners() {
    this.socket.on('newdata', this.getData);
  }
    /**
   * handleStateChange is an event listener for the react-youtube
   * componenet's state. The states are as follows:
   * UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5
   */
  handleStateChange(event){
    console.log(event.data);
    // CUED was a good option for enabling "auto play" because it waits
    // until the player is loaded (-1) and then the video is cued ready to play
    if (event.data === 5) event.target.playVideo();
  }
/**
 * This method makes a post request to the server with the body {method: 'delete'}
 * This removes an item from the db and notifies all clients with the newdata event.
 */
  handlePlayerEnd(event){
    $.ajax({
      type: "POST",
      url: HOST + "/queue",
      data: JSON.stringify({method: "delete"}),
      contentType: "application/json; charset=utf-8",
      });
  }
  /**
   * This is the callback for the form component to use in onClick.
   * It makes an ajax request to add a new link when the submit button is clicked.
   */
  formClick(link) {
    // TODO this functionality should be replaced with socket logic.
    let newQueues = [...this.state.queues];
    newQueues.push(link); 
    this.setState({ queues: newQueues});
    $.ajax({
      url: HOST+"/queue",
      type:"POST",
      data: JSON.stringify({link: link}),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    // Can we make it so the current video played is not 
    // displayed in the queue?
    if (this.state.queues.length > 0) {
      var videoUrl = this.state.queues[0].split('=')[1];
      console.log(videoUrl);
    }

    return (
      <div className="youtube-wrapper">
        <h1>Welcome to QList!</h1>
        <Form key={0} formClick={this.formClick.bind(this)} />
        <Youtube videoId={videoUrl} onEnd={this.handlePlayerEnd} onStateChange={this.handleStateChange} />
        <QueueList queues={this.state.queues} />
      </div>
    )
  }
}

export default QueueApp;
