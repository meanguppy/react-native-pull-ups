import React, { useEffect } from 'react';
import { NativeEventEmitter, requireNativeComponent } from 'react-native';

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

export const PullUpsView = requireNativeComponent('RNPullUpView');

const PullUps = (props: PullUpProps) => {
  const { onSheetStateChanged } = props;

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

  return <PullUpsView {...props} />;
};

export default PullUps;
