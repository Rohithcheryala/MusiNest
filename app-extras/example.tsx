import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Button, Text } from "react-native";
import TrackPlayer from "react-native-track-player";
import { setupPlayer } from "@/TrackPlayerServices";

export default function HomeScreen() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function setup() {
      let k = await TrackPlayer.getPlaybackState();
      console.log(k.state);
      console.log(`to setup`);
      let isSetup = await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        // await addTracks();
      }

      setIsPlayerReady(isSetup);
    }

    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView>
        <Text className="bg-red-500 h-28">Idhi inthe</Text>
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
