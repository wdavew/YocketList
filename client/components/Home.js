import React, { Component } from 'react';
import io from 'socket.io-client';
import { browserHistory } from 'react-router';

const HOST = "http://localhost:3000";

class Home extends Component {
  constructor() {
    super();
    this.socket = io.connect(HOST);
  }
  
  createRoom = (clickEvent) => {
    clickEvent.preventDefault();
    const form = document.forms.createRoom;
    const roomName = form.roomToCreate.value;
    
    $.ajax({
      type: "POST",
      url: HOST + "/createRoom",
      data: JSON.stringify({ roomName }),
      contentType: "application/json; charset=utf-8",
    }).done(() => {
      localStorage.setItem(`admin${roomName}`, 'true')
      browserHistory.push(`/queue/${roomName}`)
    }).fail(() => alert('room name taken'));
    
    form.roomToCreate.value = '';
  }

  joinRoom = (clickEvent) => {
    clickEvent.preventDefault();
    const form = document.forms.joinRoom;
    const roomName = form.roomToJoin.value;
    this.socket.emit('room', { roomName });
    form.roomToJoin.value = '';
  }
  
  componentDidMount() {
    this.socket.on('joiningRoom', ({ roomName }) => browserHistory.push(`/queue/${roomName}`));
    this.socket.on('roomDoesNotExist', () => alert('Please enter a valid room name.'));
  }

  render() {
    return (
      <div id="home">
        <h1 id="Qtube">QTube</h1>
        <form name='createRoom'>
          <input id="roomToCreate" type="text" name="roomToCreate"></input>
          <button id="create-room" onClick={this.createRoom}>Create room</button>
        </form>
        <form name='joinRoom'>
          <input id='roomToJoin' type="text" name="roomToJoin"></input>
          <button id="join-room" onClick={this.joinRoom}>Join room</button>
        </form>
      </div>
    );
  }

}

export default Home