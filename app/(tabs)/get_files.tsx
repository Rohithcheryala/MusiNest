import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { getAll } from "react-native-get-music-files";
import { Song } from "react-native-get-music-files/lib/typescript/src/NativeTurboSongs";
import GetMetadata from "react-native-get-metadata";
async function getMusicInfoAsync(url) {
  try {
    // const metadata = await MusicFiles.getMetadata({
    //   path: url,
    //   cover: true,
    // });

    // return {
    //   title: metadata.title || "",
    //   artist: metadata.artist || "",
    //   album: metadata.album || "",
    //   genre: metadata.genre || "",
    //   picture: metadata.cover || "",
    // };
    const st = performance.now();
    console.log("started");
    const res = await getAll({
      limit: 1000,
    });
    if (typeof res === "string") {
      // do something with the error
      return;
    }
    const et = performance.now();
    console.log(
      `total: ${et - st} ms - ${(et - st) / 1000} sec ${(et - st) / 60000} min`
    );

    console.log(typeof res, res.length, typeof res === "string" ? res : "");
    let urls = [];
    for (const r of res) {
      urls.push(r.url);
    }
    console.log("getting solo metadata");
    const st1 = performance.now();

    // error

    return res;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return;
  }
  1;
}
0;

async function fetchAllMetadata(urlList) {
  // Use Promise.all to fetch metadata in parallel
  //   const metadataList = await Promise.all(
  //     urlList.map((url) => getMusicInfoAsync(url))
  //   );
  return await getMusicInfoAsync("ok");

  //   return metadataList;
}

// Usage
const urlList = [
  "file:///storage/emulated/0/Music/song1.mp3",
  "file:///storage/emulated/0/Music/song2.mp3",
]; // Replace with actual file URLs

// Sample React component to display the fetched metadata
const App = () => {
  const [metadataList, setMetadataList] = useState<Song[]>();

  useEffect(() => {
    fetchAllMetadata(urlList).then(setMetadataList);
  }, []);

  if (!metadataList) {
    return <Text className="text-white">{typeof metadataList} Wasted</Text>;
  }
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {metadataList?.map((metadata, index) => (
        <View key={index}>
          <View></View>
          <Text>Title: {metadata.title}</Text>
          <Text>Artist: {metadata.artist}</Text>
          <Text>Album: {metadata.album}</Text>
          <Text>Genre: {metadata.genre}</Text>
          {metadata.cover && (
            <Image
              source={{ uri: metadata.cover }}
              style={{ width: 100, height: 100 }}
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default App;
