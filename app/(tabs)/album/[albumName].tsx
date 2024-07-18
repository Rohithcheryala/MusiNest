import { Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getSongDataById, getSongsDataByAlbumName } from "@/lib/db";
import { SafeAreaView } from "react-native-safe-area-context";
import { SongData } from "@/lib/types";
import TrackPlayer from "react-native-track-player";
import { shuffle } from "@/lib/methods";
import { Song } from "@/components/Song";

const Album = () => {
  const { albumName } = useLocalSearchParams<{ albumName: string }>();

  const [songIds, setSongIds] = useState<string[] | undefined>([]);
  const [songsList, setSongsList] = useState<SongData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const songids = await getSongsDataByAlbumName(albumName as string);
      if (songids) {
        let songsdatalist: SongData[] = [];
        for (const id of songids) {
          songsdatalist.push((await getSongDataById(id)) as SongData);
        }
        setSongIds(songids);
        setSongsList(songsdatalist);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView className="">
      <FlatList
        data={songsList}
        ListHeaderComponent={() => (
          <Text className="text-white text-4xl">Album: {albumName}</Text>
        )}
        renderItem={(item) => {
          return (
            <Song
              data={item.item}
              onclick={() => {
                const songIndex = songsList.findIndex(
                  (song) => song.id === item.item.id
                );
                console.log(songIndex);
                if (songIndex === -1) {
                  console.error("Song not found in the provided list");
                  return;
                }

                const list = [...songsList]; // copy of list
                const cur = list.splice(songIndex, 1); // removing cur song from list
                const shuffled = shuffle(list);
                const q = [...cur, ...shuffled]; // adding cur in front

                TrackPlayer.reset().then(() => {
                  TrackPlayer.setQueue(q).then(() => {
                    TrackPlayer.play();
                    TrackPlayer.getQueue().then((q) => {
                      console.log(`Queue is`);
                      console.log(q.length);
                    });
                  });
                });
              }}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Album;
