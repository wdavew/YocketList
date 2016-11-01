import React from 'react';
import Queue from './queue';

const QueueList = ({ queues }) => {
  function matchYoutubeUrl(url) {
    const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) return true;
    return false;
  }

  // Create Queue component for URLs that are in valid YouTube format
  // Slice at 1 to avoid showing thumbnail for current video playing
  const validUrls = queues.filter(queue => matchYoutubeUrl(queue))
    .slice(1)
    .map((queue, index) => <Queue key={index} link={queue} />);

  return <div>{validUrls}</div>;
};

export default QueueList;
