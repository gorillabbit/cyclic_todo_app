import {View} from 'react-native';
import ToggleButtons from './ToggleButtons';
import TaskInputForm from './TaskInputForm';
import LogInputForm from './LogInputForm';
import React, {useState} from 'react';

const InputForms = () => {
  const [isTask, setIsTask] = useState<boolean>(true);
  return (
    <>
      <ToggleButtons isTask={isTask} setIsTask={setIsTask} />
      <View>{isTask ? <TaskInputForm /> : <LogInputForm />}</View>
    </>
  );
};

export default InputForms;
