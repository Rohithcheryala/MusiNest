import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import TrackOptions from "@/components/TrackOptions";
import TrackPlayer, {
  Track,
  usePlaybackState,
  useProgress,
  RepeatMode,
  State,
  PlaybackState,
} from "react-native-track-player";
import MusicInfo from "@/lib/MusicInfo";
import Slider from "@react-native-community/slider";
import { Slider as JsSlider } from "@miblanchard/react-native-slider";
import { getSongDataById, toggleLikedTrack } from "@/lib/db";
import { SongData } from "@/lib/types";
import { MovingText } from "@/components/MovingText";

interface PlayerScreenProps {
  isVisible: boolean;
  onClose: () => void;
  currentTrack: Track;
}

const PlayerScreen: React.FC<PlayerScreenProps> = ({
  isVisible,
  onClose,
  currentTrack,
}) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [pictureData, setPictureData] = useState<string>();
  const [trackData, setTrackData] = useState<SongData>();
  const [isLikedToggled, setIsLikedToggled] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState<boolean>(false);

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
      <SafeAreaProvider className="flex-1 bg-[#0F0F0F]">
        {/* <View className="flex-1 w-full bg-[#0F0F0F]"> */}
        <TopShelf onClose={onClose} setIsOptionsVisible={setIsOptionsVisible} />
        <View className="flex-1 p-6 ">
          <SongDetails currentTrack={currentTrack} />
          <PlayerSlider />
          <PlayerControls currentSong={trackData} />
        </View>
        {/* </View> */}
      </SafeAreaProvider>
      {isOptionsVisible && (
        <TrackOptions
          isVisible={isOptionsVisible}
          onClose={() => setIsOptionsVisible(false)}
          track={trackData}
        />
      )}
    </Modal>
  );
};

export default PlayerScreen;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const PlayerSlider = () => {
  const progress = useProgress();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seek, setSeek] = useState(0);

  const handleValueChange = (value: number[]) => {
    // console.log(`val -> ${value}`);
    setIsSeeking(true);
    setSeek(value[0]);
  };

  const handleSlidingComplete = (value: number[]) => {
    setIsSeeking(false);
    TrackPlayer.seekTo(value[0]);
  };

  useEffect(() => {
    setIsSeeking(false);
  }, [progress.position]);

  return (
    <View className="w-full">
      <View className="py-2 ">
        <View className="h-5">
          <JsSlider
            containerStyle={{ flex: 1 /* height: 40 */ }}
            trackStyle={{
              padding: 0,
              backgroundColor: "white",
              // marginHorizontal: 10,
              // borderCurve: "circular",
              // borderRadius: 4,
            }}
            thumbStyle={{
              height: 10,
              width: 10,
              // borderCurve: "circular",
              // borderRadius: 100,
              // translateY: 6,
            }}
            value={isSeeking ? seek : progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            onValueChange={handleValueChange}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor="#800080" // Purple color
            // maximumTrackTintColor="#ffffff" // White color
            thumbTintColor="#1DB954"
            // thumbTouchSize={{ width: 40, height: 40 }}
          />
        </View>
        <View className="flex flex-row  w-full items-center justify-between ">
          <Text className="text-white text-sm">
            {formatTime(isSeeking ? seek : progress.position)}
          </Text>

          <Text className="text-white text-sm">
            {formatTime(progress.duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const PlayerControls = ({ currentSong }: { currentSong: SongData }) => {
  const playbackState: PlaybackState = usePlaybackState() as PlaybackState;
  const [currentPlaybackState, setCurrentPlaybackState] = useState<
    State | undefined
  >(playbackState.state);
  const [isLikedToggled, setIsLikedToggled] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState<boolean>(false);

  useEffect(() => {
    if (
      playbackState.state !== undefined &&
      playbackState.state !== State.Buffering &&
      playbackState.state !== State.Ready &&
      playbackState.state !== State.Loading
    ) {
      setCurrentPlaybackState(playbackState.state);
    }
  }, [playbackState.state]);

  const previousTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const play = async () => {
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const nextTrack = async () => {
    await TrackPlayer.skipToNext();
  };

  const toggleRepeatMode = () => {
    setIsRepeatMode(!isRepeatMode); // Toggle repeat mode
    if (isRepeatMode) {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
    } else {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
    }
  };

  const handleLikedTracks = async (id: string) => {
    await toggleLikedTrack(id);
    setIsLikedToggled((prev) => !prev); // Toggle the state to trigger useEffect
  };

  return (
    <View className="flex flex-row justify-between items-center py-2 w-full">
      {/* replay */}
      <TouchableOpacity className="p-1" onPress={toggleRepeatMode}>
        <MaterialCommunityIcons
          name={isRepeatMode ? "repeat-off" : "repeat"}
          size={40}
          color={isRepeatMode ? "#1DB954" : "white"}
        />
      </TouchableOpacity>

      {/* previous */}
      <TouchableOpacity className="p-1" onPress={previousTrack}>
        <FontAwesome6 name="backward" size={40} color="white" />
      </TouchableOpacity>

      {/* play/pause */}
      <TouchableOpacity
        onPress={currentPlaybackState === State.Playing ? pause : play}
        className="p-1 px-3"
      >
        <FontAwesome6
          name={currentPlaybackState === State.Playing ? "pause" : "play"}
          size={60}
          color="white"
        />
      </TouchableOpacity>

      {/* next */}
      <TouchableOpacity onPress={nextTrack} className="p-1">
        <FontAwesome6 name="forward" size={40} color="white" />
      </TouchableOpacity>

      {/* liked */}
      <TouchableOpacity
        className="p-1"
        onPress={() => handleLikedTracks(currentSong.id)}
      >
        {currentSong.isLiked ? (
          <FontAwesome name="heart" size={40} color="red" />
        ) : (
          <FontAwesome name="heart-o" size={40} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

function SongDetails({ currentTrack }: { currentTrack: Track }) {
  return (
    <View className="w-full overflow-hidden rounded-xl  justify-center mb-6">
      <View className="mx-auto py-6">
        <Image
          source={{ uri: currentTrack.artwork }}
          style={{
            width: "100%",
            // height: "100%",
            aspectRatio: 1,
            borderRadius: 20,
            backgroundColor: "white",
          }}
          alt="Album Art"
          resizeMode="stretch"
        />
      </View>

      <View className="flex flex-row justify-between">
        <View className="">
          <Text className="text-xl font-bold text-white">
            {currentTrack?.title?.replace(".mp3", "") ||
              currentTrack?.filename.replace(".mp3", "") ||
              ""}
          </Text>
          <Text
            className="text-white text-base mt-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentTrack?.artist}
          </Text>
        </View>
        <View>
          {/* add to playlist button */}
          <TouchableOpacity onPress={() => {}} className="p-1 px-3">
            <FontAwesome6 name={"play"} size={60} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function TopShelf({
  onClose,
  setIsOptionsVisible,
}: {
  onClose: () => void;
  setIsOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View className="flex-row justify-between  items-center p-4 ">
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="chevron-down" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsOptionsVisible(true)}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
