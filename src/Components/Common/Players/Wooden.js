import React, { useEffect, useState, useRef } from "react";
import { PauseIcon, PlayIcon, VolumeUp, VolumeX } from "../../../utils/icons";

const Wooden = ({ attributes, fetchedStationName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef();
  const woodenPlayerRef = useRef();
  const volumeTimeout = useRef();
  const { radioPlayer } = attributes;
  const { stationName, fetchNameFromUrl, streamURL } = radioPlayer;

  useEffect(() => {
    audioRef.current = new Audio(streamURL);
    audioRef.current.preload = "none";

    const updateTime = () => setCurrentTime(audioRef.current.currentTime);

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
        woodenPlayerRef.current.classList.add("playing");
      } else {
        woodenPlayerRef.current.classList.remove("playing");
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

    if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
    volumeTimeout.current = setTimeout(() => setShowVolume(false), 2000);
  };

  const toggleVolume = () => {
    if (!audioRef.current) return;
    handleVolumeChange(volume === 0 ? 1 : 0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <section
      className="woodenPlayer"
      ref={woodenPlayerRef}
      role="region"
      aria-label="Audio player"
    >
      <div className="woodenContainer">
        <div className="discarea" aria-hidden="true">
          <div className="disc"></div>
          <div className="stylus">
            <div className="pivot"></div>
            <div className="arm"></div>
            <div className="head"></div>
          </div>
        </div>

        <div className="contentBox">
          <h2 className="title wooodenTiitle">
            {fetchNameFromUrl ? fetchedStationName : stationName}
          </h2>

          <div className="woodenControls">
            <button
              className={`play-pause-btn ${isLoading ? "loading" : ""}`}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-pressed={isPlaying}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner" aria-label="Loading audio" />
              ) : isPlaying ? (
                <PauseIcon aria-hidden="true" />
              ) : (
                <PlayIcon className="playIcon" aria-hidden="true" />
              )}
            </button>

            <button
              className="toggleVol"
              onClick={toggleVolume}
              aria-label={volume === 0 ? "Unmute" : "Mute"}
              aria-pressed={volume === 0}
              onMouseEnter={() => setShowVolume(true)}
            >
              {volume === 0 ? (
                <VolumeX aria-hidden="true" />
              ) : (
                <VolumeUp aria-hidden="true" />
              )}
            </button>

            {/* <label
              htmlFor="volumeControl"
              className="sr-only"
              style={{ display: "none" }}
            >
              Volume
            </label> */}
            <input
              id="volumeControl"
              className="woodenVolume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={volume}
              aria-label="Volume control"
            />
          </div>

          <div className="info">
            <div
              className="wooden-live-indicator"
              role="status"
              aria-label="Live broadcast"
            >
              <span aria-hidden="true"></span>
              <span>Live</span>
            </div>
            <time
              className="time"
              aria-label={`Current playback time ${formatTime(currentTime)}`}
            >
              {formatTime(currentTime)}
            </time>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wooden;
