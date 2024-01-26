import React, {useEffect, useMemo, useState} from 'react';
import Task from './Task';
import {Text} from 'react-native';
import {collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import {db} from '../../firebase';
import {Task as TaskType} from '../../types';

const TaskList = () => {
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
        ...(doc.data() as TaskType),
      }));
      setTasks(tasksData);
      console.log('tasksData', tasksData);
    });

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeTask();
    };
  }, []);
  return (
    <>
      {unCompletedTasks.map(task => (
        <Task key={task.id} task={task} setTasks={setTasks} tasklist={tasks} />
      ))}
      <Text>完了済みタスク</Text>
      {completedTasks.map(task => (
        <Task key={task.id} task={task} setTasks={setTasks} tasklist={tasks} />
      ))}
    </>
  );
};

export default TaskList;
