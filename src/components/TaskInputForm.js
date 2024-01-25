import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import React, {useState} from 'react';
import {Input, ButtonGroup, Button} from '@rneui/base';
import {format, parse} from 'date-fns';

const styles = StyleSheet.create({
  inputField: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 0,
    marginRight: 3,
    marginBottom: 6,
    marginLeft: 3,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexContainer: {display: 'flex', flexGrow: 1},
  flexEndContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const TaskInputForm = ({newTask, newLog, updateNewTask, handleTextInput}) => {
  const handle期日input = value => {
    const formattedDate = format(value, 'yyyy-MM-dd');
    updateNewTask('期日', formattedDate);
  };
  const handle時刻input = value => {
    console.log(value);
    const formattedDate = format(value, 'HH:mm');
    updateNewTask('時刻', formattedDate);
  };

  const [isOpen期日, setIsOpen期日] = useState(false);
  const [isOpen時刻, setIsOpen時刻] = useState(false);
  return (
    <View style={{...styles.inputField, ...styles.flexGrow}}>
      <View style={styles.flexContainer}>
        <Input
          style={{...styles.inputField, ...styles.flexGrow}}
          name="text"
          type="text"
          value={newTask.text || newLog.text}
          onChangeText={value => handleTextInput('text', value)}
          placeholder="タスクを入力"
        />
        <ButtonGroup
          buttons={[
            <Button
              title={'期日 ' + newTask.期日}
              onPress={() => setIsOpen期日(prev => !prev)}
            />,
            <Button
              title={'時刻 ' + newTask.時刻}
              onPress={() => setIsOpen時刻(prev => !prev)}
            />,
          ]}
        />
        <DatePicker
          modal
          open={isOpen期日}
          title="期日"
          mode="date"
          date={new Date(newTask.期日)}
          locale="ja"
          onConfirm={value => {
            handle期日input(value);
            setIsOpen期日(false);
          }}
          onCancel={() => setIsOpen期日(false)}
        />
        <DatePicker
          modal
          open={isOpen時刻}
          title="時刻"
          mode="time"
          date={parse(newTask.時刻, 'HH:mm', new Date())}
          locale="ja"
          is24hourSource="locale"
          onConfirm={value => {
            handle時刻input(value);
            setIsOpen時刻(false);
          }}
          onCancel={() => setIsOpen時刻(false)}
        />
      </View>
      <Picker
        style={styles.inputField}
        name="is周期的"
        selectedValue={newTask.is周期的}
        onValueChange={(value, index) => updateNewTask('is周期的', value)}>
        <Picker.Item value="周期なし" label="周期なし" />
        <Picker.Item value="完了後に追加" label="完了後にタスクを追加" />
        <Picker.Item value="必ず追加" label="必ず追加" />
      </Picker>
      <Input
        style={styles.inputField}
        name="周期日数"
        keyboardType="numeric"
        value={newTask.周期日数}
        onChangeText={value => updateNewTask('周期日数', value)}
        disabled={newTask.is周期的 === '周期なし'}
      />
      <ButtonGroup
        buttons={['日', '週', '月', '年']}
        selectedIndex={newTask.周期単位}
        style={styles.inputField}
        name="周期単位"
        value={newTask.周期単位}
        onPress={value => updateNewTask('周期単位', value)}
        disabled={newTask.is周期的 === '周期なし'}
      />
    </View>
  );
};

export default TaskInputForm;
