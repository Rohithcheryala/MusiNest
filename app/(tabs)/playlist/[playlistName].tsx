import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  deleteTrackFromPlaylist,
  getAllTracksFromPlaylist,
  getPlaylistByName,
} from "@/lib/db";
import { SongData } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import Search from "@/components/Search";
import { addTracksToQueue } from "@/lib/utils";
import Buttons from "@/components/Buttons";
import { Song } from "@/components/Song";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PlaylistData = () => {
  const { playlistName } = useLocalSearchParams<{ playlistName: string }>();
  const [playlist, setPlaylist] = useState<{ id: number; name: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlistData, setPlaylistData] = useState<SongData[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filteredTracks, setFilteredTracks] = useState<SongData[]>([]);

  useEffect(() => {
    fetchPlayListData(playlistName as string);
  }, [refreshing]);

  const fetchPlayListData = async (playListName: string) => {
    try {
      const playlist = await getPlaylistByName(playListName);
      if (playlist) {
        const data = await getAllTracksFromPlaylist(playlist.id);
        setPlaylist(playlist);
        setPlaylistData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  if (!playlist) {
    return (
      <SafeAreaView>
        <Text className="text-white">Select A Playlist First</Text>
      </SafeAreaView>
    );
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing indicator
    fetchPlayListData(playlistName as string);
  }, []);

  const handleDelete = async (songId: string | undefined) => {
    await deleteTrackFromPlaylist(playlist?.id, songId);
    const data = playlistData?.filter((item) => item.id !== songId);
    setPlaylistData(data);
  };

  return (
    <SafeAreaView>
      <View className={`m-0 mb-56`}>
        <View className="flex flex-row mt-10">
          <TouchableOpacity
            className="w-[10%] flex justify-center items-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-3xl w-[80%]">{playlist?.name}</Text>
        </View>
        <Search
          mainData={playlistData}
          onResults={setFilteredTracks}
          placeholder={`Search ${playlist?.name}...`}
        />
        <Buttons mainData={playlistData} idType="songId" />
        <FlatList
          data={filteredTracks}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <View className="flex flex-row">
              <View className="w-[90%]">
                <MemoizedSong
                  data={item}
                  onclick={async (data: SongData) => {
                    console.log(
                      "------------------------------------------------"
                    );
                    console.log(`clicked on ${data.filename}`);
                    const songIndex = playlistData?.findIndex(
                      (song) => song.id === item.id
                    );
                    console.log(songIndex);
                    await addTracksToQueue(playlistData, songIndex, "songId");
                    console.log(
                      "------------------------------------------------"
                    );
                  }}
                />
              </View>
              <TouchableOpacity
                className="flex justify-center items-center"
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={25}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() => {
            return (
              <View className="flex items-center justify-center mt-10">
                <Text className="text-white text-3xl text-center">
                  Add Songs to the playlist to view
                </Text>
              </View>
            );
          }}
        />
      </View>
      {/* <PlaylistOptions
          isVisible={isOptionsVisible}
          onClose={() => setIsOptionsVisible(false)}
          playlist={playlist}
        /> */}
    </SafeAreaView>
  );
};

export default PlaylistData;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
