import { SongData } from "@/lib/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TrackOptions from "@/components/TrackOptions";

export const Song = ({
  data,
  onclick,
}: {
  data: SongData;
  onclick: Function;
}) => {
  const [selectedTrack, setSelectedTrack] = useState<SongData>(data);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const handlePress = (data: SongData) => {
    //   setCurrentTrack(data);
    onclick(data);
  };

  const showOptions = () => {
    setSelectedTrack(data);
    setIsModalVisible(true);
  };

  const hideOptions = () => {
    setIsModalVisible(false);
    // setSelectedTrack(undefined);
  };

  return (
    <View className={`shadow-md`}>
      <TouchableOpacity
        onPress={() => handlePress(data)}
        className="p-3 flex-row items-center"
      >
        <View className="flex items-center mr-3">
          <Image
            className="w-14 h-14 rounded-lg"
            // source={{ uri: data.artwork.slice(7) }}
            source={{ uri: data.artwork }}
            // src={data.artwork}
            alt="Album Art"
          />
        </View>
        <View className="flex-1 mr-3">
          <Text
            className="text-white text-lg font-semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.title || data.filename.split(".")[0] || "Unknown Title"}
          </Text>
          <Text
            className="text-gray-400 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.artist || "Unknown Artist"}
          </Text>
          {/* <Text
            className="text-gray-500 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.album || "Unknown Album"}
          </Text> */}
        </View>
        <TouchableOpacity
          onPress={showOptions}
          className="flex items-center justify-center h-14 w-10"
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <TrackOptions
        isVisible={isModalVisible}
        onClose={hideOptions}
        track={selectedTrack}
      />
    </View>
  );
};

export const MemoizedSong = memo(
  Song,
  (prevProps, newProps) => prevProps.data == newProps.data
);
