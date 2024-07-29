// export type songMetaData = {
//   songId: string;
//   title: string;
//   artist: string;
//   album: string;
//   duration: number;
//   uri: string;
//   pictureData: string;
//   filename: string;
//   isLiked: boolean;
// };

// export type albumData = {
//   name: string;
//   songId: string;
// };

// export type SongData = MusicInfoResponse & MediaLibrary.Asset;

// export type dbData = {
//   songId: string;
//   title: string;
//   artist: string;
//   album: string;
//   duration: number;
//   uri: string;
//   // pictureData: string;
//   filename: string;
//   isLiked: boolean;
// };

export type SongData = {
  /* unique id given to the file */
  id: string;
  /* path for mp3 file in storage */
  url: string;
  /* filename of mp3 file */
  filename: string;
  /* title of song */
  title?: string;
  album?: string;
  artist?: string;
  /* duration in seconds */
  duration?: number;
  /* image url only[not data] */
  artwork: string;
  /* image description */
  description?: string;
  genre?: string;
  isLiked: boolean;
  /* unq index for db indexing */
  _index: number;
};

export type AlbumData = {
  name: string;
  songIDs: string[];
};
