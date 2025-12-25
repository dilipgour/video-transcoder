import { useRef, useState, type ChangeEvent } from "react";
import "./App.css";
import axios from "axios";
import VideoJS from "./components/video-player";
import videojs from "video.js";

type VideoJsPlayer = ReturnType<typeof videojs>;
type VideoJsPlayerOptions = Parameters<typeof videojs>[1];

function App() {
  const [file, setFile] = useState<File | null>(null);
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

    player.on("ready",()=>{
        const ql = player.qualityLevels();
      
      console.log(ql.length); 
      console.log(ql.levels_); 
      console.log(player.getVideoPlaybackQuality())

    })
    
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleClick = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("uploaded_file", file);

    await axios.post("http://localhost:3000/upload", formData);
  };

  return (
    <>
      <input type="file" onChange={handleChange} />
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <button onClick={handleClick}>upload</button>
    </>
  );
}

export default App;
