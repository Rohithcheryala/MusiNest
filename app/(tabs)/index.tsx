import { Image, View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { memo, useCallback, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  loadDataFromDisk,
  loadDataFromFileSystemOnePerSong,
  loadSongsData,
  loadSongsDataFinal,
  syncSongsData,
} from "@/lib/data";
import { FlashList } from "@shopify/flash-list";
import TrackPlayer from "react-native-track-player";
import { SetupTrackPlayer } from "@/lib/Player";
import { CheckDbAndInit, InitDB, getAllSongData, insertSong } from "@/lib/db";
import { SongData } from "@/lib/types";
import { shuffle } from "@/lib/methods";
import { Song } from "@/components/Song";
import * as MediaLibrary from "expo-media-library";
import { useMusicPlayerContext } from "@/context/PlayerContext";
import * as FileSystem from "expo-file-system";

export default function HomeScreen() {
  const [songsList, setSongsList] = useState<SongData[]>([]);
  const ctx = useMusicPlayerContext();

  // fetch songs
  useEffect(() => {
    async function fetch2() {
      try {
        const resp = await loadSongsDataFinal();
        if (resp instanceof Error) {
          console.error("Error loading songs:", resp.message);
        } else if (resp === undefined) {
          console.warn("No songs data available");
        } else {
          ctx.setAllTracks(resp);
          console.log(resp.length);
        }
      } catch (error) {
        console.log("shit:", error);
      }
    }

    async function fetch() {
      const status = await CheckDbAndInit();
      console.log("the status is ", status);
      SetupTrackPlayer();
      console.log(`fetching songs`);
      const res: SongData[] = await loadDataFromDisk();
      ctx.setAllTracks(res);
      console.log("lnght", res.length);
      try {
        for (const r of res) {
          console.log("whyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
          insertSong(r);
        }
      } catch (err) {
        console.log("in cat");
        console.log(err);
        getAllSongData().then((res) => console.log(res?.length));
      }
    }

    async function fetchData() {
      try {
        const resp = await loadSongsDataFinal();
        for (let s of resp as SongData[]) {
          FileSystem.getInfoAsync(s.artwork).then((sy) => {
            console.log(`${s.artwork} -> ${sy.exists}`);
          });
        }
        if (resp instanceof Error) {
          console.error("Error loading songs:", resp.message);
          return;
        } else if (resp === undefined) {
          console.warn("No songs data available");
          return;
        } else {
          ctx.setAllTracks(resp);
        }
        const synced = await syncSongsData(resp);
        console.log("synced.");
        ctx.setAllTracks(synced);
      } catch (err) {
        console.log("err ->", err);
      }
    }

    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-700">
      <FlashList
        data={ctx.allTracks}
        keyExtractor={(item, index) => `${index}`}
        estimatedItemSize={500}
        scrollIndicatorInsets={{ right: 1 }}
        // renderScrollComponent={(s) => (
        //   <View className="w-2 h-6 bg-purple-500 right-0"></View>
        // )}
        renderItem={({ item }) => (
          <Song
            data={item}
            onclick={() => {
              console.log(
                "clicked",
                typeof item.artwork,
                item.artwork.slice(0, 50)
              );
              MediaLibrary.getAssetInfoAsync(item.artwork).then((s) =>
                console.log(s)
              );
              const songIndex = ctx.allTracks.findIndex(
                (song) => song.id === item.id
              );
              console.log(songIndex);
              if (songIndex === -1) {
                console.error("Song not found in the provided list");
                return;
              }

              const list = [...ctx.allTracks]; // copy of list
              const cur = list.splice(songIndex, 1); // removing cur song from list
              const shuffled = shuffle(list);
              const q: SongData[] = [...cur, ...shuffled]; // adding cur in front
              // console.log("shuffled");
              for (const a of q) {
                // console.log(a.filename, a.artwork.length);
              }
              TrackPlayer.setQueue(q).then(() => {
                TrackPlayer.play();
                TrackPlayer.getQueue().then((q) => {
                  // console.log(`Queue is`);
                  // console.log(q);
                });
              });
            }}
          />
        )}
        ListHeaderComponent={() => {
          return (
            <View>
              <Text className={`text-white text-4xl`}>All SongS</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

/* const Song = ({ data, onclick }: { data: SongData; onclick: Function }) => {
  console.log(`rendering song ${data.filename} - ${data.id}`);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.log(`comp click`);
          onclick(data);
        }}
      >
        <View className="w-full flex flex-row items-center gap-4 border-b-2 border-gray-300 p-2">
          <View className="flex items-center">
            {data.artwork ? (
              <Image
                style={{ width: 50, height: 50, borderRadius: 10 }}
                src={data.artwork}
                alt="Album Art"
              />
            ) : (
              <Image
                style={{ width: 50, height: 50, borderRadius: 10 }}
                source={require("@/assets/images/react-logo.png")}
                alt="Album Art"
              />
            )}
          </View>
          <View className="w-2/3 mr-4">
            <Text className="text-white" numberOfLines={1} ellipsizeMode="tail">
              {data.filename.split(".")[0]}
            </Text>
            <Text className="text-white" numberOfLines={1} ellipsizeMode="tail">
              {data?.title || "Unknown"}
            </Text>
            <Text className="text-white" numberOfLines={1} ellipsizeMode="tail">
              {data?.artist || "Unknown"}
            </Text>
          </View>
          <View className="">
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="white"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const MemoizedSong = memo(
  Song,
  (prevProps, newProps) => prevProps.data == newProps.data
); */
