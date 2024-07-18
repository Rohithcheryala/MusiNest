import { View, Text, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { SongData } from "@/lib/types";

interface Props {
  mainData: SongData[];
  onResults: (filteredTracks: SongData[]) => void;
  placeholder?: string;
  searchTitleOnly?: boolean;
}

const Search: React.FC<Props> = ({
  mainData,
  onResults,
  placeholder,
  searchTitleOnly,
}) => {
  const [query, setQuery] = useState<string>("");

  const sanitizeString = (str: string): string => {
    return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };

  useEffect(() => {
    if (query.length > 2) {
      const sanitizedQuery = sanitizeString(query);

      const filtered = mainData?.filter((track) => {
        if ("title" in track) {
          const sanitizedTitle = sanitizeString(track.title || "");
          const sanitizedArtist = sanitizeString(track.artist || "");
          const sanitizedAlbum = sanitizeString(track.album || "");

          if (searchTitleOnly) {
            return sanitizedTitle.includes(sanitizedQuery);
          }

          return (
            sanitizedTitle.includes(sanitizedQuery) ||
            sanitizedArtist.includes(sanitizedQuery) ||
            sanitizedAlbum.includes(sanitizedQuery)
          );
        } else {
          const sanitizedTitle = sanitizeString(track.filename || "");
          const sanitizedAlbum = sanitizeString(track?.albumId || "");

          if (searchTitleOnly) {
            return sanitizedTitle.includes(sanitizedQuery);
          }

          return (
            sanitizedTitle.includes(sanitizedQuery) ||
            sanitizedAlbum.includes(sanitizedQuery)
          );
        }
      });

      onResults(filtered);
    } else {
      onResults(mainData);
    }
  }, [query, mainData, searchTitleOnly, onResults]);

  return (
    <View className="pl-5 pr-5 pt-5 pb-5">
      <View className="flex-row items-center bg-slate-300 rounded-lg">
        <View className="pb-1">
          <EvilIcons name="search" size={30} color="black" className="" />
        </View>
        <TextInput
          className="flex-1 h-[40px] bg-slate-300 rounded-lg pl-2"
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
        />
      </View>
    </View>
  );
};

export default Search;
