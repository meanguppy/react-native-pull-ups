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
import PullUp, { type SheetState } from 'react-native-pull-ups';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  break: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
    marginHorizontal: 24,
  },
  content: {
    height: 240,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  header: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  buttons: {
    height: 60,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  button: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 6,
  },
  footer: {
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
});

function PullUpContent() {
  return (
    <>
      <View style={styles.header}>
        <Text>Drag me</Text>
      </View>
      <ScrollView style={styles.content}>
        {new Array(20).fill('').map((_, i) => (
          <Text key={i}>Content {i}</Text>
        ))}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} />
          <TouchableOpacity style={styles.button} />
          <TouchableOpacity style={styles.button} />
          <TouchableOpacity style={styles.button} />
        </View>
      </ScrollView>
    </>
  );
}

function ContentView() {
  const [state, setState] = useState<SheetState>('collapsed');
  const [useModal, setUseModal] = useState(false);
  const [useSafeArea, setUseSafeArea] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(true);
  const [isHideable, setIsHideable] = useState(true);
  const [useFooter, setUseFooter] = useState(true);

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
      <View style={styles.flex}>
        <ScrollView>
          <Button title="Hidden" onPress={() => setState('hidden')} />
          <Button title="Collapsed" onPress={() => setState('collapsed')} />
          <Button title="Expanded" onPress={() => setState('expanded')} />
          <View style={styles.break} />
          <Button
            title={`Collapsible: ${isCollapsible}`}
            onPress={() => setIsCollapsible(!isCollapsible)}
          />
          <Button
            title={`Hideable: ${isHideable}`}
            onPress={() => setIsHideable(!isHideable)}
          />
          <Button title={`Modal mode: ${useModal}`} onPress={toggleModalMode} />
          <Button
            title={`Show footer: ${useFooter}`}
            onPress={() => setUseFooter(!useFooter)}
          />
          {Platform.OS === 'ios' && (
            <Button
              title={`Use SafeArea: ${useSafeArea}`}
              onPress={() => setUseSafeArea(!useSafeArea)}
            />
          )}
          {new Array(50).fill('').map((_, i) => (
            <Text key={i}>Background {i}</Text>
          ))}
        </ScrollView>
        <PullUp
          state={state}
          collapsedHeight={isCollapsible ? 120 : undefined}
          modal={useModal}
          hideable={isHideable}
          dismissable={true}
          tapToDismissModal={true}
          useSafeArea={useSafeArea}
          onStateChanged={onSheetChanged}
          style={styles.sheet}
          iosStyling={{
            pullBarHeight: 12,
            gripSize: { width: 50, height: 5 },
            gripColor: '#eee',
          }}
        >
          <PullUpContent />
        </PullUp>
      </View>
      {useFooter && (
        <View style={styles.footer}>
          <Text>Footer</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return <ContentView />;
}
