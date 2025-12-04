import type { ViewStyle, ColorValue } from 'react-native';

export type SheetState = 'hidden' | 'collapsed' | 'expanded';

export type IOSStyling = {
  pullBarHeight?: number;
  presentingViewCornerRadius?: number;
  shouldExtendBackground?: boolean;
  useFullScreenMode?: boolean;
  shrinkPresentingViewController?: boolean;
  gripSize?: { width: number; height: number };
  gripColor?: ColorValue;
  cornerRadius?: number;
  minimumSpaceAbovePullBar?: number;
  pullBarBackgroundColor?: ColorValue;
  treatPullBarAsClear?: boolean;
  allowPullingPastMaxHeight?: boolean;
  contentBackgroundColor?: ColorValue;
};

export type PullUpProps = {
  state: SheetState;
  collapsedHeight?: number;
  maxSheetWidth?: number;
  modal?: boolean;
  hideable?: boolean;
  dismissable?: boolean;
  tapToDismissModal?: boolean;
  useSafeArea?: boolean;
  onStateChanged: (newState: SheetState) => void;
  overlayColor?: ColorValue;
  overlayOpacity?: number;
  iosStyling?: IOSStyling;
  style?: ViewStyle;
  children?: React.ReactNode;
};
