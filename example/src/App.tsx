import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import PullUp, { BottomSheetState } from 'react-native-pull-ups';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

function CoolBeans(){
  const [num, setNum] = useState(10)

  setTimeout(() => {
    if(num !== 12) setNum(12)
  }, 2000)

  return <View style={{ paddingHorizontal: 16, paddingVertical: 32, backgroundColor: '#f0f', flexDirection: 'row', height: 250, justifyContent: 'center', alignItems: 'stretch' }}>
    <TouchableOpacity style={{ flex: 1, backgroundColor: '#0ff' }}/>
    <TouchableOpacity style={{ flex: 1, backgroundColor: '#0f0' }}/>
    <TouchableOpacity style={{ flex: 1, backgroundColor: '#00f' }}/>
    <TouchableOpacity style={{ flex: 1, backgroundColor: '#ff0' }}/>
  </View>
}

function FooterThing(){
  const [num, setNum] = useState(48)

  setTimeout(() => {
    if(num !== 120) setNum(120)
  }, 2000)

  return (
    <View style={{ bottom: 0, height: num, backgroundColor: 'yellow' }}/>
  );
}

function ContentView(){

  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>(
    'collapsed'
  );
  const [useDialog, setUseDialog] = useState<Boolean>(false);

  const renderBackground = () =>
    new Array(100)
      .fill('')
      .map((_, i) => <Text key={`bg-${i}`}>Background {i}</Text>);

  const onSheetChanged = useCallback((newState: BottomSheetState) => {
    console.log(newState);
    setBottomSheetState(newState);
  }, []);

  const onPress = useCallback(() => {
    const target = bottomSheetState === 'hidden' ? 'collapsed' : 'hidden';
    setBottomSheetState(target);
  }, [bottomSheetState]);

  return (
    <View>
      <ScrollView>
        <Button onPress={onPress} title="Toggle" />
        <Button onPress={() => setUseDialog(!useDialog)} title="Toggle dialog" />
        {renderBackground()}
      </ScrollView>
      <FooterThing />
      <PullUp
        transparent
        visible={useDialog}
        onRequestClose={() => setUseDialog(false)}>
        <CoolBeans/>
      </PullUp>
    </View>
  );
}


const AppNavigator = createStackNavigator({
  Home: { screen: ContentView },
});
const AppContainer = createAppContainer(AppNavigator);

export default function App() {

  return (
    <AppContainer/>
  );
}
