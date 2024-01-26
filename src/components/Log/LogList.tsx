import {View} from 'react-native';
import Log from './Log';
import {useEffect, useState} from 'react';
import {collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import {
  Log as LogType,
  LogsCompleteLogs as LogsCompleteLogsType,
} from '../../types';
import {db} from '../../firebase';
import React from 'react';

const LogList = () => {
  const [logList, setLogList] = useState<LogType[]>([]);
  const [logsCompleteLogsList, setLogsCompleteLogsList] = useState<
    LogsCompleteLogsType[]
  >([]);
  useEffect(() => {
    //Logの取得
    const unsubscribeLog = onSnapshot(
      query(collection(db, 'logs')),
      querySnapshot => {
        const LogsData: LogType[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as LogType),
        }));
        setLogList(LogsData);
      },
    );

    const logsCompleteLogsQuery = query(
      collection(db, 'logsCompleteLogs'),
      orderBy('timestamp', 'desc'),
    );
    const unsubscribeLogsCompleteLogs = onSnapshot(
      logsCompleteLogsQuery,
      querySnapshot => {
        const logsCompleteLogsData: LogsCompleteLogsType[] =
          querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as LogsCompleteLogsType),
          }));
        setLogsCompleteLogsList(logsCompleteLogsData);
      },
    );

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeLog();
      unsubscribeLogsCompleteLogs();
    };
  }, []);
  return (
    <View>
      {logList.map(log => (
        <Log key={log.id} log={log} logsCompleteLogs={logsCompleteLogsList} />
      ))}
    </View>
  );
};

export default LogList;
