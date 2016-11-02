import React, { Component } from 'react';

// Although Queue is stateless, FlipMove requires class for ref
class Queue extends Component {
  constructor(props) {
    super(props)
  }

  // For src: this interesting piece of string manipulation takes in a youtube url and turns it into a thumbnail
  render() {
    return (
      <div>
        <img className="images" onDoubleClick={() => this.props.thumbnailClick(this.props.link)} src={`https://i.ytimg.com/vi/${this.props.link.split('=')[1]}/hqdefault.jpg`}></img>;
        <p>{this.props.score}</p>
      </div>
    );
  }
}

export default Queue;
