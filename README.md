# react-native-pull-ups

Native Bottom Sheet Implementations for iOS and Android. Toddler approved ©

* iOS: built using [FittedSheets](https://github.com/gordontucker/FittedSheets). Credit for this module goes to this guy!
* Android: built using [Material design's bottom sheet](https://material.io/components/sheets-bottom) via [BottomSheetBehavior](https://developer.android.com/reference/com/google/android/material/bottomsheet/BottomSheetBehavior).

## Installation

```sh
npm install react-native-pull-ups
```

You'll need to update your Podfile to be targeting _at least iOS 11_.

```sh
platform :ios, '11.0'
```

Lastly, install the Pods to install iOS dependencies.

```sh
npx pod-install
```

## Usage

### Overview

* The sheet can be in one of three different states:
  * `expanded`: The sheet is fully expanded, and all content is visible.
  * `collapsed`: The sheet is visible, but only partially. This is defined by `collapsedHeight`, and is optional.
  * `hidden`: The sheet is out of view. Bring it into view by setting the state programmatically. To prevent users from hiding the view, set `hideable={false}`.
* The intrinsic height of the content placed in the sheet represents the height of the `expanded` state.
* When the sheet state is changed, the `onStateChanged(newState: 'expanded' | 'collapsed' | 'hidden')` event is fired. Generally, you will want to synchronize the state of your component with the value passed here.
* The sheet can be presented in two modes: persistent and modal.

### Importing

Import the component from `react-native-pull-ups`:

```javascript
import PullUp from 'react-native-pull-ups';
```

### Persistent mode

A persistent `PullUp` is rendered within a parent container. It is always rendered inline, which means that the sheet cannot be expanded outside of the parent view. The background view is able to receive touch events at all times.

```javascript
<View style={{ flex: 1 }}>
  { backgroundContent }
  <PullUp
    state={state}
    collapsedHeight={120}
    onStateChanged={(newState) => setState(newState)}
  >
    { sheetContent }
  </PullUp>
</View>
```

Note: Content rendered in a persistent sheet is mounted even when the sheet is hidden. This means that your component state will be persisted. If you prefer the content be re-mounted every time, conditionally render its children.

### Modal mode

A modal `PullUp` can be rendered anywhere, just like the [React-Native Modal](https://reactnative.dev/docs/modal). When presented in this manner, the background becomes dimmed and cannot receive touch events. To dismiss the modal, swipe the sheet down, tap the overlay, or press the back button. Alternatively, set `dismissable={false}` to only allow the modal to be closed programmatically through `state="hidden"`.

```javascript
  <PullUp
    modal
    state={state}
    onStateChanged={(newState) => setState(newState)}
  >
    { sheetContent }
  </PullUp>
```

Note: Content rendered in a modal sheet is only mounted when the sheet is expanded. This means that your component state will not be persisted.

### Props

- [`state`](#state)
- [`collapsedHeight`](#collapsedHeight)
- [`maxSheetWidth`](#maxSheetWidth)
- [`modal`](#modal)
- [`hideable`](#hideable)
- [`dismissable`](#dismissable)
- [`tapToDismissModal`](#tapToDismissModal)
- [`useSafeArea`](#useSafeArea)
- [`onStateChanged`](#onStateChanged)
- [`overlayColor`](#overlayColor)
- [`overlayOpacity`](#overlayOpacity)
- [`iosStyling`](#iosStyling)
- [`style`](#style)

---

# Reference

## Props

### `state`

The current state of the sheet.


| Type                                              | Required |
| --------------------------------------------------- | ---------- |
| SheetState: "hidden" \| "collapsed" \| "expanded" | Yes      |

---

### `collapsedHeight`

Enables the `collapsed` state by defining a height in `px`. This value determines how much of the sheet's content is visible when collapsed.


| Type   | Required |
| -------- | ---------- |
| number | No       |

---

### `maxSheetWidth`

The maximum width of the sheet. Generally used for visual appeal on larger screens.


| Type   | Required |
| -------- | ---------- |
| number | No       |

---

### `modal`

Enables modal mode. If `false`, the persistent inline mode is used.


| Type | Default |
| ------ | --------- |
| bool | `false` |

---

### `hideable`

Allows the user to hide the sheet by swiping/dragging down. Note that the sheet can always be hidden by setting `state` to `hidden`, regardless of this value.


| Type | Default |
| ------ | --------- |
| bool | `true`  |

---

### `dismissable`

(Modal mode only): whether the modal can be dismissed by the user. If `false`, the modal can only be dismissed by setting `state` to `hidden`.


| Type | Default |
| ------ | --------- |
| bool | `true`  |

---

### `tapToDismissModal`

(Modal mode only): whether the modal can be dismissed by tapping the background overlay.


| Type | Default |
| ------ | --------- |
| bool | `true`  |

---

### `useSafeArea`

Automatically applies additional bottom padding to the sheet, if applicable.


| Type | Default | Platform |
| ------ | --------- | ----- |
| bool | `true`  | iOS |

---

### `onStateChanged`

Called when the sheet state is changed.


| Type                           | Required |
| -------------------------------- | ---------- |
| (newState: SheetState) => void | No       |

---

### `overlayColor`

(Modal mode only): the color to use for the background overlay.

| Type   | Default |
| -------- | ---------- |
| [Color](https://reactnative.dev/docs/colors#color-representations) | `"black"` |

---

### `overlayOpacity`

(Modal mode only): the opacity to apply to the background overlay, ranging from `0.0`-`1.0`.

| Type   | Default |
| -------- | ---------- |
| number | 0.5 |

---

### `iosStyling`

A configuration object for customizing various [FittedSheets](https://github.com/gordontucker/FittedSheets) styling options.


| Type   | Required | Platform |
| -------- | ---------- | ---------- |
| object | No       | iOS      |

Object structure:


| Key                            | Type                                                               | Default                    |
| -------------------------------- | -------------------------------------------------------------------- | ---------------------------- |
| pullBarHeight                  | number                                                             | `24`                       |
| presentingViewCornerRadius     | number                                                             | `20`                       |
| shouldExtendBackground         | bool                                                               | `true`                     |
| useFullScreenMode              | bool                                                               | `false`                    |
| shrinkPresentingViewController | bool                                                               | `false`                    |
| gripSize                       | { width: number, height: number }                                  | `{ width: 50, height: 6 }` |
| gripColor                      | [Color](https://reactnative.dev/docs/colors#color-representations) | `#DDDDDD`                  |
| cornerRadius                   | number                                                             | `0`                        |
| minimumSpaceAbovePullBar       | number                                                             | `0`                        |
| pullBarBackgroundColor         | [Color](https://reactnative.dev/docs/colors#color-representations) | `rgba(0,0,0,0)`            |
| treatPullBarAsClear            | bool                                                               | `false`                    |
| allowPullingPastMaxHeight      | bool                                                               | `false`                    |
| contentBackgroundColor         | [Color](https://reactnative.dev/docs/colors#color-representations) | `rgba(0,0,0,0)`            |

Note: By default, `cornerRadius` and `contentBackgroundColor` are not used. Instead, visually identical styles are applied via `style` for a more consistent and familiar behavior. See the [`style`](#style) prop for more information. We leave these exposed because altering other styling options may require them to be tweaked to prevent visual bugs.

---

### `style`

Styles to apply to the sheet content container.


| Type                                                                                                                | Required |
| --------------------------------------------------------------------------------------------------------------------- | ---------- |
| [ViewStyle](https://github.com/facebook/react-native/blob/0.63-stable/Libraries/StyleSheet/StyleSheetTypes.js#L554) | No       |

Default styles:


| Platform | Default style                                                                              |
| ---------- | -------------------------------------------------------------------------------------------- |
| Android  | `{ flex: 1, backgroundColor: 'white' }`                                                    |
| iOS      | `{ flex: 1, backgroundColor: 'white', borderTopRightRadius: 20, borderTopLeftRadius: 20 }` |

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
