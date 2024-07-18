import * as MediaLibrary from "expo-media-library";
import TrackPlayer from "react-native-track-player";
import { SongData } from "./types";

export const addTracksToQueue = async (
  tracks: SongData[],
  selectedTrackIndex: number,
  idType?: string
) => {
  await TrackPlayer.reset();
  const trackQueue = tracks.map((track) => ({
    id: idType === "id" ? track._index : track.id,
    url: track.url,
    title: track.filename,
  }));

  await TrackPlayer.add(trackQueue);
  await TrackPlayer.skip(selectedTrackIndex);
  await TrackPlayer.play();
};

export const shuffleTracks = (tracks: SongData[]) => {
  const shuffledArray = [...tracks];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
