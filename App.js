import { Video } from "expo-av";
import { useEffect, useMemo } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TrackPlayer, {
  useIsPlaying,
  Capability,
  RepeatMode,
  AppKilledPlaybackBehavior,
  IOSCategory,
  IOSCategoryOptions,
  IOSCategoryMode,
  PlayerOptions,
  useActiveTrack,
  useProgress,
} from "react-native-track-player";
import Button from "./Button";

TrackPlayer.registerPlaybackService(() => PlaybackServices);

// add event listeners...
async function PlaybackServices() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("remote play()");
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("remote pause()");
    TrackPlayer.pause();
  });
}

let track1 = {
  id: "0000",
  url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Il_Sogno_Del_Marinaio/Live_on_Redundancy_Radio_with_DJ_Disk_Jockey_October_22_2014/Il_Sogno_Del_Marinaio_-_02_-_Partisian_Song.mp3",
  title: "Partisian Song",
  artist: "Il Sogno Del Marinaio",
  artwork:
    "https://freemusicarchive.org/image/?file=images%2Falbums%2FIl_Sogno_Del_Marinaio_-_Live_on_Redundancy_Radio_with_DJ_Disk_Jockey_October_22_2014_-_20141106165548072.jpg&width=290&height=290&type=album",
  isLiveStream: true,
  duration: 3.01,
};

async function setupPlayer(options) {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options);
    } catch (error) {
      if (
        error.includes("player has already been initialized via setupPlayer")
      ) {
        // do nothing
      }
    }
  };
  await setup();
}

export async function SetupPlayer() {
  await setupPlayer({
    iosCategory: IOSCategory.Playback,
    iosCategoryOptions: [
      IOSCategoryOptions.AllowAirPlay,
      IOSCategoryOptions.AllowBluetooth,
      IOSCategoryOptions.DuckOthers,
    ],
    iosCategoryMode: IOSCategoryMode.Default,
  });

  await TrackPlayer.updateOptions({
    capabilities: [Capability.Play, Capability.Pause],
    compactCapabilities: [Capability.Play, Capability.Pause],
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    progressUpdateEventInterval: 500,
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  console.log("SetupPlayer()");
}

async function addTrack() {
  console.log("addTrack() before user presses play");
  // NOTE: using `artwork: require(...)` on .load causes a crash.
  // OK method:
  await TrackPlayer.add({
    ...track1,
    artwork: require("./assets/artwork.jpeg"),
  });
  // ERROR method:
  // await TrackPlayer.load({
  //   ...track1,
  //   artwork: require("./assets/artwork.jpeg"),
  // });
}

export default function App() {
  const opacity = useMemo(() => new Animated.Value(0), []);
  const isPlaying = useIsPlaying();
  const track = useActiveTrack();
  const progress = useProgress(250);

  useEffect(() => {
    async function setup() {
      await SetupPlayer();
      // await addTrack(); // NOTE: Uncomment to load a track before initial user request to play track, loading an initial track before
    }
    setup();
  }, []);

  const handlePlayAsTrackButtonPress = async () => {
    console.log("play as TRACK btn press");
    await TrackPlayer.load({
      ...track1,
      id: "0001",
      isLiveStream: false,
    });
    handleButtonPress();
  };

  const handlePlayAsLiveButtonPress = async () => {
    console.log("play as LIVE btn press");
    await TrackPlayer.load({
      ...track1,
      id: "0002",
      isLiveStream: true,
    });
    handleButtonPress();
  };

  const handleButtonPress = () => {
    isPlaying.playing ? handlePause() : handlePlay();
  };

  const handlePlay = () => {
    console.log("> handlePlay()");
    TrackPlayer.play();
  };

  const handlePause = () => {
    console.log("> handlePause()");
    TrackPlayer.pause();
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Animated.View
          style={[styles.backgroundViewWrapper, { opacity: opacity }]}
        >
          <Video
            isLooping
            isMuted
            positionMillis={500}
            onLoad={() => {
              // https://facebook.github.io/react-native/docs/animated#timing
              Animated.timing(opacity, {
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
            resizeMode="cover"
            shouldPlay
            source={{
              uri: "https://videos.pexels.com/video-files/6549651/6549651-uhd_1440_2560_25fps.mp4",
            }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
      <View style={styles.overlay}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "space-between",
            justifyContent: "space-between",
            // height: "100%",
            padding: 20,
            paddingBottom: 60,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignContent: "center",
              justifyContent: "flex-start",
              marginBottom: 50,
              marginTop: 90,
            }}
          >
            <Image
              src={track1.artwork}
              width={300}
              height={300}
              style={{ margin: "auto", borderRadius: 20, marginBottom: 0 }}
            />
            <Text style={styles.text}>
              {track1.title} - {track1.artist}
            </Text>
            <Text style={styles.text}>
              Mode: {track ? (track.isLiveStream ? "Live" : "Track") : "n/a"}
            </Text>
            <Text style={styles.text}>Id: {track ? track["id"] : "n/a"}</Text>
            <Text style={styles.text}>
              {progress.position.toFixed(2)} : {progress.duration.toFixed(2)}
            </Text>
          </View>
          {!isPlaying.playing && (
            <View
              style={{
                display: "flex",
                gap: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                color={"dark"}
                label={"Play as Track"}
                onPress={handlePlayAsTrackButtonPress}
              />
              <Button
                color={"dark"}
                label={"Play as Live"}
                onPress={handlePlayAsLiveButtonPress}
              />
            </View>
          )}
          {isPlaying.playing && (
            <Button
              color={"light"}
              label={`Pause (${track.isLiveStream ? "Live" : "Track"})`}
              onPress={TrackPlayer.pause}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  backgroundViewWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: {
    color: "white",
    fontSize: 20,
    marginTop: 90,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
