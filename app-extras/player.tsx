import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import TrackOptions from "@/components/TrackOptions";
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  RepeatMode,
} from "react-native-track-player";
import MusicInfo from "@/lib/MusicInfo";
import Slider from "@react-native-community/slider";
import { getSongDataById, toggleLikedTrack } from "@/lib/db";
import { SongData } from "@/lib/types";
import { MovingText } from "@/components/MovingText";

const formatMillisecondsToMinutes = (totalMilliseconds: number) => {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(0).padStart(2, "0");
  return `${minutes.toString().padStart(2, "0")}:${seconds}`;
};

interface PlayerScreenProps {
  isVisible: boolean;
  onClose: () => void;
  currentTrack: SongData;
}

const PlayerScreen: React.FC<PlayerScreenProps> = ({
  isVisible,
  onClose,
  currentTrack,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [pictureData, setPictureData] = useState<string>();
  const [trackData, setTrackData] = useState<SongData>();
  const [isLikedToggled, setIsLikedToggled] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState<boolean>(false);

  const playbackState = usePlaybackState();
  const progress = useProgress();

  const handleLikedTracks = async (id: string) => {
    await toggleLikedTrack(id);
    setIsLikedToggled((prev) => !prev); // Toggle the state to trigger useEffect
  };

  useEffect(() => {
    const getData = async () => {
      if (currentTrack) {
        const songId = `${currentTrack.title
          ?.replace(/\s+/g, "_")
          .replace(".mp3", "")}${currentTrack.id}`;

        const data = await getSongDataById(songId);
        if (!data) {
          const data = await getSongDataById(currentTrack.id);
          setTrackData(data);
        } else {
          setTrackData(data); // Set the fetched song data
        }
      }
    };
    getData();
  }, [currentTrack, isLikedToggled]);

  useEffect(() => {
    const getPictureData = async () => {
      if (currentTrack?.url) {
        const fetchedMetadata = await MusicInfo.getMusicInfoAsync(
          currentTrack.url,
          {
            title: false,
            artist: false,
            album: false,
            genre: false,
            picture: true,
          }
        );
        if (fetchedMetadata?.picture?.pictureData) {
          setPictureData(fetchedMetadata.picture.pictureData);
        }
      }
    };
    getPictureData();
  }, [currentTrack]);

  useEffect(() => {
    if (!isSeeking) {
      setSliderValue(progress.position);
    }
  }, [progress.position]);

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

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSliderComplete = async (value: number) => {
    setIsSeeking(false);
    await TrackPlayer.seekTo(value);
  };

  const handleSliderStart = () => {
    setIsSeeking(true);
  };

  const toggleRepeatMode = () => {
    setIsRepeatMode(!isRepeatMode); // Toggle repeat mode
    if (isRepeatMode) {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
    } else {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
    }
  };

  if (!trackData) {
    return (
      <View>
        <Text className="text-white">Select A Track first</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaProvider className="flex-1">
        <View className="flex-1 w-full bg-[#0F0F0F]">
          <View className="flex-row justify-between items-center p-4 pt-14">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-down" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsOptionsVisible(true)}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 justify-center items-center">
            <View className="w-full h-1/2 overflow-hidden rounded-xl justify-center items-center mb-6">
              {pictureData ? (
                <Image
                  source={{ uri: pictureData }}
                  style={{
                    width: "90%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                  alt="Album Art"
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require("@/assets/images/react-logo.png")}
                  style={{
                    width: "90%",
                    height: "100%",
                    borderRadius: 20,
                    backgroundColor: "white",
                  }}
                  alt="Album Art"
                  resizeMode="contain"
                />
              )}
            </View>
            <View className="w-full flex flex-row justify-between mb-6">
              <View className="w-[10%] flex justify-center items-center">
                <TouchableOpacity onPress={toggleRepeatMode}>
                  <MaterialCommunityIcons
                    name={isRepeatMode ? "repeat-off" : "repeat"}
                    size={30}
                    color={isRepeatMode ? "#1DB954" : "white"}
                  />
                </TouchableOpacity>
              </View>
              <View className="w-[70%] ml-1 overflow-auto pt-4">
                <MovingText
                  text={
                    currentTrack?.title?.replace(".mp3", "") ||
                    currentTrack?.filename.replace(".mp3", "") ||
                    ""
                  }
                  animationThreshold={30}
                  widthFraction={0.7}
                  style={{ color: "white", fontSize: 26 }}
                />
                <Text
                  className="text-white text-base mt-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentTrack?.artist}
                </Text>
              </View>
              <View className="w-[10%] flex justify-center items-center">
                <TouchableOpacity
                  onPress={() => handleLikedTracks(trackData.id)}
                >
                  {trackData?.isLiked ? (
                    <FontAwesome name="heart" size={25} color="white" />
                  ) : (
                    <FontAwesome name="heart-o" size={25} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex flex-row items-center w-3/4 mb-6">
              <Text className="text-white text-xs">
                {formatMillisecondsToMinutes(progress.position * 1000)}
              </Text>
              <Slider
                style={{ flex: 1, marginHorizontal: 10 }}
                minimumValue={0}
                maximumValue={progress.duration}
                value={sliderValue}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#ffffff"
                thumbTintColor="#1DB954"
                onValueChange={handleSliderChange}
                onSlidingStart={handleSliderStart}
                onSlidingComplete={handleSliderComplete}
              />
              <Text className="text-white text-xs">
                {formatMillisecondsToMinutes(progress.duration * 1000)}
              </Text>
            </View>

            <View className="flex flex-row justify-between w-3/4">
              <TouchableOpacity onPress={previousTrack} className="mr-4 p-3">
                <FontAwesome6 name="backward" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={playbackState.state === "playing" ? pause : play}
                className="mx-4  p-3"
              >
                <FontAwesome6
                  name={playbackState.state === "playing" ? "pause" : "play"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={nextTrack} className="ml-4 p-3">
                <FontAwesome6 name="forward" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaProvider>
      {isOptionsVisible && (
        <TrackOptions
          isVisible={isOptionsVisible}
          onClose={() => setIsOptionsVisible(false)}
          track={currentTrack}
        />
      )}
    </Modal>
  );
};

export default PlayerScreen;
