import React from 'react';

const Queue = ({ link, score, thumbnailClick }) => {
  // This interesting piece of string manipulation takes in a youtube url and turns it into a thumbnail url
  return (
    <div>
    <img className="images" onClick={() => thumbnailClick(link)} src={`https://i.ytimg.com/vi/${link.split('=')[1]}/hqdefault.jpg`}></img>;
    <p>{score}</p>
    </div>
  )
}

export default Queue;
