import type { ViewStyle } from 'react-native';
import PropTypes from 'prop-types';

export type SheetState = 'hidden' | 'collapsed' | 'expanded';

export type IOSStyling = {
  pullBarHeight?: number;
  presentingViewCornerRadius?: number;
  shouldExtendBackground?: boolean;
  useFullScreenMode?: boolean;
  shrinkPresentingViewController?: boolean;
  gripSize?: { width: number; height: number };
  gripColor?: string;
  cornerRadius?: number;
  minimumSpaceAbovePullBar?: number;
  pullBarBackgroundColor?: string;
  treatPullBarAsClear?: boolean;
  allowPullingPastMaxHeight?: boolean;
  contentBackgroundColor?: string;
  overlayColor?: string;
};

export type PullUpProps = {
  state: SheetState;
  collapsedHeight?: number;
  maxSheetWidth?: number;
  modal?: boolean;
  hideable?: boolean;
  dismissable?: boolean;
  tapToDismissModal?: boolean;
  onStateChanged: (newState: SheetState) => void;
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
  onStateChanged: PropTypes.func,
  iosStyling: PropTypes.object,
  style: PropTypes.object,
};

export const PullUpDefaultProps = {
  modal: false,
  hideable: true,
  dismissable: true,
  tapToDismissModal: true,
};
