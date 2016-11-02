import React, { Component } from 'react';
import Youtube from 'react-youtube';
import Queue from './Queue';
import Form from './Queueform';
import QueueList from './Queuelist';
import io from 'socket.io-client';
import ReactPlayer from 'react-player'

const HOST = "http://localhost:3000";

class QueueApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queues: [],
      video: '',
      playing: true,
      startPosition: 0,
      played: 0,
    }

    this.socket = io.connect(HOST);
  }

  onProgress = ({played}) => {
    const position = parseFloat(played);
    this.setState({played: position});
    console.log(this.state.played);
  }

  userIsAdmin = () => {
    return Boolean(localStorage.getItem(`admin${this.props.params.roomName}`))
  }

  setCurrentVideo = ({url, start}) => {
      console.log('received url', url);
      this.setState({video: url, startPosition: start})
    }

 adminSendVid = () => {
    console.log('adminsendvid');
    console.log(this.admin);
    if (this.admin) {
      console.log('sending vid url to new user');
      this.socket.emit('currentVideo',  { 
        room: this.props.params.roomName, 
        url: this.state.video, 
        start: this.state.played
      })
    }
  }

  adminOnPlay = () => {
    if (this.admin) this.socket.emit('adminPlay', { room: this.props.params.roomName });
  }
  
  adminOnPause = () => {
    if (this.admin) this.socket.emit('adminPause', { room: this.props.params.roomName });
  }
  /**
   * This is the callback for the Queue component to use in onClick.
   * It makes an ajax request to increase a video's vote by one when a thumbnail is clicked.
   */
  thumbnailClick = (link) => {
    $.ajax({
      url: HOST + '/increaseVote',
      type: "POST",
      data: JSON.stringify({ link , room: this.props.params.roomName}),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    }).done(() => this.socket.emit('refreshQueue', { room: this.props.params.roomName }))
  }

  playVideo = ()  => { 
    console.log('playing video');
    this.setState({playing: true});
  }

  pauseVideo = () => {
    console.log('pausing');
    this.setState({playing: false});
  }
  /**
   * We GET our data here after each render
   */
  getData = () => {
    if (this.state.video === '' && this.admin) {
        $.ajax({
          type: "GET",
          url: HOST + `/getNextVideo/${this.props.params.roomName}`,
          contentType: "application/json; charset=utf-8",
        }).done((response) => {
          this.setState({ video: response });
          this.adminSendVid()
          this.socket.emit('refreshQueue', { room: this.props.params.roomName });
        })
      } else {
      $.get(HOST + `/queue/${this.props.params.roomName}`).done(data => this.setState({ queues: data }));
    }
  }

syncWithAdmin = () => {
  if (!this.admin) this.player.seekTo(this.state.startPosition)
}
/**
 * TODO: get access to url that the admin wants to remove
 */


handlePlayerEnd = (event) => {
  if (this.admin) {
    $.ajax({
      type: "GET",
      url: HOST + `/getNextVideo/${this.props.params.roomName}`,
      contentType: "application/json; charset=utf-8",
    }).done((response) => {
      this.setState({ video: response  });
      this.adminSendVid();
      this.socket.emit('refreshQueue', { room: this.props.params.roomName });
    });
  }
}
/**
 * This is the callback for the form component to use in onClick.
 * It makes an ajax request to add a new link when the submit button is clicked.
 */

formClick = (link) => {
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
 * on[room] -> Implies someone has created a room.
 *             The callback will update our roomName in the constructor
 *             with the input value typed into the Home createRoom form.
 */
componentDidMount() {
  this.getData();
  this.admin = this.userIsAdmin();
  this.socket.emit('room', { roomName: this.props.params.roomName });
  this.socket.on('newdata', this.getData);
  this.socket.on('play', this.playVideo);
  this.socket.on('pause', this.pauseVideo);
  this.socket.on('newUser', this.adminSendVid);
  this.socket.on('vidUrl', this.setCurrentVideo);
}

render() {
  let videoUrl;
  if (this.state.video) {
    videoUrl = this.state.video;
  }
  console.log(this.state.queues);

  return (
    <div>
      <h1>Room: {this.props.params.roomName}</h1>
      <Form key={'form-key'} formClick={this.formClick} />
      <div className="youtube-wrapper">
        <ReactPlayer id='youtube-component' ref={player => { this.player = player }}
          url={videoUrl} playing={this.state.playing} controls={true}
          onPlay={this.adminOnPlay} onPause={this.adminOnPause} onEnded={this.handlePlayerEnd} 
          onProgress={this.onProgress} progressFrequency={500} onReady = {this.syncWithAdmin}/>
        <QueueList thumbnailClick={this.thumbnailClick} queues={this.state.queues} />
      </div>
    </div>
  )
}
    }

export default QueueApp;
 