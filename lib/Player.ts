import TrackPlayer from "react-native-track-player";
import { SongData } from "./types";

export const setQueue = (
  songIds: string[] | null,
  songsMetadata: SongData[] | null
) => {
  TrackPlayer.reset();
  if (songsMetadata) {
    TrackPlayer.add(songsMetadata);
  }
};
