import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllAlbumData, getAllSongData } from "@/lib/db";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AlbumsScreen() {
  const [data, setData] = useState<Map<string, string[]>>(new Map());
  useEffect(() => {
    const fetchAlbums = async () => {
      const dat = await getAllAlbumData();
      console.log(dat);
      if (dat) {
        setData(dat);
      }
    };
    fetchAlbums();
    getAllSongData().then((res) => console.log(res?.length));
  }, []);
  return (
    <SafeAreaView className={`flex-1`}>
      <FlatList
        data={Array.from(data?.entries())}
        ListHeaderComponent={() => {
          return (
            <View>
              <Text className="text-white text-4xl">All AlbumS</Text>
            </View>
          );
        }}
        renderItem={(item) => <Album name={item.item[0]} onclick={() => {}} />}
      />
    </SafeAreaView>
  );
}

const Album = ({ name, onclick }: { name: string; onclick: Function }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: `/album/[albumName]`,
          params: {
            albumName: name,
          },
        })
      }
      className="p-3 flex-row items-center"
    >
      <View className="flex items-center mr-3">
        {/* TODO - change contition & add image */}
        {false ? (
          <Image
            className="w-14 h-14 rounded-lg"
            // source={{ uri: data?.artwork }}
            // src={data.artwork}
            source={require("@/assets/images/react-logo.png")}
            alt="Album Art"
          />
        ) : (
          <Image
            className="w-14 h-14 rounded-lg bg-white"
            source={require("@/assets/images/react-logo.png")}
            alt="Album Art"
          />
        )}
      </View>
      <View className="flex-1 mr-3">
        <Text
          className="text-white text-lg font-semibold"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name || "Unknown Title"}
        </Text>
        <Text
          className="text-gray-400 text-sm"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {"Unknown Artists"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
