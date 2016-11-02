import React from 'react';
import Queue from './queue';
import FlipMove from 'react-flip-move';

const QueueList = ({ thumbnailClick, queues }) => {
  // Create Queue component for URLs. Format validation moved to server.
  const validUrls = queues.map((queue) => <Queue thumbnailClick={thumbnailClick} key={queue.url} 
  link={queue.url} score={queue.score} />);
  
  return (
    <div id="queueDiv">
      <FlipMove easing="cubic-bezier(0, 0.7, 0.8, 0.1)">
        {validUrls}
      </FlipMove>
    </div>  
  );
};

export default QueueList;
