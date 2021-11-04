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

  const renderBackground = () =>
    new Array(100)
      .fill('')
      .map((_, i) => <Text key={`bg-${i}`}>Background {i}</Text>);

  const renderPullUpContent = () =>
    new Array(100)
      .fill('')
      .map((_, i) => <Text key={`content-${i}`}>Content {i}</Text>);

  const onSheetChanged = useCallback((newState: BottomSheetState) => {
    setBottomSheetState(newState);
  }, []);

  const onPress = useCallback(() => {
    const target = bottomSheetState === 'hidden' ? 'collapsed' : 'hidden';
    setBottomSheetState(target);
  }, [bottomSheetState]);

  return (
    <PullUp
      sheetState={bottomSheetState}
      onSheetStateChanged={onSheetChanged}
      hideable={true}
      collapsible={true}
      //expandedOffset={240}
      //fitToContents={false}
      //halfExpandedRatio={0.8}
      peekHeight={360}
    >
      <ScrollView>
        <Button onPress={onPress} title="Toggle" />
        {renderBackground()}
      </ScrollView>
      <View style={{ flex: 1, backgroundColor: '#aaa' }}>
        <Text>Testing</Text>
        <ScrollView style={{ height: '100%' }}>
          {renderPullUpContent()}
        </ScrollView>
      </View>
    </PullUp>
  );
}
