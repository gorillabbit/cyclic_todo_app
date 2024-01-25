import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';

const formatElapsedTime = seconds => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${days}日${hours}時間${minutes}分${remainingSeconds}秒`;
};

const Stopwatch = () => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Text>経過時間 {formatElapsedTime(elapsedTime)}</Text>;
};

export default Stopwatch;
