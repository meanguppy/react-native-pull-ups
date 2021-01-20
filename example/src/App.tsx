import * as React from 'react';
import { useState } from 'react';

import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import PullUp, { OnChangeContext } from 'react-native-pull-ups';

export default function App() {
  const [scrollViewIsScrollable, setScrollViewIsScrollable] = useState(false);

  const handleChange = (evt: OnChangeContext) => {
    const { isFullScreen } = evt.nativeEvent;
    if (isFullScreen) {
      setScrollViewIsScrollable(true);
    } else if (!isFullScreen) {
      setScrollViewIsScrollable(false);
    }
  };

  const renderBackground = () =>
    new Array(100)
      .fill('')
      .map((_, i) => <Text key={`bg-${i}`}>Background</Text>);

  const renderPullUpContent = () =>
    new Array(20)
      .fill('')
      .map((_, i) => <Text key={`content-${i}`}>Content</Text>);

  return (
    <View>
      <SafeAreaView>
        <ScrollView>{renderBackground()}</ScrollView>
      </SafeAreaView>
      <PullUp
        onSizeChange={handleChange}
        pullBarHeight={20}
        presentingViewCornerRadius={10}
        useInlineMode={true}
        show={true}
        sizes={['30%', '50%', 'fullscreen']}
        shrinkPresentingViewController={false}
        allowGestureThroughOverlay={true}
      >
        <SafeAreaView>
          <ScrollView scrollEnabled={scrollViewIsScrollable}>
            {renderPullUpContent()}
          </ScrollView>
        </SafeAreaView>
      </PullUp>
    </View>
  );
}
