import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, NativeEventEmitter, requireNativeComponent } from 'react-native';

export type BottomSheetState = 'hidden' | 'collapsed' | 'expanded';

interface PullUpProps {
  onSheetStateChanged?: (newState: BottomSheetState) => void;
  hideable?: boolean;
  collapsible?: boolean;
  fitToContents?: boolean;
  halfExpandedRatio?: number;
  expandedOffset?: number;
  peekHeight?: number;
  sheetState?: BottomSheetState;
  style?: object;
  children?: object;
}

const styles = StyleSheet.create({
  primary: { flex: 1 },
  sheet: { backgroundColor: 'white' },
});

export const PullUpsView = requireNativeComponent('RNPullUpView');

const PullUps = (props: PullUpProps) => {
  const { children, renderContent, contentStyle, onSheetStateChanged, ...rest } = props;

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    const subscription = eventEmitter.addListener(
      'BottomSheetStateChange',
      (event) => {
        onSheetStateChanged?.(event);
      }
    );
    return () => subscription.remove();
  }, [onSheetStateChanged]);

  const onLayout = useCallback((evt) => {
    console.log(evt.nativeEvent.layout.height)
    console.log(this.refs)
  })

  return (
    <PullUpsView {...rest} style={[ styles.primary, props.style ]}>
      { children }
      <View style={[ styles.sheet, props.contentStyle ]} onLayout={onLayout}>{ renderContent() }</View>
    </PullUpsView>
  );
};

export default PullUps;
