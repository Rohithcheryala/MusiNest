import {
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Button,
  Text,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { setupPlayer, addTracks } from "@/TrackPlayerServices";
import TrackPlayer from "react-native-track-player";
import * as Notifications from "expo-notifications";

export default function HomeScreen() {
  const [isPlayerReady, setIsPlayerReady] = useState(true);

  // useEffect(() => {
  //   async function setup() {
  //     let isSetup = await setupPlayer();

  //     const queue = await TrackPlayer.getQueue();
  //     if (isSetup && queue.length <= 0) {
  //       await addTracks();
  //     }

  //     setIsPlayerReady(isSetup);
  //   }

  //   // setup();
  // }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView>
        <Text className="bg-red-500 h-28">Idhi inthe</Text>
        {/* <ActivityIndicator size="large" color="#bbb" /> */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text className="bg-green-500">Finally</Text>
      <Button title="Play" color="#777" onPress={() => TrackPlayer.play()} />
      <Button title="Pause" color="#777" onPress={() => TrackPlayer.pause()} />
      <Button
        title="PlayNext"
        color="#777"
        onPress={() => TrackPlayer.skipToNext()}
      />
      <Button
        title="PlayPrevious"
        color="#777"
        onPress={() => TrackPlayer.skipToPrevious()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#112",
  },
});
