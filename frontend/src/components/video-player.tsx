import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    let player: Player | null = null;

    if (videoRef.current) {
      // Delay init to let React commit DOM
      setTimeout(() => {
        if (videoRef.current && !playerRef.current) {
          player = videojs(videoRef.current, {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
              {
                src,
                type: "application/x-mpegURL", // HLS
              },
            ],
          });

          
let qualityLevels = player.qualityLevels();
          playerRef.current = player;
        }
      }, 0);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
