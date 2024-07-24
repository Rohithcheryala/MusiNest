import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { SongData } from "@/lib/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTracksByAlbumName, getTracksByArtists } from "@/lib/db";
import Search from "./Search";
import Buttons from "./Buttons";
// import Song from "@/app/Songs";
import { addTracksToQueue } from "@/lib/utils";
import { FloatingPlayer } from "./FloatingPlayer";
import { Song } from "./Song";

type OptionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  track: SongData;
  type: string;
};

const ArtistAndAlbum: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  track,
  type,
}) => {
  const [trackData, setTrackData] = useState<SongData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filteredTracks, setFilteredTracks] = useState<SongData[]>([]);

  const splitArtists = (artistString: string): string[] => {
    // Regular expression to match any of the delimiters and their combinations
    const delimiterRegex = /[,/&|]+/;
    return artistString.split(delimiterRegex).map((artist) => artist.trim());
  };

  // Function to remove duplicate songs
  const removeDuplicateSongs = (songs: any[]): any[] => {
    const seen = new Set();
    return songs.filter((song) => {
      const identifier = song.id || song.title; // Assuming each song has a unique id or title
      if (seen.has(identifier)) {
        return false;
      } else {
        seen.add(identifier);
        return true;
      }
    });
  };

  const fetchData = async () => {
    try {
      if (track && type === "album" && track.album) {
        const data = await getTracksByAlbumName(track.album);
        console.log("data:", data);
        setTrackData(data);
      } else if (track && type === "artist" && track.artist) {
        const artists = splitArtists(track.artist);
        artists.push(track.artist);
        console.log("artists: ", artists);
        const data = await Promise.all(
          artists.map((artist) => getTracksByArtists(artist))
        );
        const flattenedData = data.flat();
        const uniqueData = removeDuplicateSongs(flattenedData);
        setTrackData(uniqueData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      //   onClose();
    }
  };

  useEffect(() => {
    fetchData();
  }, [track, type, isVisible]);

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing indicator
    fetchData();
  }, []);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView className="position-relative">
        <View className="w-full h-full m-0 mb-16 bg-black">
          <Text className="text-white text-3xl mb-4 ml-3 mt-10">
            {type === "album" ? "Album" : "Artists"}
          </Text>
          <Text className="text-white text-3xl mb-4 ml-3 mt-10">
            {track?.artist}
          </Text>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#00ff00"
              className="flex justify-center items-center"
            />
          ) : (
            <View className="w-full h-full m-0 mb-16">
              <Search
                mainData={trackData}
                searchTitleOnly={true}
                onResults={setFilteredTracks}
                placeholder="Search songs..."
              />

              <Buttons mainData={trackData} idType="songId" />
              <FlatList
                data={filteredTracks}
                // renderItem={renderSongItem}
                keyExtractor={(item) => item.filename}
                renderItem={({ item }) => (
                  <MemoizedSong
                    data={item}
                    onclick={async (data: SongData) => {
                      console.log(
                        "------------------------------------------------"
                      );
                      console.log(`clicked on ${data.filename}`);
                      const songIndex = trackData?.findIndex(
                        (song) => song.id === item.id
                      );
                      console.log(songIndex);
                      await addTracksToQueue(trackData, songIndex, "songId");
                      console.log(
                        "------------------------------------------------"
                      );
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
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          )}
        </View>
      </SafeAreaView>
      <View className="absolute bottom-[50px] w-full">
        <FloatingPlayer />
      </View>
    </Modal>
  );
};

export default ArtistAndAlbum;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
