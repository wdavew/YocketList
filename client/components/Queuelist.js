import React from 'react';
import Queue from './queue';


const QueueList = (props) => {
  const list = props.queues.map((queue, ind) => <Queue key={ind} link={queue} />);
  return <div>{list}</div>;
};

export default QueueList;
