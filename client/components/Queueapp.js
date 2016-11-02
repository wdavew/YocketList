import React, { Component } from 'react';
import Youtube from 'react-youtube';
import Queue from './Queue';
import Form from './Queueform';
import QueueList from './Queuelist';
import io from 'socket.io-client';

const HOST = "http://localhost:3000";

class QueueApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queues: [],
      video: ''
    }
    this.socket = io.connect(HOST);

    this.getData = this.getData.bind(this);
    this.formClick = this.formClick.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handlePlayerEnd = this.handlePlayerEnd.bind(this);
  }
  /**
   * We GET our data here after each render
   */
  getData() {
    console.log('received message to get new data');
    $.get(HOST + `/queue/${this.props.params.roomName}`).done(data => this.setState({ queues: data }));
  }
  /**
 * handleStateChange is an event listener for the react-youtube
 * component's state. The states are as follows:
 * UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5
 */
  handleStateChange(event) {
    // CUED was a good option for enabling "auto play" because it waits
    // until the player is loaded (-1) and then the video is cued ready to play.
    // ENDED allows repeat behavior for last video.
    if (event.data === 5) event.target.playVideo();
  }
  /**
   * TODO: get access to url that the admin wants to remove
   */

  
  handlePlayerEnd(event) {
    console.log('local storage', (localStorage.getItem(`admin${this.props.params.roomName}`)));
    if (localStorage.getItem(`admin${this.props.params.roomName}`)) {
      $.ajax({
        type: "GET",
        url: HOST + `/getNextVideo/${this.props.params.roomName}`,
        contentType: "application/json; charset=utf-8",
      }).done((response) => {
        this.setState({ video: response });
        this.socket.emit('refreshQueue', {room: this.props.params.roomName});
    });
    }
  }
  /**
   * This is the callback for the form component to use in onClick.
   * It makes an ajax request to add a new link when the submit button is clicked.
   */
  formClick(link) {
    // TODO this functionality should be replaced with socket logic.
    // let newQueues = [...this.state.queues];
    // newQueues.push(link);
    // this.setState({ queues: newQueues });
    $.ajax({
      url: HOST + '/addToQueue',
      type: "POST",
      data: JSON.stringify({ link: link, room: this.props.params.roomName }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).done(() => this.socket.emit('newdata'))
  }
  /**
   * This is where the listeners for this.socket go.
   * on[newData] -> Implies there is a change in data on the backend.
   *                The callback will make a GET request and update state
   *                with the new list of Youtube URLs.
   * on[joiningRoom] -> Implies someone has created a room.
   *                    The callback will update our roomName in the constructor
   *                    with the input value typed into the Home createRoom form.
   */
  componentDidMount() {
    this.getData();
    this.socket.emit('room', {roomName: this.props.params.roomName});
    this.socket.on('newdata', this.getData);
  }

  render() {
    let videoUrl;
    if (this.state.video) {
      videoUrl = this.state.video;
      console.log(videoUrl);
    }

    return (
      <div className="youtube-wrapper">
        <h1>Welcome to QTube! Your room is: {this.props.params.roomName}</h1>
        <Form key={'form-key'} formClick={this.formClick} />
        <Youtube videoId={videoUrl} onEnd={this.handlePlayerEnd} onStateChange={this.handleStateChange} />
        <QueueList queues={this.state.queues} />
      </div>
    )
  }
}

export default QueueApp;
