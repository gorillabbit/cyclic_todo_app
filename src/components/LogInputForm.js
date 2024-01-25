//import "../App.css";
import {View, Switch, Text} from 'react-native';
import {Input} from '@rneui/base';
import React from 'react';

const LogInputForm = ({
  newTask,
  newLog,
  handleTextInput,
  handleNewLogInput,
}) => {
  return (
    <View>
      <Input
        value={newLog.text || newTask.text}
        onChangeText={value => handleTextInput('text', value)}
        placeholder="記録を入力"
      />
      <Text>スパン</Text>
      <Switch
        value={newLog.interval}
        onValueChange={value => handleNewLogInput('interval', value)}
      />
    </View>
  );
};

export default LogInputForm;
