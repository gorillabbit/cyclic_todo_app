import {View} from 'react-native';
import React, {useState} from 'react';
import {ButtonGroup} from '@rneui/base';

const ToggleButtons = ({isTask, setIsTask}) => {
  const [selectedIndex, setSelectedIndex] = useState(isTask ? 0 : 1);
  const handleToggleChange = index => {
    index === 0 ? setIsTask(true) : setIsTask(false);
    setSelectedIndex(index);
  };
  return (
    <View>
      <ButtonGroup
        buttons={['タスク', 'ログ']}
        onPress={index => handleToggleChange(index)}
        selectedIndex={selectedIndex}
      />
    </View>
  );
};

export default ToggleButtons;
