import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {deleteDocLog, addDocLogsCompleteLogs} from '../firebase';
import {
  Log as LogType,
  LogsCompleteLogs as LogsCompleteLogsType,
} from '../types';
import {format, differenceInDays} from 'date-fns';
import {checkLastLogCompleted} from '../utilities/dateUtilites';
import Stopwatch from './Stopwatch';
import {Button, ListItem} from '@rneui/themed';

const logStyle = {borderWidth: 0.5, borderRadius: 4, marginTop: 5};

const logComplete = (log: LogType, event) => {
  event.stopPropagation();
  const logsCompleteLogs = {
    logId: log.id,
    type: 'finish',
  };
  addDocLogsCompleteLogs(logsCompleteLogs);
};

const logStart = (log: LogType, event) => {
  event.stopPropagation();
  const logsCompleteLogs = {
    logId: log.id,
    type: 'start',
  };
  addDocLogsCompleteLogs(logsCompleteLogs);
};

const deleteLog = (id, event) => {
  event.stopPropagation();
  deleteDocLog(id);
};

const CompleteLog = ({completeLog}) => {
  return completeLog.timestamp ? (
    <View key={completeLog.id}>
      <Text>{format(completeLog.timestamp.toDate(), 'yyyy-MM-dd HH:mm')}</Text>
    </View>
  ) : (
    <View />
  );
};

const Log = ({log, logsCompleteLogs}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //前回からの経過時間を表示する
  const [intervalFromLastCompleted, setIntervalFromLastCompleted] =
    useState<string>('');

  const completeLogs = logsCompleteLogs.filter(
    (logsCompleteLog: LogsCompleteLogsType) => logsCompleteLog.logId === log.id,
  );
  const finishLogs = completeLogs.filter(log => log.type === 'finish');
  const lastCompletedLog = finishLogs[0];
  const isStarted = completeLogs[0]?.type === 'start';
  const isLastCompletedAvailable =
    !!lastCompletedLog && !!lastCompletedLog.timestamp;
  const lastCompleted = isLastCompletedAvailable
    ? format(lastCompletedLog.timestamp.toDate(), 'yyyy-MM-dd HH:mm')
    : '';

  useEffect(() => {
    if (isLastCompletedAvailable) {
      setIntervalFromLastCompleted(checkLastLogCompleted(lastCompleted));
      const timerId = setInterval(() => {
        setIntervalFromLastCompleted(checkLastLogCompleted(lastCompleted));
      }, 1000 * 60); // 1分ごとに更新
      return () => {
        clearInterval(timerId);
      };
    }
  }, [lastCompleted, isLastCompletedAvailable]);
  //これまでの完了回数
  const completedCounts = finishLogs.length;
  const todayCompletedCounts = finishLogs.filter(
    (log: {timestamp: {toDate: () => any}}) =>
      differenceInDays(new Date(), log.timestamp?.toDate()) < 1,
  );
  return (
    <ListItem
      containerStyle={logStyle}
      onPress={() => setIsOpen(prevOpen => !prevOpen)}>
      <ListItem.Content>
        <ListItem.Title>{log.text}</ListItem.Title>
        {isStarted && (
          <ListItem.Subtitle>
            <Stopwatch />
          </ListItem.Subtitle>
        )}
        <ListItem.Subtitle>
          {isLastCompletedAvailable || lastCompletedLog
            ? '前回から ' + intervalFromLastCompleted
            : ''}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          {'今日の回数 ' + todayCompletedCounts.length}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          {'通算完了回数 ' + completedCounts}
        </ListItem.Subtitle>
        {isOpen &&
          completeLogs.map((completeLog: LogsCompleteLogsType) => (
            <CompleteLog completeLog={completeLog} />
          ))}
      </ListItem.Content>
      <View>
        {log.interval && (
          <Button
            color={'#3f71dd'}
            onPress={e => logStart(log, e)}
            disabled={isStarted}
            title={'開始'}
          />
        )}
        <Button
          color={'#4caf50'}
          onPress={e => logComplete(log, e)}
          disabled={log.interval ? !isStarted : false}
          title={'完了'}
        />
        <Button
          color={'#f44336'}
          onPress={e => deleteLog(log.id, e)}
          title={'削除'}
        />
      </View>
    </ListItem>
  );
};

export default Log;
