import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import React, {useState} from 'react';
import {Input, Button} from '@rneui/base';
import {format} from 'date-fns';
import {Task as TaskType} from '../../types.js';
import {addDocTask} from '../../firebase.js';

const now = new Date();

const defaultNewTask: TaskType = {
  text: '',
  期日: now,
  時刻: now,
  is周期的: '周期なし',
  周期日数: '1',
  周期単位: '日',
  completed: false,
  親taskId: '',
};

const styles = StyleSheet.create({
  周期単位Input: {
    maxWidth: 10,
  },

  flexGrow: {
    flexGrow: 1,
  },
});

const TaskInputForm = () => {
  const [newTask, setNewTask] = useState<TaskType>(defaultNewTask);
  const handleNewTaskInput = (name: string, value) => {
    if (name === '周期日数' && parseInt(value, 10) <= 0) {
      alert('0以下は入力できません。');
      return;
    }
    setNewTask(prev => ({...prev, [name]: value}));
  };

  const validateTask = task => {
    return {
      ...task,
      期日: format(task.期日, 'yyyy年MM月dd日'),
      時刻: format(task.時刻, 'HH時mm分'),
    };
  };

  // タスクの追加
  const addTask = () => {
    if (newTask) {
      const validatedTask = validateTask(newTask);
      const taskToAdd =
        validatedTask.is周期的 === '周期なし'
          ? omitPeriodicFields(validatedTask)
          : validatedTask;
      addDocTask(taskToAdd);
      setNewTask(defaultNewTask);
    }
  };

  // 周期的なフィールドを省略
  function omitPeriodicFields(task) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {周期日数, 周期単位, ...rest} = task;
    return rest;
  }

  const [isOpen期日, setIsOpen期日] = useState(false);
  const [isOpen時刻, setIsOpen時刻] = useState(false);
  return (
    <View>
      <View>
        <Input
          style={styles.flexGrow}
          value={newTask.text}
          onChangeText={value => handleNewTaskInput('text', value)}
          placeholder="タスクを入力"
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Button
            title={'期日 ' + format(newTask.期日, 'yyyy年MM月dd日')}
            onPress={() => setIsOpen期日(prev => !prev)}
          />
          <Button
            title={'時刻 ' + format(newTask.時刻, 'HH時mm分')}
            onPress={() => setIsOpen時刻(prev => !prev)}
          />
        </View>
        <DatePicker
          modal
          open={isOpen期日}
          title="期日"
          mode="date"
          date={newTask.期日 as Date}
          locale="ja"
          onConfirm={value => {
            handleNewTaskInput('期日', value);
            setIsOpen期日(false);
          }}
          onCancel={() => setIsOpen期日(false)}
        />
        <DatePicker
          modal
          open={isOpen時刻}
          title="時刻"
          mode="time"
          date={newTask.時刻 as Date}
          locale="ja"
          is24hourSource="locale"
          onConfirm={value => {
            handleNewTaskInput('時刻', value);
            setIsOpen時刻(false);
          }}
          onCancel={() => setIsOpen時刻(false)}
        />
      </View>

      <Picker
        selectedValue={newTask.is周期的}
        onValueChange={value => handleNewTaskInput('is周期的', value)}>
        <Picker.Item value="周期なし" label="周期なし" />
        <Picker.Item value="完了後に追加" label="完了後にタスクを追加" />
        <Picker.Item value="必ず追加" label="必ず追加" />
      </Picker>
      {newTask.is周期的 !== '周期なし' && (
        <View>
          <Input
            keyboardType="numeric"
            value={newTask.周期日数}
            onChangeText={value => handleNewTaskInput('周期日数', value)}
          />
          <Picker
            selectedValue={newTask.周期単位}
            onValueChange={value => handleNewTaskInput('周期単位', value)}>
            <Picker.Item value="日" label="日" />
            <Picker.Item value="週" label="週" />
            <Picker.Item value="月" label="月" />
            <Picker.Item value="年" label="年" />
          </Picker>
        </View>
      )}

      <Button title="追加" onPress={addTask} />
    </View>
  );
};

export default TaskInputForm;
