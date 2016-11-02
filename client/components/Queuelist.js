import React from 'react';
import Queue from './queue';

const QueueList = ({ thumbnailClick, queues }) => {
  // Create Queue component for URLs. Format validation moved to server.
  const validUrls = queues.map((queue, index) => <Queue thumbnailClick={thumbnailClick} key={index} link={queue} />);

  return <div id="queueDiv">{validUrls}</div>;
};

export default QueueList;
