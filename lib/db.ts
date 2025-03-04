// import { albumData, dbData, songMetaData } from "@/lib/types";
import * as SQLite from "expo-sqlite";
import { AlbumData, SongData } from "./types";
import { DB_NAME, DEV } from "@/constants/app";
import { Track } from "react-native-track-player";

SQLite.deleteDatabaseSync(DB_NAME);
const dbPromise = SQLite.openDatabaseAsync(DB_NAME);

// // once per connection
// dbPromise.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () =>
//   console.log("Foreign keys turned on")
// );

export async function CheckDbAndInit() {
  const db = await dbPromise;
  try {
    const res = db.getAllSync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="Songs";'
    );
    return res.length != 0;
  } catch (error) {
    return false;
  } finally {
    InitDB();
  }
}

// Main data
export async function InitDB() {
  const db = await dbPromise;
  // try {

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Songs (
      _index INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT NOT NULL,
      url TEXT NOT NULL,
      filename TEXT NOT NULL,
      title TEXT,
      album TEXT,
      artist TEXT,
      duration REAL,
      artwork TEXT,
      description TEXT,
      genre TEXT,
      isLiked INTEGER DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      song_id TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Playlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
      name TEXT NOT NULL UNIQUE
    );`);

  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS PlaylistRecords (
        playlist_id INTEGER, 
        song_id TEXT
      );`
  );

  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS Queue (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        url TEXT NOT NULL
      );`
  );

  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS CurrentSong (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        url TEXT NOT NULL
      );`
  );

  if (DEV) console.log("Tables created successfully");
  // } catch (error) {
  //   console.error("Error creating table 'Songs':", error);
  // }
}

// export async function getAllSongData  () {
export async function getAllSongData(): Promise<SongData[]> {
  const db = await dbPromise;
  try {
    const data: SongData[] = await db.getAllAsync("SELECT * FROM Songs");
    if (DEV) console.log(`Song data length: ${data.length}`);
    return data;
  } catch (error) {
    console.log("Error fetching all songs data!!! ", error);
  }
  return [];
}

// export async function getAllAlbumData  () {
export async function getAllAlbumData() {
  const db = await dbPromise;
  try {
    const data: { name: string; song_id: string }[] = await db.getAllAsync(
      "SELECT * FROM Albums"
    );

    let result = new Map<string, string[]>();
    for (const dat of data) {
      const ids = result.get(dat.name);
      if (ids) {
        result.set(dat.name, [...ids, dat.song_id]);
      } else {
        result.set(dat.name, [dat.song_id]);
      }
    }
    return result;
  } catch (error) {
    console.log("Error fetching all songs data!!!> ", error);
  }
}

// export async function insertSong  (song: Song) {
export async function insertSong(song: SongData) {
  const db = await dbPromise;
  try {
    await db.runAsync(
      "INSERT INTO Songs (id, title, artist, album, duration, artwork, url, filename, isLiked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        song.id,
        song.title || "",
        song.artist || "",
        song.album || "",
        song.duration || -1,
        song.artwork || "",
        song.url,
        song.filename,
        // song.isLiked,
        0,
      ]
    );
    if (song.album) {
      await db.runAsync("INSERT INTO Albums (name, song_id) VALUES (?, ?)", [
        song.album,
        song.id,
      ]);
    }
    if (DEV) console.log(`${song.title} inserted successfully`);
  } catch (error) {
    console.error(`Error inserting ${song.title}: ${error}`);
  }
}

export async function deleteSong(song_id: string) {
  const db = await dbPromise;
  try {
    let ok = await db.runAsync("DELETE * FROM Songs WHERE id = ?", [song_id]);
    if (DEV) console.log(`${song_id} inserted successfully`);
  } catch (error) {
    console.error(`Error deleting ${song_id}: ${error}`);
  }
}

// export async function getSongDataById  (songId: string) {
export async function getSongDataById(song_id: string) {
  const db = await dbPromise;
  try {
    const result = await db.getFirstAsync<SongData>(
      "SELECT * FROM Songs where id = (?)",
      [song_id]
    );

    if (result) {
      return result;
    }
  } catch (error) {
    console.log("Error fetching song data!!! ", error);
  }
}

// export async function getSongsDataByAlbumName  (albumName: string) {
export async function getSongsDataByAlbumName(albumName: string) {
  const db = await dbPromise;
  const res = await getAllAlbumData();
  return res?.get(albumName);
}

export async function getTracksByAlbumName(albumName: string) {
  const db = await dbPromise;
  try {
    const data: SongData[] = await db.getAllAsync(
      "SELECT * FROM Songs WHERE album = ?",
      [albumName]
    );
    return data;
  } catch (error) {
    console.log("Error fetching all tracks from album!!! ", error);
  }
  return [];
}

export async function getTracksByArtists(artist: string) {
  const db = await dbPromise;
  try {
    const data: SongData[] = await db.getAllAsync(
      "SELECT * FROM Songs WHERE artist LIKE ?",
      [`%${artist}%`]
    );
    return data;
  } catch (error) {
    console.log("Error fetching all tracks by artist!!! ", error);
  }
}

// Liked track data
// export async function toggleLikedTrack  (trackId: string) {
export async function toggleLikedTrack(trackId: string) {
  const db = await dbPromise;
  try {
    await db.runAsync(
      "UPDATE Songs SET isLiked = CASE WHEN isLiked = 1 THEN 0 ELSE 1 END WHERE id = ?",
      [trackId]
    );
    if (DEV) console.log(`Track ${trackId} liked/disliked successfully`);
  } catch (error) {
    console.log(`Error liking or disliking ${trackId}: ${error}`);
  }
}

// export async function getAllLikedSongData  () {
export async function getAllLikedSongData(): Promise<SongData[]> {
  const db = await dbPromise;
  try {
    const data: SongData[] = await db.getAllAsync(
      "SELECT * FROM Songs WHERE isLiked = 1"
    );
    if (DEV) console.log(`liked Songs data length: ${data.length}`);
    return data;
  } catch (error) {
    console.log("Error fetching all songs data!!! ", error);
  }
  return [];
}

// Plalists data
export async function insertIntoPlaylist(playlistName: string) {
  const db = await dbPromise;
  console.log("in insert playlist");

  try {
    await db.runAsync(`INSERT INTO Playlist (name) VALUES (?)`, [playlistName]);

    if (DEV) console.log(`${playlistName} inserted successfully`);
  } catch (error) {
    console.log(`Error inserting ${playlistName}: ${error}`);
  }
}

export async function getAllPlaylists() {
  const db = await dbPromise;
  try {
    const data: { id: number; name: string }[] = await db.getAllAsync(
      "SELECT * FROM Playlist"
    );
    if (DEV) console.log(`Playlist data length: ${data.length}`);
    return data;
  } catch (error) {
    console.log("Error fetching all playlists!!! ", error);
  }
  return [];
}

export async function insertIntoPlaylistTable(
  playlist_id: number,
  trackId: string
) {
  const db = await dbPromise;
  try {
    await db.runAsync(
      "INSERT INTO PlaylistRecords (playlist_id, song_id) VALUES (?, ?)",
      [playlist_id, trackId]
    );
    if (DEV)
      console.log(
        `Track ${trackId} inserted into playlist ${playlist_id} successfully`
      );
  } catch (error) {
    console.log(
      `Error inserting ${trackId} into playlist ${playlist_id}: ${error}`
    );
  }
}

export async function getAllTracksFromPlaylist(playlist_id: number) {
  const db = await dbPromise;
  try {
    const data: SongData[] = await db.getAllAsync(
      "SELECT * FROM Songs JOIN PlaylistRecords ON Songs.id = PlaylistRecords.song_id WHERE PlaylistRecords.playlist_id = ?",
      [playlist_id]
    );
    if (DEV) console.log(`Playlist ${playlist_id} data length: ${data.length}`);
    return data;
  } catch (error) {
    console.log("Error fetching all tracks from playlist!!! ", error);
  }
  return [];
}

export async function deletePlaylist(playlistId: number) {
  const db = await dbPromise;
  try {
    await db.runAsync("DELETE FROM playlist WHERE id = ?", [playlistId]);
    if (DEV) console.log("Playlist deleted successfully from playlist table");
    await db.runAsync("DELETE FROM PlaylistRecords WHERE playlistId = ?", [
      playlistId,
    ]);
    if (DEV)
      console.log("Tracks deleted successfully from PlaylistRecords table");
  } catch (error) {
    console.log(`Error deleting playlist ${playlistId}: ${error}`);
  }
}

export async function deleteTrackFromPlaylist(
  platlistId: number,
  trackId: string
) {
  const db = await dbPromise;
  try {
    if (!trackId) return;
    await db.runAsync(
      "DELETE FROM PlaylistRecords WHERE playlistId = ? AND songId = ?",
      [platlistId, trackId]
    );
    if (DEV)
      console.log(
        `Track ${trackId} deleted successfully from playlist ${platlistId}`
      );
  } catch (error) {
    console.log(
      `Error deleting track ${trackId} from playlist ${platlistId}: ${error}`
    );
  }
}

export async function getPlaylistByName(name: string) {
  const db = await dbPromise;
  try {
    const data = await db.getFirstAsync<{ id: number; name: string }>(
      "SELECT * FROM Playlist where name = ?",
      [name]
    );
    if (data) {
      if (DEV) console.log(`Playlist id=${data.id} name=${data.name}`);
      return data;
    }
  } catch (error) {
    console.log("Error fetching all playlists!!! ", error);
  }
}

export async function saveQueue(queue: Track[]) {
  const db = await dbPromise;
  await db.runAsync("DELETE FROM Queue;"); // Clear the table first
  queue.forEach((song) => {
    db.runAsync(
      "INSERT INTO Queue (id, title, artist, url) VALUES (?, ?, ?, ?);",
      [song.id, song.title, song.artist, song.url]
    );
  });
}

export async function saveCurrentSong(song: Track) {
  const db = await dbPromise;
  db.runAsync("DELETE FROM CurrentSong;"); // Clear the table first
  return db.runAsync(
    "INSERT INTO CurrentSong (id, title, artist, url) VALUES (?, ?, ?, ?);",
    [song.id, song.title, song.artist, song.url]
  );
}

export async function loadQueue(callback) {
  const db = await dbPromise;
  return db.runAsync("SELECT * FROM Queue;");
}

export async function loadCurrentSong(callback) {
  const db = await dbPromise;
  return db.runAsync("SELECT * FROM CurrentSong LIMIT 1;");
}
