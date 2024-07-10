import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
} from "react-native-track-player";

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      // android: {
      //   appKilledPlaybackBehavior:
      //     AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      // },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      // Obviously, color property would not work if artwork is specified. It can be used as a fallback.
      color: 99410543,
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTracks() {
  await TrackPlayer.add([
    {
      id: "1",
      url: require("@/assets/songs/Samajavaragamana.mp3"),
      title: "Fluidity",
      artist: "tobylane",
      duration: 60,
    },
    {
      id: "1",
      url: require("@/assets/songs/Yamunna Thatilo.mp3"),
      title: "Fluidity",
      artist: "tobylane",
      duration: 60,
    },
  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  // TODO: Attach remote event handlers
}
