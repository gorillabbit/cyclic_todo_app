import React from 'react';
import {format} from 'date-fns';
import {View, Text} from 'react-native';

const TaskDetails = ({task}) => {
  // 完了タイムスタンプのフォーマット
  const completionTimestamp =
    task.completed && task.toggleCompletionTimestamp
      ? format(task.toggleCompletionTimestamp.toDate(), 'yyyy-MM-dd HH:mm')
      : null;

  return (
    <View className="task-details">
      {task.completed && <Text>済 {completionTimestamp}</Text>}
    </View>
  );
};

export default TaskDetails;
