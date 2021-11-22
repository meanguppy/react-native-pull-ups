import React, { useCallback, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PullUp, { SheetState } from 'react-native-pull-ups';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  layout: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  content: {
    height: 200,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  footer: {
    bottom: 0,
    height: 64,
    padding: 12,
    backgroundColor: 'orange',
  },
  sheet: {
    backgroundColor: '#f0f',
    // by default, iOS has top border radius 20,
    // and Android has none.
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  button1: { flex: 1, backgroundColor: '#0ff' },
  button2: { flex: 1, backgroundColor: '#0f0' },
  button3: { flex: 1, backgroundColor: '#00f' },
  button4: { flex: 1, backgroundColor: '#ff0' },
});

function PullUpContent() {
  return (
    <View style={[styles.layout, styles.content]}>
      <TouchableOpacity style={styles.button1} />
      <TouchableOpacity style={styles.button2} />
      <TouchableOpacity style={styles.button3} />
      <TouchableOpacity style={styles.button4} />
    </View>
  );
}

function ContentView() {
  const [state, setState] = useState<SheetState>('collapsed');
  const [useModal, setUseModal] = useState(false);

  const onSheetChanged = useCallback((newState: SheetState) => {
    console.log('State changed:', newState);
    setState(newState);
  }, []);

  const toggleModalMode = () => {
    if (Platform.OS === 'android' && state !== 'hidden') {
      Alert.alert(
        'Wait!',
        'On Android, the sheet must first be hidden before toggling modal modes.',
        [{ text: 'OK', style: 'cancel' }],
        { cancelable: true }
      );
    } else {
      setUseModal(!useModal);
    }
  };

  return (
    <View style={styles.flex}>
      <ScrollView>
        <Button title="Hidden" onPress={() => setState('hidden')} />
        <Button title="Collapsed" onPress={() => setState('collapsed')} />
        <Button title="Expanded" onPress={() => setState('expanded')} />
        <Button title={`Modal mode: ${useModal}`} onPress={toggleModalMode} />
        {new Array(100).fill('').map((_, i) => (
          <Text key={i}>Background {i}</Text>
        ))}
      </ScrollView>
      <View style={[styles.layout, styles.footer]}>
        <Text>Footer</Text>
      </View>
      <PullUp
        state={state}
        collapsedHeight={120}
        //maxSheetWidth={360}
        modal={useModal}
        hideable={true}
        dismissable={true}
        tapToDismissModal={true}
        onStateChanged={onSheetChanged}
        iosStyling={{ overlayColor: 'rgba(0,0,0,0.5)' }}
        style={styles.sheet}
      >
        <PullUpContent />
      </PullUp>
    </View>
  );
}

const AppNavigator = createStackNavigator({
  Home: { screen: ContentView },
});
const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return <AppContainer />;
}
