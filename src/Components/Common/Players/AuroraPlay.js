import React, { useEffect, useRef, useState } from "react";
import {
  Email,
  Facebook,
  PauseIcon,
  PlayIcon,
  Share2,
  Twitter,
  VolumeUp,
  VolumeX,
} from "../../../utils/icons";

const AuroraPlay = ({ attributes, fetchedStationName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef();
  const volumeTimeout = useRef();
  const { radioPlayer } = attributes;
  const { artWork, fetchNameFromUrl, stationName, welcomeMessage, streamURL } =
    radioPlayer;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      streamURL
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      streamURL
    )}&text=${encodeURIComponent("Listening to this awesome radio!")}`,
    email: `mailto:?subject=${encodeURIComponent(
      "Check out this Radio"
    )}&body=${encodeURIComponent(
      "Listen to this awesome radio here: " + streamURL
    )}`,
  };

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
    if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
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
      className="auroraPlay"
      role="region"
      aria-label="Aurora audio player"
    >
      <div className="auroraContainer">
        {/* Artwork */}
        <div className="posterImg">
          <img
            src={artWork?.url ?? artWork}
            alt={`Artwork for ${
              fetchNameFromUrl ? fetchedStationName : stationName
            }`}
          />
        </div>

        {/* Info + Play/Pause */}
        <div className="audio-stuff">
          <div className="details-play-pause">
            <button
              className={`play-pause-btn ${isLoading ? "loading" : ""}`}
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
                <PlayIcon className="playIcon" aria-hidden="true" />
              )}
            </button>

            <div className="details">
              <h3>
                {(fetchNameFromUrl ? fetchedStationName : stationName)?.length >
                50
                  ? (fetchNameFromUrl
                      ? fetchedStationName
                      : stationName
                    )?.slice(0, 50) + "..."
                  : fetchNameFromUrl
                  ? fetchedStationName
                  : stationName}
              </h3>
              {welcomeMessage && <p>{welcomeMessage}</p>}
            </div>
          </div>

          {/* Volume + Share + Time */}
          <div className="volume-audioTime">
            <div className="vol-and-share-btn">
              <button
                className="vol"
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

              <button
                className="share2"
                onClick={() => setShowShare(!showShare)}
                aria-label="Share this station"
                aria-expanded={showShare}
              >
                <Share2 aria-hidden="true" />
              </button>
            </div>

            <div className="currentTime">
              <span aria-hidden="true"></span>
              <time
                className="time"
                aria-label={`Current playback time ${formatTime(currentTime)}`}
              >
                {formatTime(currentTime)}
              </time>
            </div>
          </div>
        </div>

        {/* Share menu */}
        {showShare && (
          <>
            <div
              className="overlay"
              role="button"
              tabIndex={0}
              aria-label="Close share options"
              onClick={() => setShowShare(false)}
              onKeyDown={(e) => e.key === "Enter" && setShowShare(false)}
            ></div>

            <div
              className="auroraPlay-share"
              role="dialog"
              aria-label="Share station"
            >
              <div className="auroraPlay-share-links">
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                >
                  <Twitter aria-hidden="true" />
                </a>
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                >
                  <Facebook aria-hidden="true" />
                </a>
                <a href={shareLinks.email} aria-label="Share via Email">
                  <Email aria-hidden="true" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AuroraPlay;
