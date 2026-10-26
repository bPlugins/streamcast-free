import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  VolumeUp,
  VolumeX,
  Share2,
  Twitter,
  Facebook,
  Email,
} from "../../../utils/icons";

const EchoStream = ({ attributes, fetchedStationName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef();
  const volumeTimeout = useRef();
  const { radioPlayer } = attributes;
  const { stationName, welcomeMessage, fetchNameFromUrl, streamURL } =
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
    )}&body=${encodeURIComponent("Listen here: " + streamURL)}`,
  };

  useEffect(() => {
    audioRef.current = new Audio(streamURL);
    audioRef.current.preload = "none";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
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

    if (volumeTimeout.current) {
      clearTimeout(volumeTimeout.current);
    }
    volumeTimeout.current = setTimeout(() => {
      setShowVolume(false);
    }, 2000);
  };

  const toggleVolume = () => {
    if (!audioRef.current) return;
    handleVolumeChange(volume === 0 ? 1 : 0);
  };

  return (
    <section
      className="echoStream"
      role="region"
      aria-label="EchoStream audio player"
    >
      <div className="echoStream__container">
        <div className="echoStream__bg-blur" aria-hidden="true"></div>

        <div className="echoStream__content">
          <div className="echoStream__info">
            <h1>{fetchNameFromUrl ? fetchedStationName : stationName}</h1>
            {welcomeMessage && <p>{welcomeMessage}</p>}
          </div>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`echoStream__play-button ${isLoading ? "loading" : ""}`}
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

          <div className="echoStream__controls">
            {/* Volume */}
            <div className="echoStream__volume-control">
              <button
                onClick={toggleVolume}
                onMouseEnter={() => setShowVolume(true)}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
                aria-pressed={volume === 0}
              >
                {volume === 0 ? (
                  <VolumeX aria-hidden="true" />
                ) : (
                  <VolumeUp aria-hidden="true" />
                )}
              </button>

              {showVolume && (
                <div
                  className="volume-slider"
                  onMouseEnter={() => {
                    if (volumeTimeout.current) {
                      clearTimeout(volumeTimeout.current);
                    }
                  }}
                  onMouseLeave={() => {
                    volumeTimeout.current = setTimeout(() => {
                      setShowVolume(false);
                    }, 1000);
                  }}
                >
                  {/* <label style={{display: n}} htmlFor="echo-volume" className="sr-only">
                    Volume control
                  </label> */}
                  <input
                    id="echo-volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) =>
                      handleVolumeChange(parseFloat(e.target.value))
                    }
                    aria-valuemin={0}
                    aria-valuemax={1}
                    aria-valuenow={volume}
                    aria-label="Volume"
                  />
                </div>
              )}
            </div>

            {/* Live indicator */}
            <div
              className="echoStream__live-indicator"
              role="status"
              aria-label="Live broadcast"
            >
              <span aria-hidden="true"></span>
              <span>Live</span>
            </div>

            {/* Share */}
            <button
              onClick={() => setShowShare(!showShare)}
              aria-expanded={showShare}
              aria-label="Share this station"
            >
              <Share2 aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Share popup */}
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

            <div className="echoStream__share" role="dialog" aria-label="Share">
              <div className="echoStream__share-links">
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

export default EchoStream;
