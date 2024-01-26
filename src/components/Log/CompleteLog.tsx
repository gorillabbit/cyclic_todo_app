import {format} from 'date-fns';
import React from 'react';
import {Text, View} from 'react-native';

const CompleteLog = ({completeLog}) => {
  return completeLog.timestamp ? (
    <View key={completeLog.id}>
      <Text>{format(completeLog.timestamp.toDate(), 'yyyy-MM-dd HH:mm')}</Text>
    </View>
  ) : (
    <View />
  );
};

export default CompleteLog;
