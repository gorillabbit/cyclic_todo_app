import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {deleteDocLog, addDocLogsCompleteLogs} from '../../firebase';
import {
  Log as LogType,
  LogsCompleteLogs as LogsCompleteLogsType,
} from '../../types';
import {format, differenceInDays} from 'date-fns';
import {checkLastLogCompleted} from '../../utilities/dateUtilites';
import Stopwatch from './Stopwatch';
import {Button, ListItem} from '@rneui/themed';
import {Chip} from '@rneui/base';
import CompleteLog from './CompleteLog';

const logStyle = {borderWidth: 0.5, borderRadius: 4, marginTop: 5, padding: 10};
const Styles = StyleSheet.create({
  chips: {gap: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 2},
});

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
        <View style={Styles.chips}>
          {isLastCompletedAvailable && (
            <Chip title={'前回から ' + intervalFromLastCompleted} />
          )}
          <Chip title={'今日の回数 ' + todayCompletedCounts.length} />
          <Chip title={'通算完了回数 ' + completedCounts} />
          {isOpen &&
            completeLogs.map((completeLog: LogsCompleteLogsType) => (
              <CompleteLog completeLog={completeLog} />
            ))}
        </View>
      </ListItem.Content>
      <View>
        {log.duration && !isStarted && (
          <Button
            color={'#3f71dd'}
            onPress={e => logStart(log, e)}
            title={'開始'}
          />
        )}
        {(!log.duration || isStarted) && (
          <Button
            color={'#4caf50'}
            onPress={e => logComplete(log, e)}
            title={'完了'}
          />
        )}
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
