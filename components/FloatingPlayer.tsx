import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { FontAwesome6 } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { getSongDataById } from "@/lib/db";
import { SongData } from "@/lib/types";
import PlayerScreen from "./Player";

export const FloatingPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>();
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [data, setData] = useState<SongData | undefined | null>();

  const playbackState = usePlaybackState();
  const progress = useProgress();

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    const track = await TrackPlayer.getActiveTrack();
    setCurrentTrack(track);
    console.log(track);
  });

  // console.log("currrrrent track: ", currentTrack);

  const play = async () => {
    try {
      await TrackPlayer.play();
      console.log("Playing track");
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const pause = async () => {
    try {
      await TrackPlayer.pause();
      console.log("Pausing track");
    } catch (error) {
      console.error("Error pausing track:", error);
    }
  };

  const nextTrack = async () => {
    try {
      await TrackPlayer.skipToNext();
      console.log("Skipping to next track");
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  };

  const previousTrack = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      console.log("Skipping to previous track");
    } catch (error) {
      console.error("Error skipping to previous track:", error);
    }
  };

  const getData = async () => {
    // console.log("current track: ", currentTrack?.title);
    if (currentTrack && currentTrack.title && currentTrack.id) {
      console.log("in get Data", currentTrack.title);
      const songId = `${currentTrack.title
        .replace(/\s+/g, "_")
        .replace(".mp3", "")}${currentTrack.id}`;

      console.log(songId);

      const songData: SongData | undefined | null = await getSongDataById(
        songId
      );
      if (!songData) {
        const songData: SongData | undefined | null = await getSongDataById(
          currentTrack.id
        );
        setData(songData);
      } else {
        setData(songData); // Set the fetched song data
      }
    } else {
      console.log("no track data");
    }
  };
  useEffect(() => {
    getData();
    // console.log(data);
    // setData(data);
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <View>
      <View className="position-absolute bottom-0 w-full bg-[#282C35] rounded-xl p-4">
        <TouchableOpacity onPress={() => setIsPlayerVisible(true)}>
          <View className="flex flex-row items-center">
            <View className="flex-none">
              {data?.artwork ? (
                <Image
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                  source={{ uri: data.artwork }}
                  alt="Album Art"
                />
              ) : (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: "white",
                  }}
                  source={require("@/assets/images/react-logo.png")}
                  alt="Album Art"
                />
              )}
            </View>
            <View className="w-1/4 flex-grow ml-4">
              <Text
                className="text-white"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentTrack?.title?.replace(".mp3", "") || "Unknown"}
              </Text>
              <Text
                className="text-gray-400"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {data?.artist || "Unknown"}
              </Text>
            </View>
            <View className="flex flex-row justify-between ml-auto">
              <TouchableOpacity onPress={previousTrack} className="mr-3">
                <FontAwesome6 name="backward" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={playbackState.state === "playing" ? pause : play}
                className="mr-3"
              >
                <FontAwesome6
                  name={playbackState.state === "playing" ? "pause" : "play"}
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={nextTrack}>
                <FontAwesome6 name="forward" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <PlayerScreen
          isVisible={isPlayerVisible}
          onClose={() => setIsPlayerVisible(false)}
          currentTrack={currentTrack}
        />
      </View>
      {/* <View className="w-[100%] m-0 p-0">
        <Slider
          style={{ flex: 1, width: "100%", marginTop: 0 }}
          minimumValue={0}
          disabled
          maximumValue={progress.duration}
          value={sliderValue}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#ffffff"
          thumbTintColor="#1DB954"
          onValueChange={handleSliderChange}
          onSlidingStart={handleSliderStart}
          onSlidingComplete={handleSliderComplete}
        />
      </View> */}
    </View>
  );
};
