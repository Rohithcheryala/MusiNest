import * as FileSystem from "expo-file-system";
import MusicInfo from "./MusicInfo";
import * as MediaLibrary from "expo-media-library";
import { SongData } from "./types";

const SONGS_LIMIT = 20;
const CLEAR_ASYNC_STORAGE = false;
const CLEAR_STORAGE = false;

// react-logo.png
const FallbackImage =
  "data:image/png;base64,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";

export async function loadDataFromFileSystemOnePerSong() {
  const metadataFolderPath = `${FileSystem.documentDirectory}songs/`;
  console.log(metadataFolderPath);
  if (CLEAR_STORAGE) {
    await FileSystem.deleteAsync(metadataFolderPath);
  }
  const folderInfo = await FileSystem.getInfoAsync(metadataFolderPath);
  if (folderInfo.exists) {
    console.log(`from file system one per song fs`);
    let allSongsData: SongData[] = [];
    const filesInfo = await FileSystem.readDirectoryAsync(metadataFolderPath);
    // console.log(filesInfo);
    for (const file of filesInfo) {
      // console.log(file);
      const json = await FileSystem.readAsStringAsync(
        `${metadataFolderPath}${file}`
      );
      allSongsData.push(JSON.parse(json));
    }
    return allSongsData;
  }

  await FileSystem.makeDirectoryAsync(metadataFolderPath, {
    intermediates: true,
  });
  let data2 = await loadDataFromDisk();
  for (const song of data2) {
    try {
      await FileSystem.writeAsStringAsync(
        `${metadataFolderPath}${song.id}.json`,
        JSON.stringify(song)
      );
    } catch (err) {
      console.log(err);
    }
  }
  return data2;
}

export async function loadDataFromDisk() {
  console.log(`in loadDataFromDisk`);

  let hasNext = true;
  let after;
  let allSongs: MediaLibrary.Asset[] = [];
  let allSongsData: SongData[] = [];

  while (hasNext) {
    let response = await MediaLibrary.getAssetsAsync({
      first: SONGS_LIMIT,
      mediaType: "audio",

      after,
    });

    let songsData: SongData[] = [];
    for (let index = 0; index < response.assets.length; index++) {
      const song = response.assets[index];
      try {
        let metadata = await MusicInfo.getMusicInfoAsync(song.uri, {
          title: true,
          artist: true,
          album: true,
          genre: true,
          picture: true,
        });

        // reading metadata from storage
        console.log(`${song.uri} reading metadata - ${index}`);

        songsData.push({
          url: song.uri,
          filename: song.filename,
          id: song.id,
          title: metadata.title,
          album: metadata.album,
          artist: metadata.artist,
          duration: song.duration,
          artwork: metadata.picture?.pictureData || FallbackImage,
          // Default image for a song (fallback)
          // toDataURL("@/assets/images/react-logo.png", function (dataUrl) {
          //   // console.log("RESULT:", dataUrl);
          // }),
          // (await FileSystem.readAsStringAsync(
          //   "@/assets/images/react-logo.png"
          // )),
          description:
            metadata.picture?.description ||
            `Default Description for ${song.filename}`,
          genre: metadata.genre,
          isLiked: false,
        });
      } catch (err) {
        // file is not of mp3 format, so retrieving metadata fails.
        console.log(err);
      }
    }

    allSongs = allSongs.concat(response.assets);
    allSongsData = allSongsData.concat(songsData);
    hasNext = response.hasNextPage && false;
    after = response.endCursor;
  }

  return allSongsData;
}
