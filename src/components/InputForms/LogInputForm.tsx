//import "../App.css";
import {View, Switch, Text, Button, Alert} from 'react-native';
import {Input} from '@rneui/base';
import React, {useState} from 'react';
import {addDocLog} from '../../firebase';
import {Log as LogType} from '../../types.js';

const defaultNewLog: LogType = {
  text: '',
  interval: false,
  duration: false,
  availableMemo: false,
  availableVoiceAnnounce: false,
};

const LogInputForm = ({}) => {
  const [newLog, setNewLog] = useState<LogType>(defaultNewLog);

  const handleNewLogInput = (name: string, value) => {
    if (name === 'intervalNum' && parseInt(value, 10) <= 0) {
      Alert.alert('0以下は入力できません。');
      return;
    }
    setNewLog(prev => ({...prev, [name]: value}));
  };

  const addLog = () => {
    if (newLog) {
      addDocLog(newLog);
      setNewLog(defaultNewLog);
    }
  };
  return (
    <View>
      <Input
        value={newLog.text}
        onChangeText={value => handleNewLogInput('text', value)}
        placeholder="記録を入力"
      />
      <Text>スパン</Text>
      <Switch
        value={newLog.interval}
        onValueChange={value => handleNewLogInput('interval', value)}
      />
      <Button title="追加" onPress={addLog} />
    </View>
  );
};

export default LogInputForm;
