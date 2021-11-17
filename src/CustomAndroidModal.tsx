import { Modal } from 'react-native';

const modalStyle = { backgroundColor: 'transparent' };

/* Warning: Slight hack.
 * The default Modal uses a hard-coded white background for the
 * content wrapper. While the `transparent` prop removes the
 * white background, it also disables the native dimming feature,
 * which we want to keep. No choice but to dive in and fix the
 * styling ourselves!
 */
function fixInnerViewStyling(target) {
  if (!target || !target.props) return;
  const { type, props } = target;
  if (type.displayName === 'View' && props && props.style) {
    props.style.splice(1, 1, modalStyle);
  } else {
    fixInnerViewStyling(target.props.children);
  }
}

export default class CustomModal extends Modal {
  render() {
    const result = super.render();
    fixInnerViewStyling(result);
    return result;
  }
}
