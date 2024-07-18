import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { SongData } from "@/lib/types";
import * as MediaLibrary from "expo-media-library";
import { addTracksToQueue, shuffleTracks } from "@/lib/utils";

interface Props {
  mainData: SongData[];
  idType: string;
}

const Buttons: React.FC<Props> = ({ mainData, idType }) => {
  const handlePlayAll = async () => {
    await addTracksToQueue(mainData, 0, idType);
  };

  const handleShufflePlay = async () => {
    const tracks = shuffleTracks(mainData);
    await addTracksToQueue(tracks, 0, idType);
  };

  return (
    <View className="w-full flex flex-row justify-between h-10 mb-4">
      <TouchableOpacity
        onPress={handlePlayAll}
        className="bg-gray-800 p-2 rounded-lg w-[45%] ml-5 flex flex-row justify-center items-center"
      >
        <FontAwesome6 name="play" size={20} color="white" />
        <Text className="text-white text-base ml-2">Play all</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleShufflePlay}
        className="bg-gray-800 p-2 rounded-lg w-[45%] ml-2 mr-5 flex flex-row justify-center items-center"
      >
        <FontAwesome6 name="shuffle" size={20} color="white" />
        <Text className="text-white text-base ml-2">Shuffel Play</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Buttons;
