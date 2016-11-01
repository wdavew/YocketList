import React from 'react';

const Queue = (props) => {
  // This interesting piece of string manipulation takes in a youtube url and turns it into a thumbnail url
  return <img src={`https://i.ytimg.com/vi/${props.link.split('=')[1]}/hqdefault.jpg`}></img>
}

export default Queue;
