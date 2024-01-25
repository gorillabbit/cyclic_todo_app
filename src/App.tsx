/* eslint-disable linebreak-style */
import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import Task from './components/Task.tsx';
import TaskInputForm from './components/TaskInputForm.js';
import LogInputForm from './components/LogInputForm.js';
import Header from './components/Header.js';
import {db, addDocTask, addDocLog} from './firebase.js';
import {format} from 'date-fns';
import {checkTaskDue, calculateNext期日} from './utilities/dateUtilites.js';
import {orderBy, collection, onSnapshot, query} from 'firebase/firestore';
import {
  Task as TaskType,
  Log as LogType,
  LogsCompleteLogs as LogsCompleteLogsType,
} from './types';
import Log from './components/Log.tsx';
import ToggleButtons from './components/ToggleButtons.js';
import {Button} from '@rneui/base';

const now = new Date();
const formattedDate = format(now, 'yyyy-MM-dd');

const defaultNewTask: TaskType = {
  text: '',
  期日: formattedDate,
  時刻: '00:00',
  is周期的: '周期なし',
  周期日数: '1',
  周期単位: '日',
  completed: false,
  親taskId: '',
};

const defaultNewLog: LogType = {
  text: '',
  interval: false,
};

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const unCompletedTasks = useMemo(
    () => tasks.filter(task => !task.completed),
    [tasks],
  );
  const completedTasks = useMemo(
    () =>
      tasks
        .filter(task => task.completed)
        .sort((a, b) => {
          // タイムスタンプを比較して並び替え
          const dateA = a.toggleCompletionTimestamp?.toDate() ?? new Date(0);
          const dateB = b.toggleCompletionTimestamp?.toDate() ?? new Date(0);
          return dateA.getTime() - dateB.getTime();
        }),
    [tasks],
  );

  const [newTask, setNewTask] = useState<TaskType>(defaultNewTask);
  const [isTask, setIsTask] = useState<boolean>(true);
  const [newLog, setNewLog] = useState<LogType>(defaultNewLog);
  const [logList, setLogList] = useState<LogType[]>([]);
  const [logsCompleteLogsList, setLogsCompleteLogsList] = useState<
    LogsCompleteLogsType[]
  >([]);

  useEffect(() => {
    //Taskの取得
    const tasksQuery = query(
      collection(db, 'tasks'),
      orderBy('期日'),
      orderBy('時刻'),
    );
    const unsubscribeTask = onSnapshot(tasksQuery, querySnapshot => {
      const tasksData: TaskType[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        期日: doc.data().期日,
        時刻: doc.data().時刻,
        is周期的: doc.data().is周期的,
        周期日数: doc.data().周期日数,
        周期単位: doc.data().周期単位,
        completed: doc.data().completed,
        toggleCompletionTimestamp: doc.data()?.toggleCompletionTimestamp,
        親taskId: doc.data()?.親taskId,
      }));
      setTasks(tasksData);
      console.log('tasksData', tasksData);
    });

    //Logの取得
    const unsubscribeLog = onSnapshot(
      query(collection(db, 'logs')),
      querySnapshot => {
        const LogsData: LogType[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
          interval: doc.data().interval,
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
            logId: doc.data().logId,
            timestamp: doc.data().timestamp,
            type: doc.data().type,
          }));
        setLogsCompleteLogsList(logsCompleteLogsData);
      },
    );

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeTask();
      unsubscribeLog();
      unsubscribeLogsCompleteLogs();
    };
  }, []);

  const addNewTasksIfNeeded = () => {
    const newTasks: TaskType[] = [];
    tasks.forEach(task => {
      if (task.is周期的 === '必ず追加' && tasks.length !== 0) {
        const diffTime = checkTaskDue(task.期日 + ' ' + task.時刻);
        if (diffTime < 0) {
          const next期日 = calculateNext期日(task, new Date(task.期日));
          const 同一期日tasks = tasks?.filter(
            listTask => listTask.期日 === next期日,
          );
          const 子tasks = 同一期日tasks.filter(
            同一期日task => 同一期日task.親taskId === task.id,
          );
          const 兄弟tasks = 同一期日tasks.filter(
            同一期日task => 同一期日task.親taskId === task.親taskId,
          );
          if (子tasks.length === 0 && 兄弟tasks.length === 0) {
            const newTask = {
              text: task.text,
              期日: next期日,
              時刻: task.時刻,
              is周期的: '必ず追加',
              周期日数: task.周期日数,
              周期単位: task.周期単位,
              親taskId: task.親taskId ?? task.id,
              completed: false,
            };
            newTasks.push(newTask);
          }
        }
      }
    });
    return newTasks;
  };

  useEffect(() => {
    const newTasks = addNewTasksIfNeeded();
    if (newTasks.length > 0 && tasks.length < 10) {
      setTasks(prevTasks => [...prevTasks, ...newTasks]);
      newTasks.forEach(newTask => {
        addDocTask(newTask);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]); // 依存配列に tasklist だけを含める

  const handleNewTaskInput = (name: string, value: string) => {
    if (name === '周期日数' && parseInt(value, 10) <= 0) {
      alert('0以下は入力できません。');
      return;
    }
    setNewTask(prev => ({...prev, [name]: value}));
  };

  const handleNewLogInput = (name: string, value: string) => {
    console.log(name, value);
    setNewLog(prev => ({...prev, [name]: value}));
  };

  // テキスト入力をハンドル（タスクとログの両方）
  const handleTextInput = (name: string, value: string) => {
    handleNewTaskInput(name, value);
    handleNewLogInput(name, value);
  };

  // タスクの追加
  const addTask = () => {
    if (newTask) {
      const taskToAdd =
        newTask.is周期的 === '周期なし' ? omitPeriodicFields(newTask) : newTask;
      setTasks([...tasks, {...taskToAdd, completed: false}]);
      addDocTask(taskToAdd);
      setNewTask(defaultNewTask);
    }
  };

  // 周期的なフィールドを省略
  function omitPeriodicFields(task: TaskType) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {周期日数, 周期単位, ...rest} = task;
    return rest;
  }

  // ログの追加
  const addLog = () => {
    if (newLog) {
      setLogList([...logList, newLog]);
      addDocLog(newLog);
      setNewLog(defaultNewLog);
    }
  };

  const styles = StyleSheet.create({
    app: {
      fontFamily: 'Noto Sans JP',
      textAlign: 'center',
      padding: 0,
    },
    content: {paddingHorizontal: 30},
    flexContainer: {display: 'flex', flexGrow: 1},
    inputButton: {
      padding: 10,
      borderWidth: 0,
      borderRadius: 4,
      backgroundColor: '#4caf50',
      color: '#ffffff',
      marginTop: 0,
      marginRight: 3,
      marginBottom: 6,
      marginLeft: 3,
    },
    logList: {},
  });

  return (
    <ScrollView style={styles.app}>
      <Header />
      <View style={styles.content}>
        <ToggleButtons isTask={isTask} setIsTask={setIsTask} />
        <View style={styles.flexContainer}>
          {isTask ? (
            <TaskInputForm
              newTask={newTask}
              newLog={newLog}
              updateNewTask={handleNewTaskInput}
              handleTextInput={handleTextInput}
            />
          ) : (
            <LogInputForm
              newTask={newTask}
              newLog={newLog}
              handleTextInput={handleTextInput}
              handleNewLogInput={handleNewLogInput}
            />
          )}
          <Button
            style={styles.inputButton}
            onPress={isTask ? addTask : addLog}>
            <Text>追加</Text>
          </Button>
        </View>
        <View style={styles.logList}>
          {logList.map(log => (
            <Log
              key={log.id}
              log={log}
              logsCompleteLogs={logsCompleteLogsList}
            />
          ))}
        </View>
        {unCompletedTasks.map(task => (
          <Task
            key={task.id}
            task={task}
            setTasks={setTasks}
            tasklist={tasks}
          />
        ))}
        <Text>完了済みタスク</Text>
        {completedTasks.map(task => (
          <Task
            key={task.id}
            task={task}
            setTasks={setTasks}
            tasklist={tasks}
          />
        ))}
      </View>
    </ScrollView>
  );
}

export default App;
