/* eslint-disable linebreak-style */
import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import Header from './components/Header.js';

import LogList from './components/Log/LogList.tsx';
import TaskList from './components/Task/TaskList.tsx';
import InputForms from './components/InputForms/InputForms.tsx';

function App() {
  const styles = StyleSheet.create({
    app: {
      fontFamily: 'Noto Sans JP',
      textAlign: 'center',
      padding: 0,
    },
    content: {paddingHorizontal: 30},
  });

  return (
    <ScrollView style={styles.app}>
      <Header />
      <View style={styles.content}>
        <InputForms />

        <LogList />
        <TaskList />
      </View>
    </ScrollView>
  );
}

export default App;
