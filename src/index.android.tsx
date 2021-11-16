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
  primary: { flex: 1 },
  sheet: { backgroundColor: 'white' },
});

export const PullUpsView = requireNativeComponent('RNPullUpView');

const PullUps = (props: PullUpProps) => {
  const { children, state, onSheetStateChanged, ...rest } = props;

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
      <PullUpsView state={state} style={[ styles.primary, props.style ]}>
        { children }
      </PullUpsView>
  );
};

export default PullUps;