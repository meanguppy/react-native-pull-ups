# react-native-pull-ups

Native Bottom Sheet Implementations for iOS. Toddler approved. © Android is on it's way.

## Installation

```sh
npm install react-native-pull-ups
```

You'll need to update your Podfile to be targeting _at least iOS 11_.
```sh
platform :ios, '11.0'
```

Then, just run the Pod install
```sh
npx pod install
```

## Usage

Import PullUp from `react-native-pull-ups`

```javascript
import PullUp from 'react-native-pull-ups';
```

Add `PullUp` like this:
```javascript
function handleChange (evt) {
  console.log('we changed the size of the pull up! context can be found in nativeEvent', evt.nativeEvent);
}
<View>
  <Text>My Background View</Text>
</View>
<PullUp
  sizes={['30%', '50%', 'fullscreen']}
  onSizeChange={handleChange}>
  <View>
    <Text>Hello World! I live in the pull up. I am toddler approved©</Text>
  </View>
</PullUp>
```

### Props

* [Inherited `View` props...](https://reactnative.dev/docs/view#props)

- [`sizes`](#sizes)
- [`onSizeChange`](#onsizechange)
- [`pullBarHeight`](#pullbarheight)
- [`presentingViewCornerRadius`](#presentingviewcornerradius)
- [`shouldExtendBackground`](#shouldextendbackground)
- [`setIntrensicHeightOnNavigationControllers`](#setintrensicheightonnavigationcontrollers)
- [`useFullScreenMode`](#usefullscreenmode)
- [`shrinkPresentingViewController`](#shrinkpresentingviewcontroller)
- [`useInlineMode`](#useinlinemode)
- [`horizontalPadding`](#horizontalpadding)
- [`maxWidth`](maxwidth)
- [`gripSize`](gripsize)
- [`gripColor`](gripcolor)
- [`cornerRadius`](cornerradius)
- [`minimumSpaceAbovePullBar`](minimumspaceabovepullbar)
- [`pullBarBackgroundColor`](pullbarbackgroundcolor)
- [`treatPullBarAsClear`](treatpullbarasclear)
- [`dismissOnOverlayTap`](dismissonoverlaytap)
- [`dismissOnPull`](dismissonpull)
- [`allowPullingPastMaxHeight`](allowpullingpastmaxheight)
- [`autoAdjustToKeyboard`](autoadjusttokeyboard)
- [`contentBackgroundColor`](contentbackgroundcolor)
- [`overlayColor`](overlaycolor)
- [`allowGestureThroughOverlay`](allowgesturethroughoverlay)

---

# Reference

## Props

### `sizes`

Snap points of the pull up sheet. Can be provided a number of different types of strings.

* Pixel Value: Number of pixels from the bottom of the screen denoted `380px`
* Percentage Value: Percentage of the screen from the bottom denoted `50%`
* Margin from top value: Pixel value from the top of the screen denoted `380^`
* `fullscreen`: Take up the full screen, minus margin defined in [`minimumSpaceAbovePullBar`](minimumspaceabovepullbar).

| Type            | Required |
| --------------- | -------- |
| Array<string>   | Yes      |

---

### `onSizeChange`

Fired when the pull up sheet snaps to a point. Passes through the following things as part of `evt.nativeEvent`:

* `height`: Number of pixels from the bottom of the screen returned as a Number
* `isFullScreen`: If the pull sheet is snapped to fullscreen, this will be `true`.


| Type      | Required | Platform |
| --------- | -------- | -------- |
| function  | No       | iOS      |

---

### `pullBarHeight`

The full height of the pull bar. The presented View will treat this area as a safearea inset on the top.

| Type            | Required | Platform |
| --------------- | -------- | -------- |
| pickerStyleType | No       | iOS      |

---

### `presentingViewCornerRadius`

The corner radius of the shrunken presenting view controller. Is visible when [shrinkPresentingViewController](shrinkpresentingviewcontroller) is `true`.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

---

### `shouldExtendBackground`

Extends the background behind the pull bar or not when the size is fullscreen.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `setIntrensicHeightOnNavigationControllers`

Attempts to use intrensic heights on navigation controllers.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `useFullScreenMode`

Pulls the view controller behind the safe area top.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| bool   | No       | iOS      |

---

### `shrinkPresentingViewController`

Shrinks the presenting view controller, similar to the native modal.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| bool   | No       | iOS      |

---

### `useInlineMode`

Determines if using inline mode or not.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `horizontalPadding`

Adds a padding on the left and right of the sheet with this amount. Defaults to zero (no padding).

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

___

### `maxWidth`

Sets the maximum width allowed for the sheet. This defaults to nil and doesn't limit the width.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

---

### `gripSize`

The size of the grip in the pull bar.

| Type       | Required | Platform |
| ---------- | -------- | -------- |
| [`GripType`](#griptype)   | No       | iOS      |

#### `GripType`

|        | Type     | Required |
| ------ | -------- | -------- |
| width  | number   | Yes      |
| height | number   | Yes      |

---

### `gripColor`

The color of the grip on the pull bar.

| Type       | Required | Platform |
| ---------- | -------- | -------- |
| [Color](https://reactnative.dev/docs/colors#color-representations)      | No       | iOS      |

---

### `cornerRadius`

Sets the corner radius of the sheet.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

---

### `minimumSpaceAbovePullBar`

Minimum distance above the pull bar, prevents bar from coming right up to the edge of the screen.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

---

### `pullBarBackgroundColor`

Set the pullbar's background color.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| [Color](https://reactnative.dev/docs/colors#color-representations)      | No       | iOS      |

---

### `treatPullBarAsClear`

Determine if the rounding should happen on the pullbar or the presented controller only (should only be true when the pull bar's background color is clear).

| Type   | Required | Platform |
| ------ | -------- | -------- |
| boolean| No       | iOS      |

---

### `dismissOnOverlayTap`

Configure the dismiss on background tap functionality.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| boolean| No       | iOS      |

---

### `dismissOnPull`

Configure the dismiss on pull down functionality.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| boolean| No       | iOS      |

---

### `allowPullingPastMaxHeight`

Allow pulling past the maximum height and bounce back.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| boolean| No       | iOS      |

---

### `autoAdjustToKeyboard`

Automatically grow/move the sheet to accomidate the keyboard.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| boolean| No       | iOS      |

---

### `contentBackgroundColor`

Color of the sheet anywhere the child view controller may not show (or is transparent), such as behind the keyboard.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| [Color](https://reactnative.dev/docs/colors#color-representations)      | No       | iOS      |

---

### `overlayColor`

Change the overlay color

| Type   | Required | Platform |
| ------ | -------- | -------- |
| [Color](https://reactnative.dev/docs/colors#color-representations)      | No       | iOS      |

---

### `allowGestureThroughOverlay`

Use this in conjunction with [`useInlineMode`](#useinlinemode) to make a maps-like experience.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| boolean| No       | iOS      |

---


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
