import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import PermissionChecker from "@/lib/PermissionChecker";
import { useColorScheme } from "@/hooks/useColorScheme";
import TrackPlayer from "react-native-track-player";
import { SetupTrackPlayer } from "@/lib/Player";
import { CheckDbAndInit, InitDB, saveCurrentSong, saveQueue } from "@/lib/db";
import { CreateImagesDir } from "@/lib/utils";
import { MusicPlayerProvider } from "@/context/PlayerContext";
import { AppState, AppStateStatus } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
TrackPlayer.registerPlaybackService(() => require("@/service"));
// TrackPlayer.setupPlayer();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // must succeed functions
    SetupTrackPlayer();
    CreateImagesDir();
    CheckDbAndInit();

    // const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    //   if (nextAppState === "background" || nextAppState === "inactive") {
    //     const queue = await TrackPlayer.getQueue();
    //     const currentTrackId = await TrackPlayer.getActiveTrackIndex();
    //     const currentTrack = queue.find((track) => track.id === currentTrackId);

    //     saveQueue(queue);
    //     if (currentTrack) saveCurrentSong(currentTrack);
    //   }
    // };

    // AppState.addEventListener("change", handleAppStateChange);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PermissionChecker>
        <MusicPlayerProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </MusicPlayerProvider>
      </PermissionChecker>
    </ThemeProvider>
  );
}
