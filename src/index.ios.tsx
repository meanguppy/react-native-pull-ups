import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  processColor,
  requireNativeComponent,
  type ColorValue,
  type HostComponent,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';
import type {
  IOSStyling,
  PullUpProps,
  SheetState,
} from './types';

/* Props for Native iOS component.
 * Not to be confused with the main component. */
interface NativeProps extends ViewProps {
  state: SheetState;
  collapsedHeight?: number;
  maxSheetWidth?: number;
  modal?: boolean;
  hideable?: boolean;
  tapToDismissModal?: boolean;
  useSafeArea?: boolean;
  overlayColor?: ColorValue;
  overlayOpacity?: number;
  onStateChanged: (evt: NativeSyntheticEvent<{ state: SheetState }>) => void;
  iosStyling?: IOSStyling;
}

const NativePullUp: HostComponent<NativeProps> = requireNativeComponent(
  'RNPullUpView'
);

const styles = StyleSheet.create({
  primary: {
    position: 'absolute',
    left: -1000000,
  },
  sheet: {
    flex: 1,
    backgroundColor: 'white',
    // emulate FittedSheets cornerRadius, for better customization
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});

function extractIosStyling(style: ViewProps['style']): IOSStyling {
  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    backgroundColor,
  } = StyleSheet.flatten(style);
  const cornerRadius = borderTopLeftRadius ?? borderTopRightRadius ?? borderRadius ?? 0;
  if (typeof cornerRadius !== 'number') throw Error('Border radius must be of type number');
  return {
    cornerRadius,
    contentBackgroundColor: backgroundColor ?? 'transparent',
  };
}

function processColors(config: IOSStyling) {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(config)) {
    result[key] = key.endsWith('Color')
      ? processColor(val as ColorValue)
      : val;
  }
  return result;
}

const PullUp = (props: PullUpProps) => {
  const {
    collapsedHeight = 0,
    maxSheetWidth = 0,
    modal = false,
    hideable = true,
    dismissable = true,
    tapToDismissModal = true,
    useSafeArea = true,
    overlayColor = 'black',
    overlayOpacity = 0.5,
    onStateChanged,
    iosStyling,
    children,
    style,
    ...rest
  } = props;

  const onNativeStateChanged = useCallback(
    (evt: NativeSyntheticEvent<{ state: SheetState }>) => {
      onStateChanged?.(evt.nativeEvent.state);
    },
    [onStateChanged]
  );

  const finalStyle = [styles.sheet, style];
  const finalIosStyling = processColors({
    ...extractIosStyling(finalStyle),
    ...iosStyling,
  });

  return (
    <NativePullUp
      {...rest}
      collapsedHeight={collapsedHeight}
      maxSheetWidth={maxSheetWidth}
      hideable={hideable && (!modal || dismissable)}
      tapToDismissModal={dismissable && tapToDismissModal}
      useSafeArea={useSafeArea}
      overlayColor={overlayColor}
      overlayOpacity={overlayOpacity}
      style={styles.primary}
      iosStyling={finalIosStyling}
      onStateChanged={onNativeStateChanged}
    >
      <View collapsable={false} style={finalStyle}>
        {children}
      </View>
    </NativePullUp>
  );
};

export default PullUp;
export type { PullUpProps, SheetState };
