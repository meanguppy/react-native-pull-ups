import React, { useEffect } from 'react';
import { View, Modal, StyleSheet, NativeEventEmitter, requireNativeComponent } from 'react-native';

export type BottomSheetState = 'hidden' | 'collapsed' | 'expanded';

interface PullUpProps {
  onSheetStateChanged?: (newState: BottomSheetState) => void;
  renderContent: () => object;
  hideable?: boolean;
  collapsible?: boolean;
  fitToContents?: boolean;
  halfExpandedRatio?: number;
  expandedOffset?: number;
  peekHeight?: number;
  sheetState?: BottomSheetState;
  style?: object;
  contentStyle?: object;
  children?: object;
}

const styles = StyleSheet.create({
  primary: { position: 'absolute', width: '100%', bottom: 0 },
  sheet: { backgroundColor: 'white' },
});

export const PullUpsView = requireNativeComponent('RNPullUpView');

const PullUps = (props: PullUpProps) => {
  const { children, style, containerStyle, onSheetStateChanged, ...rest } = props;

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

  return (
      <PullUpsView {...rest} style={[ styles.primary, style ]}>
        <View style={[ styles.sheet, containerStyle ]}>
          { children }
        </View>
      </PullUpsView>
  );
};

export default PullUps;