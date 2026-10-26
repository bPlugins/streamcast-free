import React, { useEffect, useRef, useState } from "react";
import pauseIcon from "../../../../public/images/Pause_circle_icon.png";
import playIcon from "../../../../public/images/Play_circle_icon.png";

const Standard = ({ attributes, id, fetchedStationName }) => {
  const { radioPlayer } = attributes;
  const {
    skin,
    initialVolume,
    streamURL,
    autoPlay,
    stationName,
    welcomeMessage,
    playerPosition,
    fetchNameFromUrl,
  } = radioPlayer;

  const iframeRef = useRef(null);
  const audioRef = useRef(null);
  const [finalStreamURL, setFinalStreamURL] = useState("");

  useEffect(() => {
    window[id] = {
      url: streamURL,
      lang: "en",
      codec: "mp3",
      volume: initialVolume,
      autoplay: autoPlay,
      forceHTML5: true,
      jsevents: true,
      buffering: 0,
      title: fetchNameFromUrl ? fetchedStationName : stationName,
      welcome: welcomeMessage,
      wmode: "transparent",
      skin: skin.name,
      width: skin.width,
      height: skin.height,
      metadataMode: "shoutcast",
      metadataInterval: 15,
    };
  }, [
    skin,
    streamURL,
    initialVolume,
    autoPlay,
    stationName,
    welcomeMessage,
    playerPosition,
    fetchNameFromUrl,
    fetchedStationName,
  ]);

  // Apply styles to iframe
  const applyStyles = () => {
    if (iframeRef.current) {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow.document;
      if (iframeDoc) {
        const targetDiv = iframeDoc.querySelector(
          "#MusesRadioPlayer-HTML5-player-0"
        );
        if (targetDiv) {
          if (playerPosition === "center") {
            targetDiv.style.margin = "auto";
            targetDiv.style.display = "block";
          } else if (playerPosition === "left") {
            targetDiv.style.marginLeft = "0";
            targetDiv.style.marginRight = "auto";
          } else if (playerPosition === "right") {
            targetDiv.style.marginLeft = "auto";
            targetDiv.style.marginRight = "0";
          }
        }
      }
    }
  };

  useEffect(() => {
    applyStyles();
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        applyStyles();
      };
    }
  }, [playerPosition]);

  // Handle .pls file parsing
  useEffect(() => {
    const getStreamURL = async () => {
      const ext = streamURL.split(".").pop();
      if (ext === "pls") {
        try {
          const response = await fetch(streamURL);
          const text = await response.text();
          const lines = text.split("\n");
          for (const line of lines) {
            if (line.toLowerCase().includes("file1=")) {
              const url = line.replace(/file1=/i, "").trim();
              setFinalStreamURL(url);
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching the stream URL:", error);
        }
      } else {
        setFinalStreamURL(streamURL.trim());
      }
    };

    getStreamURL();
  }, [streamURL]);

  // Setup Plyr for b_circle
  useEffect(() => {
    if (skin.name === "b_circle" && finalStreamURL && audioRef.current) {
      const audio = document.querySelector(".streamcast_custom_circle audio");
      const player = new window.Plyr(audio, {
        controls: `
          <div class="plyr__controls">
            <button  
              class="plyr__control" 
              aria-label="Play or pause"
              data-plyr="play"
              aria-pressed="false"
            >
              <img src=${pauseIcon} alt="" class="icon--pressed" aria-hidden="true" />
              <img src=${playIcon} alt="" class="icon--not-pressed" aria-hidden="true" />
              <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
              <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
            </button>
          </div>
        `,
      });

      player.on("ready", function () {
        const iconPressed = document.querySelector(".icon--pressed");
        const iconNotPressed = document.querySelector(".icon--not-pressed");
        let playing = true;

        player.on("pause", function () {
          player.play();
          if (playing) {
            player.muted = true;
            playing = false;
            iconNotPressed.style.display = "block";
            iconPressed.style.display = "none";
          } else {
            iconNotPressed.style.display = "none";
            iconPressed.style.display = "block";
            playing = true;
            player.muted = false;
          }
        });

        player.on("play", function () {
          if (player.volume === 0) {
            player.volume = 0.5;
          }
          if (playing) {
            player.muted = false;
          }
        });
      });
    }
  }, [skin, finalStreamURL, initialVolume]);

  return (
    <section
      className="standard-container"
      role="region"
      aria-label="Standard audio player"
    >
      {skin.name === "b_circle" ? (
        <div className="streamcast_custom_circle">
          <audio
            ref={audioRef}
            className="b_free"
            src={finalStreamURL}
            aria-label={`Audio stream for ${
              fetchNameFromUrl ? fetchedStationName : stationName
            }`}
          ></audio>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={`${window?.streamcastData?.iframePath}?id=${id}&${skin.name}`}
          width="100%"
          height={skin.height}
          title={`Radio player for ${
            fetchNameFromUrl ? fetchedStationName : stationName
          }`}
        ></iframe>
      )}
    </section>
  );
};

export default Standard;
