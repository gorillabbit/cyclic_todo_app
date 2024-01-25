import React from 'react';
import Clock from './Clock.js';
import {View, StyleSheet} from 'react-native';

const style = StyleSheet.create({
  header: {
    backgroundColor: '#4caf50',
    marginBottom: 5,
  },
});

const Header = () => {
  return (
    <View style={style.header}>
      <Clock />
    </View>
  );
};

export default Header;
