import { useRef } from "react";
import "./App.css";
import VideoJS from "./components/video-player";
import videojs from "video.js";
import UploadPage from "./pages/upload-page";

type VideoJsPlayer = ReturnType<typeof videojs>;
type VideoJsPlayerOptions = Parameters<typeof videojs>[1];

function App() {
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: true,
    controls: true,
    // responsive: true,
    fluid: true,
    sources: [
      {
        src: "http://localhost:3000//transcoded/ OOP 7  Collections Framework Vector Class Enums in Java_1080p-1766658350568-959461222/master.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });

    player.on("ready", () => {
      //@ts-ignore
      const ql = player.qualityLevels();

      console.log(ql.length);
      console.log(ql.levels_);
      console.log(player.getVideoPlaybackQuality());
    });
  };

  return (
    <>
      <UploadPage />
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </>
  );
}

export default App;
