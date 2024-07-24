import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CreatePlaylist from "@/components/CreatePlaylist";
import {
  getAllPlaylists,
  insertIntoPlaylist,
  getAllTracksFromPlaylist,
  deletePlaylist,
} from "@/lib/db";
import { SongData } from "@/lib/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const PlayListScreen = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [playlistModalVisible, setPlaylistModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const checkForPlaylists = async () => {
      try {
        const data = await getAllPlaylists();
        console.log(data);
        setPlaylists(data);
      } catch (error) {
        console.error("Error checking for playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    checkForPlaylists();
  }, []);

  const addPlaylist = async (newPlaylistName: string) => {
    await insertIntoPlaylist(newPlaylistName);
    setModalVisible(false);
    setPlaylists((prevPlaylists) => [
      ...prevPlaylists,
      { id: prevPlaylists.length + 1, name: newPlaylistName },
    ]);
  };

  const handlePress = (item: { id: number; name: string }) => {
    console.log("going to a playlist");
    router.push({
      pathname: "/playlist/[playlistName]",
      params: { playlistName: item.name },
    });
  };

  const handleDelete = async (playlistId: number) => {
    // Implement delete logic here
    await deletePlaylist(playlistId);
    const data = playlists.filter((playlist) => playlist.id !== playlistId);
    setPlaylists(data);
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center`}>
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 p-4 mb-32`}>
      <FlatList
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center">
            <Text className="text-white mb-4">No playlists found</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex mb-4">
            <TouchableOpacity
              className="flex flex-row items-center bg-blue-500 p-4 rounded-lg"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={25} color="white" />
              <Text className="text-white text-xl ml-2">
                Create New Playlist
              </Text>
            </TouchableOpacity>
          </View>
        )}
        data={playlists}
        renderItem={(item) => (
          <Playlist
            data={item.item}
            handlePress={handlePress}
            handleDelete={handleDelete}
          />
        )}
        keyExtractor={(item, v) => item.id.toString()}
        contentContainerStyle={{ padding: 4 }}
      />

      <CreatePlaylist
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onCreate={addPlaylist}
      />
    </SafeAreaView>
  );
};

export default PlayListScreen;

const Playlist = ({
  data,
  handlePress,
  handleDelete,
}: {
  data: { id: number; name: string };
  handlePress: Function;
  handleDelete: Function;
}) => {
  return (
    <TouchableOpacity onPress={() => handlePress(data)}>
      <View className="p-4 bg-gray-800 rounded-lg mb-2 flex flex-row justify-between">
        <Text className="text-white">
          {data.id}. {data.name}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(data.id)}>
          <MaterialCommunityIcons name="delete" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
