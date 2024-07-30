import { SongData } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

export interface MusicPlayerContextProps {
  // list of all songs
  allTracks: SongData[];
  setAllTracks: React.Dispatch<React.SetStateAction<SongData[]>>;

  // albums =  album_name: [Song]
  albums: Map<string, SongData[]>;
  setAlbums: React.Dispatch<React.SetStateAction<Map<string, SongData[]>>>;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(
  undefined
);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Audio.setAudioModeAsync({
  //   interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
  //   staysActiveInBackground: true,
  //   shouldDuckAndroid: false,
  // });

  const [allTracks, setAllTracks] = useState<SongData[]>([]);
  const [albums, setAlbums] = useState<Map<string, SongData[]>>(new Map());

  const contextValue: MusicPlayerContextProps = {
    allTracks,
    albums,
    setAllTracks,
    setAlbums,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayerContext = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};
