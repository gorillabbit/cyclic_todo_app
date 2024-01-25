import React, {useState, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';

const style = StyleSheet.create({
  container: {margin: 10, textAlign: 'center', color: 'white'},
});

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1秒ごとに更新

    return () => {
      clearInterval(timerId); // コンポーネントのクリーンアップ時にタイマーを停止
    };
  }, []);

  // 日付と曜日をフォーマットする関数
  const formatDate = date => {
    date.setHours(date.getHours() + 9);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleString('ja-JP', options);
  };

  return <Text style={style.container}>{formatDate(currentTime)}</Text>;
};

export default Clock;
