import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Button } from 'react-native';
import PullUp, { BottomSheetState } from 'react-native-pull-ups';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

function PullUpContent() {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 32,
        height: 200,
        backgroundColor: '#f0f',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      <TouchableOpacity style={{ flex: 1, backgroundColor: '#0ff' }} />
      <TouchableOpacity style={{ flex: 1, backgroundColor: '#0f0' }} />
      <TouchableOpacity style={{ flex: 1, backgroundColor: '#00f' }} />
      <TouchableOpacity style={{ flex: 1, backgroundColor: '#ff0' }} />
    </View>
  );
}

function ContentView() {
  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>(
    'collapsed'
  );

  const renderBackground = () =>
    new Array(100)
      .fill('')
      .map((_, i) => <Text key={`bg-${i}`}>Background {i}</Text>);

  const onSheetChanged = useCallback((newState: BottomSheetState) => {
    console.log(newState);
    setBottomSheetState(newState);
  }, []);

  const onPress = useCallback(() => {
    const target = bottomSheetState === 'hidden' ? 'expanded' : 'hidden';
    setBottomSheetState(target);
  }, [bottomSheetState]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Button title="Toggle" onPress={onPress} />
        {renderBackground()}
        <TouchableOpacity
          style={{ width: '100%', height: 200, backgroundColor: 'green' }}
        />
      </ScrollView>
      <View style={{ bottom: 0, height: 64, backgroundColor: 'orange' }} />
      <PullUp
        modal
        state={bottomSheetState}
        peekHeight={120}
        collapsible={true}
        onRequestClose={() => setBottomSheetState('hidden')}
        onSheetStateChanged={onSheetChanged}
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
