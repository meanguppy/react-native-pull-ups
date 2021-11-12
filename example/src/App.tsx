import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import PullUp, { BottomSheetState } from 'react-native-pull-ups';

export default function App() {
  // const [scrollViewIsScrollable, setScrollViewIsScrollable] = useState(true);

  // const handleChange = (evt: OnChangeContext) => {
  //   const { isFullScreen } = evt.nativeEvent;
  //   if (isFullScreen) {
  //     setScrollViewIsScrollable(true);
  //   } else if (!isFullScreen) {
  //     setScrollViewIsScrollable(false);
  //   }
  // };

  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>(
    'collapsed'
  );
  const [useDialog, setUseDialog] = useState<Boolean>(false);

  const renderBackground = () =>
    new Array(100)
      .fill('')
      .map((_, i) => <Text key={`bg-${i}`}>Background {i}</Text>);

  const renderPullUpContent = () =>
    new Array(10)
      .fill('')
      .map((_, i) => <Text key={`content-${i}`}>Content {i}</Text>);

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
      style={{ flex: 1 }}
      dialog={useDialog}
      state={bottomSheetState}
      onSheetStateChanged={onSheetChanged}
      hideable={true}
      collapsible={false}
      //expandedOffset={240}
      peekHeight={200}
    >
      <ScrollView>
        <Button onPress={onPress} title="Toggle" />
        <Button onPress={() => setUseDialog(!useDialog)} title="Toggle dialog" />
        {renderBackground()}
      </ScrollView>
      <View style={{ paddingVertical: 32, paddingHorizontal: 16, backgroundColor: 'red' }}>
        {renderPullUpContent()}
      </View>
    </PullUp>
  );
}
