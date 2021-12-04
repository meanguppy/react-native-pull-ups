import type { ViewStyle, ColorValue } from 'react-native';
import PropTypes from 'prop-types';

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

export const PullUpPropTypes = {
  state: PropTypes.oneOf(['hidden', 'collapsed', 'expanded']).isRequired,
  collapsedHeight: PropTypes.number,
  maxSheetWidth: PropTypes.number,
  modal: PropTypes.bool,
  hideable: PropTypes.bool,
  dismissable: PropTypes.bool,
  tapToDismissModal: PropTypes.bool,
  useSafeArea: PropTypes.bool,
  onStateChanged: PropTypes.func,
  overlayOpacity: PropTypes.number,
  iosStyling: PropTypes.object,
};

export const PullUpDefaultProps = {
  modal: false,
  hideable: true,
  dismissable: true,
  tapToDismissModal: true,
  useSafeArea: true,
  overlayColor: 'black',
  overlayOpacity: 0.5,
};
