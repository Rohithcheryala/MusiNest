// service.js
import TrackPlayer from "react-native-track-player";

module.exports = async function () {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  TrackPlayer.addEventListener("remote-play", () => {
    console.log(`remote-play`);
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener("remote-pause", () => {
    console.log(`remote-pause`);
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener("remote-next", () => {
    console.log(`remote-next`);
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener("remote-previous", () => {
    console.log(`remote-previous`);
    TrackPlayer.skipToPrevious();
  });
  // song is paused even when a notification interupts...!!!
  TrackPlayer.addEventListener("remote-duck", () => {
    console.log(`remote-duck`);
    TrackPlayer.pause();
  });
};
