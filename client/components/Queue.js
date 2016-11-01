import React from 'react';

const Queue = ({ link }) => {
  // This interesting piece of string manipulation takes in a youtube url and turns it into a thumbnail url
  return <img src={`https://i.ytimg.com/vi/${link.split('=')[1]}/hqdefault.jpg`}></img>
}

export default Queue;
