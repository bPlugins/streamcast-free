import React, { useRef, useState, useEffect } from "react";
import {
  PauseIcon,
  PlayIcon,
  StopIcon,
  VolumeUp,
  VolumeX,
} from "../../../utils/icons";
import defaultArtWorkImage from "../../../../public/images/default.png";

const Advanced2 = ({ attributes, fetchedStationName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const volInputRef = useRef();

  const { radioPlayer } = attributes;
  const {
    streamURL,
    stationName,
    welcomeMessage,
    artWork,
    autoPlay,
    initialVolume,
    showTime,
    fetchNameFromUrl,
    playerPosition,
  } = radioPlayer;

  // Set initial volume and autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    const vol = initialVolume !== undefined ? initialVolume / 100 : 1;
    setVolume(vol);

    if (autoPlay) {
      audio.muted = true;

      audio
        .play()
        .then(() => {
          audio.muted = false;
          audio.volume = vol;
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      // If not autoplay, just set volume
      audio.volume = vol;
    }
  }, [autoPlay, initialVolume]);

  // Update current time while audio plays
  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  // Play / Pause audio
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  // Stop audio and reset timing
  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Volume control
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const toggleVolume = () => handleVolumeChange(volume === 0 ? 1 : 0);

  const onVolumeSliderChange = (e) =>
    handleVolumeChange(parseFloat(e.target.value));

  useEffect(() => {
    if (volInputRef.current) {
      const percentage = volume * 100;
      volInputRef.current.style.background = `linear-gradient(90deg, #151b48 ${percentage}%, white ${percentage}%)`;
    }
  }, [volume]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={`advanced-player align-${playerPosition}`}>
      <div className="advanced-details">
        <div>
          <img src={(artWork?.url ?? artWork) ? (artWork?.url ?? artWork) : defaultArtWorkImage} alt="" />
        </div>

        <div className="details">
          <div className="info">
            <h3>{fetchNameFromUrl ? fetchedStationName : stationName}</h3>
            <p>{welcomeMessage || "Listen to the radio stream"}</p>
          </div>

          <div className="controls">
            <div className="playPauseIcon control-btn-wrapper">
              <button onClick={handlePlayPause} className="btn play">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
            <div className="stopIcon control-btn-wrapper">
              <button onClick={handleStop} className="btn stop">
                <StopIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="volume-progress">
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
        <input
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

      {showTime && (
        <div className="time-display">{formatTime(currentTime)}</div>
      )}

      <audio ref={audioRef} src={streamURL} />
    </div>
  );
};

export default Advanced2;
