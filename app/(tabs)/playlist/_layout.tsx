import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="[playlistName]"
        options={{
          title: "Playlist Details",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
