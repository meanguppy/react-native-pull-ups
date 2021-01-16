import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import PullUpsViewManager from 'react-native-pull-ups';


export default function App() {
  return (
    <View style={styles.container}>
      <PullUpsViewManager color="#32a852" style={styles.box} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
