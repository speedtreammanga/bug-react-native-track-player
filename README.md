# App example using react-native-track-player

Project generated using `npx create-expo-app@latest --example with-video-background`.

Tiny repo to illustrate and reproduce issues with the `react-native-track-player` library.

**Tested using iOS device (iPhone)**

## How to use

- Install: `npm install`
- Run: `npm run ios`
- Open XCode, and build/run selecting your iPhone device

## Defects

1. TrackPlayer.load does not accept Track with `artwork` of type `ResourceObject`, it only expects a `string`.

```ts
// NOTE: using `artwork: require(...)` on .load causes a crash.
// OK method:
await TrackPlayer.add({
  ...track1,
  artwork: require("./assets/artwork.jpeg"), // using `require` in `add` works fine.
});
// ERROR method:
await TrackPlayer.load({
  ...track1,
  artwork: require("./assets/artwork.jpeg"), // using `require` in `load` causes a crash
});
```

2. Playing a track with property `isLiveStream: true` for the first time does not activate the Control Center play/pause buttons.
   Steps to reproduce:

   NOTE: this is not a consistent way of reproducing the error, sometime it works and some times it does not. Hard to pin point at this point...

- Force close the app if it was open, and re-open it.
- Press the `Play as Track` button, when looking at your Control Center, the "pause" button should be enabled (as expected).
- Force close the app if it was open, and re-open it.
- Press the `Play as Live` button, when looking at your Control Center, the "pause" or "play" button should be Disabled (!!). <-- something is fishy here
- Uncomment `line 113` and save, force close the app if it was open, and re-open it.
- Press the `Play as Live` button, when looking at your Control Center, the "pause" button should be Enabled (!!). <-- why is "pre-loading" a track making the next "run as Live" enable the Control Center?
