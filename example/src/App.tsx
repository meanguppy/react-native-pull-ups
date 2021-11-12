import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import PullUp, { BottomSheetState } from 'react-native-pull-ups';

function CoolBeans(){
  const [num, setNum] = useState(10)

  setTimeout(() => {
    if(num !== 12) setNum(12)
  }, 2000)

  return (
    new Array(num)
      .fill('')
      .map((_, i) => <Text key={`content-${i}`}>Content {i+1}</Text>)
  );
}

export default function App() {

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
    <PullUp
      dialog={true}
      state={bottomSheetState}
      onSheetStateChanged={onSheetChanged}
      renderContent={CoolBeans}
      contentStyle={{ backgroundColor: 'red', paddingHorizontal: 16, paddingVertical: 32 }}
      hideable={true}
      collapsible={true}
      //expandedOffset={240}
      peekHeight={200}
    >
      <ScrollView>
        <Button onPress={onPress} title="Toggle" />
        <Button onPress={() => setUseDialog(!useDialog)} title="Toggle dialog" />
        {renderBackground()}
      </ScrollView>
    </PullUp>
  );
}
