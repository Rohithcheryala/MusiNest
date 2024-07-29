import { SongData } from "./types";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
} from "react-native-track-player";

export async function SetupTrackPlayer() {
  try {
    await TrackPlayer.getActiveTrackIndex();
    return true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        alwaysPauseOnInterruption: true,
      },
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
  }
  return true;
}

export const setQueue = (
  songIds: string[] | null,
  songsMetadata: SongData[] | null
) => {
  TrackPlayer.reset();
  if (songsMetadata) {
    TrackPlayer.add(songsMetadata);
  }
};
