import PullUp from './PullUp';

export type SheetState = 'hidden' | 'collapsed' | 'expanded';

export type PullUpProps = {
  state: SheetState;
  collapsedHeight?: number;
  maxWidth?: number;
  modal?: boolean;
  hideable?: boolean;
  dismissable?: boolean;
  tapToDismissModal?: boolean;
  onStateChanged: (newState: SheetState) => void;
	iosStyling?: object;
	children?: object;
};

export default PullUp;