import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, VolumeUp, VolumeX } from "../../../utils/icons";

const Minimal = ({ attributes }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const { radioPlayer } = attributes;
  const { streamURL } = radioPlayer;
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef();
  const volInputRef = useRef();

  useEffect(() => {
    audioRef.current = new Audio(streamURL);
    audioRef.current.preload = "none";

    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    audioRef.current.addEventListener("timeupdate", updateTime);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current = null;
      }
    };
  }, [streamURL]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (!isPlaying) {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (!audioRef.current) return;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const toggleVolume = () => {
    if (!audioRef.current) return;
    handleVolumeChange(volume === 0 ? 1 : 0);
  };

  const onVolumeSliderChange = (e) => {
    handleVolumeChange(parseFloat(e.target.value));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (volInputRef.current) {
      const percentage = volume * 100;
      volInputRef.current.style.background = `linear-gradient(90deg, #19afff ${percentage}%, #d1d9de ${percentage}%)`;
    }
  }, [volume]);

  return (
    <section
      className="minimal"
      role="region"
      aria-label="Minimal audio player"
    >
      <div className="minimalContainer">
        <div className="minimal-controls">
          {/* Play / Pause */}
          <button
            className="play-icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            aria-pressed={isPlaying}
            disabled={isLoading}
          >
            {isLoading ? (
              <div
                className="loading-spinner"
                role="status"
                aria-label="Loading audio"
              />
            ) : isPlaying ? (
              <PauseIcon aria-hidden="true" />
            ) : (
              <PlayIcon aria-hidden="true" />
            )}
          </button>

          {/* Current time */}
          <time
            className="running-time"
            aria-label={`Current playback time ${formatTime(currentTime)}`}
          >
            {formatTime(currentTime)}
          </time>

          {/* Volume controls */}
          <div className="vol-control">
            <button
              className="vol-btn"
              onClick={toggleVolume}
              aria-label={volume === 0 ? "Unmute" : "Mute"}
              aria-pressed={volume === 0}
            >
              {volume === 0 ? (
                <VolumeX aria-hidden="true" />
              ) : (
                <VolumeUp aria-hidden="true" />
              )}
            </button>

            {/* <label htmlFor="minimal-volume" className="sr-only">
              Volume control
            </label> */}
            <input
              id="minimal-volume"
              ref={volInputRef}
              className="vol-range"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={onVolumeSliderChange}
              aria-label="Volume"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={volume}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Minimal;
