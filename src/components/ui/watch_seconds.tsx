import React, { useRef, useEffect, useState } from "react";

interface WatchVideoPlayerProps {
  trainerId: number;
  videoSrc: string;
  initialProgress: number;
  onInitialProgressPost: (trainerId: number, timeInSeconds: number) => void;
  onProgressUpdate: (trainerId: number, timeInSeconds: number) => void;
  progress: any;
}

const WatchVideoPlayer: React.FC<WatchVideoPlayerProps> = ({
  trainerId,
  videoSrc,
  initialProgress,
  onInitialProgressPost,
  onProgressUpdate,
  progress,
}) => {
  const [watchStatus, setWatchStatus] = useState<string>("not watched");
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const savedWatchStatus = JSON.parse(
      localStorage.getItem("watchStatus") || "{}"
    );
    setWatchStatus(savedWatchStatus[trainerId] || "not watched");

    if (videoRef.current && initialProgress) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [trainerId, initialProgress]);

  const handlePause = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const currentTime = Math.floor(event.currentTarget.currentTime);
    if (watchStatus === "not watched") {
      setWatchStatus("watching");
      onInitialProgressPost(trainerId, currentTime);
    } else {
      onProgressUpdate(trainerId, currentTime);
    }
  };

  const handleVideoComplete = () => {
    setWatchStatus("watched");
    const updatedWatchStatus = JSON.parse(
      localStorage.getItem("watchStatus") || "{}"
    );
    updatedWatchStatus[trainerId] = "watched";
    // if(Math.round(totalDuration)===p)
    localStorage.setItem("watchStatus", JSON.stringify(updatedWatchStatus));
  };

  // Set video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setTotalDuration(videoRef.current.duration);
    }
  };
  return (
    <div className="video-player">
      <video
        ref={videoRef}
        controls
        width="320"
        height="140"
        style={{ objectFit: "cover", maxHeight: "11.5rem" }}
        onPause={handlePause}
        onEnded={handleVideoComplete}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p
        style={{
          color:
            watchStatus === "watched"
              ? "green"
              : watchStatus === "watching"
              ? "orange"
              : "red",
        }}
      >
        {watchStatus}
      </p>
      <p>Total Duration: {totalDuration.toFixed(2)} seconds</p>
    </div>
  );
};

export default WatchVideoPlayer;
