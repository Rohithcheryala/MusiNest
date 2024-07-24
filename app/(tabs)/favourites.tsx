import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { getAllLikedSongData } from "@/lib/db";
import { SongData } from "@/lib/types";
import Search from "@/components/Search";
import { addTracksToQueue } from "@/lib/utils";
import Buttons from "@/components/Buttons";
import { Song } from "@/components/Song";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoritesScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [likedData, setLikedData] = useState<SongData[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filteredTracks, setFilteredTracks] = useState<SongData[]>([]);

  useEffect(() => {
    fetchLikedData();
  }, [refreshing]);

  const fetchLikedData = async () => {
    try {
      const data = await getAllLikedSongData();
      setLikedData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing indicator
    fetchLikedData();
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#00ff00"
        className="flex justify-center items-center"
      />
    );
  }

  return (
    <SafeAreaView className="w-full h-full m-0 mb-16">
      <View className="w-full h-full m-0 mb-16">
        <Search
          mainData={likedData}
          searchTitleOnly={true}
          onResults={setFilteredTracks}
          placeholder="Search songs..."
        />

        <Buttons mainData={likedData} idType="songId" />
        <FlatList
          data={filteredTracks}
          // renderItem={renderSongItem}
          keyExtractor={(item) => item.filename}
          renderItem={({ item }) => (
            <MemoizedSong
              data={item}
              onclick={async (data: SongData) => {
                console.log("------------------------------------------------");
                console.log(`clicked on ${data.filename}`);
                const songIndex = likedData?.findIndex(
                  (song) => song.id === item.id
                );
                console.log(songIndex);
                await addTracksToQueue(likedData, songIndex, "songId");
                console.log("------------------------------------------------");
              }}
            />
          )}
          ListEmptyComponent={() => {
            return (
              <View className="flex items-center justify-center">
                <Text className="text-white text-3xl text-center">
                  No Liked Songs
                </Text>
              </View>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
