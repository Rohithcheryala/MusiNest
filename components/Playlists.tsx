import {
  View,
  Text,
  Modal,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SongData } from "@/lib/types";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CreatePlaylist from "@/components/CreatePlaylist"; // Adjust the path as needed
import {
  getAllPlaylists,
  getAllTracksFromPlaylist,
  insertIntoPlaylist,
  insertIntoPlaylistTable,
} from "@/lib/db";

const playlistPath = `${FileSystem.documentDirectory}/playlists/`;

type OptionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  trackId: string;
};

const Playlists: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  trackId,
}) => {
  const [playlists, setPlaylists] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const [isExisting, setIsExisting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getAllPlaylists();
        console.log(data);
        setPlaylists(data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePress = async (id: number) => {
    console.log(id);
    if (!id) return;
    console.log(id);
    try {
      const tracks = await getAllTracksFromPlaylist(id);
      //   if (tracks && tracks?.length > 0) {
      //     tracks.forEach((track) => {
      //       if (track.songId === trackId) {
      //         console.log("song exists", trackId);
      //         setIsExisting(true);
      //         console.log(isExisting);
      //       }
      //     });
      //   }
      const index = tracks?.findIndex((track) => track.id === trackId);
      console.log("Song index: ", index);
      if (index !== -1) {
        console.log("existing in playlist");
        ToastAndroid.show("Track already in playlist", ToastAndroid.SHORT);
      } else {
        await insertIntoPlaylistTable(id, trackId);
        ToastAndroid.show("Track added to playlist", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error handling playlist:", error);
    } finally {
      onClose();
    }
  };

  const handleCreatePlaylist = async (playlistName: string) => {
    await insertIntoPlaylist(playlistName);
    // setModalVisible(false);
    setPlaylists((prevPlaylists) => [
      ...prevPlaylists,
      { id: prevPlaylists.length + 1, name: playlistName },
    ]);
    onClose();
  };

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-center items-center bg-transparent">
          <View className="bg-black w-[80%] h-[50%] rounded-lg p-4">
            <Text className="text-white text-xl mb-4">Playlists</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <>
                {/* <TouchableOpacity
                  className="bg-blue-500 p-3 rounded-lg mb-4 ml-2 mr-2"
                  onPress={() => setCreateModalVisible(true)}
                >
                  <Text className="text-white text-center">
                    Create Playlist
                  </Text>
                </TouchableOpacity> */}
                <FlatList
                  data={playlists}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="bg-[#343437] p-3 rounded-lg mb-2 ml-2 mr-2"
                      onPress={() => {
                        // setSelectedPlaylist(item);
                        handlePress(item.id);
                      }}
                    >
                      <View className="flex flex-row justify-start items-center">
                        <MaterialCommunityIcons
                          name="playlist-plus"
                          size={25}
                          color="white"
                        />
                        <Text className="text-white text-xl ml-1">
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => {
                    return (
                      <View className="flex items-center justify-center mt-10">
                        <Text className="text-white text-3xl text-center">
                          Create playlist to add songs
                        </Text>
                      </View>
                    );
                  }}
                />
              </>
            )}
            <View className="flex justify-center items-center">
              <TouchableOpacity
                className="bg-red-500 p-3 rounded-lg w-[50%]"
                onPress={onClose}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Playlist Modal */}
      {/* <CreatePlaylist
        modalVisible={createModalVisible}
        setModalVisible={setCreateModalVisible}
        onCreate={handleCreatePlaylist}
      /> */}
    </>
  );
};

export default Playlists;
