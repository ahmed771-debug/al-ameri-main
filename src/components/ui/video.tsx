import React, { useRef, useState, useEffect } from "react";

interface CustomVideoPlayerProps {
  videoSrc: string; // URL of the video to play
  adText: string; // Text to display as advertisement
  onEnd: any; // Function to handle video end event
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoSrc,
  adText,
  onEnd,
}) => {
  const ref = useRef<HTMLVideoElement | null>(null); // Reference to the video element
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State for play/pause
  const [progress, setProgress] = useState<number>(0); // Progress percentage
  const [isBuffering, setIsBuffering] = useState<boolean>(false); // State for buffering

  // Update progress on time update
  const handleTimeUpdate = () => {
    if (ref.current) {
      const percent =
        (ref.current.currentTime / (ref.current.duration || 1)) * 100;
      setProgress(percent);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(0); // Reset progress on end
    if (onEnd) onEnd(); // Call the onEnd function if provided
  };

  // Show loader when buffering
  const handleWaiting = () => {
    setIsBuffering(true);
  };

  // Hide loader when ready to play
  const handleCanPlay = () => {
    setIsBuffering(false);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.play(); // Autoplay the video
      setIsPlaying(true);
    }
  }, []);

  return (
    <div
      className="relative custom-video-player"
      style={{ maxWidth: "740px", margin: "auto" }}
    >
      <div style={{ position: "relative" }}>
        <video
          ref={ref}
          onLoadedData={() => console.log("Video loaded")}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnd}
          onWaiting={handleWaiting} // Trigger when buffering
          onCanPlay={handleCanPlay} // Trigger when ready to play
          height="360"
          style={{ width: "100%", borderRadius: "8px" }}
          autoPlay={true}
          muted
          // Enable autoplay
          // Mute the video for autoplay to work on most browsers
          // Enable video controls for play/pause, full-screen, etc.
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Buffering Loader */}
        {isBuffering && (
          <div
            className="buffer-loader"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "15px",
              borderRadius: "50%",
              zIndex: 10,
            }}
          >
            <div
              style={{
                border: "4px solid #f3f3f3",
                borderRadius: "50%",
                borderTop: "4px solid yellow",
                width: "40px",
                height: "40px",
                animation: "spin 2s linear infinite",
              }}
            ></div>
          </div>
        )}

        {/* Ad Text */}
        <div
          className="ad-text"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "5px 10px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          {adText}
        </div>

        {/* Yellow progress line */}
        <div
          className="progress-container"
          style={{
            position: "absolute",
            bottom: "50px",
            left: "0",
            width: "100%",
            height: "5px",
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "5px",
          }}
        >
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "yellow",
              borderRadius: "5px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
