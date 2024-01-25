import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
//import "../App.css";
import {addDocTask, deleteDocTask, updateDocTask} from '../firebase.js';
import {calculateNext期日} from '../utilities/dateUtilites.js';
import {getBackgroundColor} from '../utilities/taskUtilites.js';

import {serverTimestamp} from 'firebase/firestore';
import TaskDetail from './TaskDetail.js';
import {Task as TaskType} from '../types.js';
import {Button, ListItem} from '@rneui/themed';

interface TaskProps {
  task: TaskType;
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  tasklist?: TaskType[];
  type?: string;
}

const styles = StyleSheet.create({
  childTaskStyle: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  taskContent: {
    flexGrow: 1,
  },
});

const toggleCompletion = (
  task: TaskType,
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>,
) => {
  updateDocTask(task.id, {
    completed: !task.completed,
    toggleCompletionTimestamp: serverTimestamp(),
  });

  if (task.completed === false && task.is周期的 === '完了後に追加') {
    const newTask = {
      text: task.text,
      期日: calculateNext期日(task, new Date()),
      時刻: task.時刻,
      is周期的: '完了後に追加',
      周期日数: task.周期日数,
      周期単位: task.周期単位,
      親taskId: task.親taskId ?? task.id,
      completed: false,
    };
    addDocTask(newTask);
    setTasks(tasklist => [...tasklist, newTask]);
  }
};

function ChildTasks({tasks, setTasks}) {
  return (
    <View style={styles.childTaskStyle}>
      <Text>子task</Text>
      {tasks.map((子task: TaskType) => (
        <Task type="子task" key={子task.id} task={子task} setTasks={setTasks} />
      ))}
    </View>
  );
}

const Task: React.FC<TaskProps> = ({task, setTasks, tasklist}) => {
  const backgroundColor = getBackgroundColor(task.期日 + ' ' + task.時刻);
  const tasklistStyle = StyleSheet.create({
    tasklistStyle: {
      backgroundColor: task.completed ? '#c0c0c0' : backgroundColor,
      marginTop: 5,
      color: task.completed ? '#5f5f5f' : '',
      borderRadius: 4,
    },
  });

  const 子tasks = tasklist?.filter(listTask => listTask.親taskId === task.id);
  const 親tasks = tasklist?.filter(listTask => listTask.id === task.親taskId);

  const is完了後追加 = task.is周期的 === '完了後に追加';
  const [open, setOpen] = useState(false);

  const handleTaskClick = (event: {stopPropagation: () => void}) => {
    event.stopPropagation();
    setOpen(prevOpen => !prevOpen);
  };

  return (
    <ListItem
      containerStyle={tasklistStyle.tasklistStyle}
      onPress={handleTaskClick}>
      <ListItem.CheckBox
        checked={task.completed}
        onPress={() => toggleCompletion(task, setTasks)}
      />
      <ListItem.Content style={styles.taskContent}>
        <ListItem.Title>{task.text}</ListItem.Title>
        <ListItem.Subtitle>
          周期{is完了後追加 && ' タスク完了後 '}
          {task.周期日数}
          {task.周期単位}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          {task.期日 ? '期日 ' : ''}
          {task.期日}
          {task.時刻}
        </ListItem.Subtitle>

        {open && <TaskDetail task={task} />}
        {open && 子tasks && 子tasks.length > 0 && (
          <ChildTasks tasks={子tasks} setTasks={setTasks} />
        )}
        {open && 親tasks && 親tasks.length > 0 && (
          <ChildTasks tasks={親tasks} setTasks={setTasks} />
        )}
      </ListItem.Content>
      <Button
        color={'#f44336'}
        title={'削除'}
        onPress={() => deleteDocTask(task.id)}
      />
    </ListItem>
  );
};

export default Task;
