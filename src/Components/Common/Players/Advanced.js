import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import defaultArtWorkImage from "../../../../public/images/default.png";

const Advanced = ({ attributes, fetchedStationName }) => {
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
  } = radioPlayer;

  const [newStationName, setNewStationName] = useState(fetchedStationName);
  const advConRef = useRef(null);

  // Initialize jQuery musicPlayer
  useEffect(() => {
    $(advConRef?.current).musicPlayer({
      autoPlay,
      volume: initialVolume,
      loop: false,
      timeSeparator: " / ",
      playerAbovePlaylist: true,
      infoElements: ["title", "artist"],
      elements: [
        "artwork",
        "information",
        "controls",
        ...(showTime ? ["time"] : []),
        "volume",
      ],
      timeElements: ["current"],
      controlElements: ["play", "stop"],
    });
    setNewStationName(fetchedStationName);
  }, [
    advConRef.current,
    fetchedStationName,
    autoPlay,
    initialVolume,
    showTime,
    welcomeMessage,
    artWork,
  ]);

  // Update station name display
  useEffect(() => {
    if (advConRef.current) {
      const artistEl = advConRef.current.querySelector(".artist");
      const titleEl = advConRef.current.querySelector(".title");
      if (fetchNameFromUrl) {
        if (newStationName) {
          titleEl.textContent = "";
          artistEl.style.top = "23px";
          artistEl.textContent = newStationName;
        }
      } else {
        titleEl.textContent = welcomeMessage;
        artistEl.style.top = "42px";
      }
    }
  }, [
    advConRef.current,
    newStationName,
    fetchedStationName,
    welcomeMessage,
    fetchNameFromUrl,
  ]);

  // Fallback if fetchNameFromUrl = false
  useEffect(() => {
    if (!fetchNameFromUrl && advConRef.current) {
      const artistEl = advConRef.current.querySelector(".artist");
      if (artistEl) {
        artistEl.textContent = stationName;
      }
    }
  }, [fetchNameFromUrl, stationName]);

  // Adjust height and artwork
  useEffect(() => {
    const mainPlayer = $(advConRef.current).musicPlayer("player");
    if (!mainPlayer || !mainPlayer[0]) return;

    if (!showTime) {
      mainPlayer[0].firstChild.style.height = "180px";
      if (mainPlayer[0].firstChild) {
        mainPlayer[0].firstChild
          .querySelectorAll(".timeHolder")
          .forEach((child) => {
            child.remove();
          });
      }
    } else {
      mainPlayer[0].firstChild.style.height = "200px";
      const firstChild = mainPlayer[0].firstChild;
      const existingTimeHolder = firstChild.querySelector(".timeHolder");
      if (!existingTimeHolder) {
        const timeHolder = document.createElement("div");
        timeHolder.className = "timeHolder";
        const currentTime = document.createElement("time");
        currentTime.className = "time-current";
        currentTime.setAttribute("aria-label", "Current playback time");
        currentTime.textContent = "0:00";
        timeHolder.appendChild(currentTime);
        if (firstChild.children.length > 0) {
          firstChild.insertBefore(timeHolder, firstChild.lastChild);
        } else {
          firstChild.appendChild(timeHolder);
        }
      }
    }

    // Add accessible artwork
    const artworkUrl = (artWork?.url ?? artWork) ? (artWork?.url ?? artWork) : defaultArtWorkImage;
    const artworkContainer = mainPlayer[0].firstChild.firstChild;
    artworkContainer.style.backgroundImage = `url("${artworkUrl}")`;
    artworkContainer.setAttribute("role", "img");
    artworkContainer.setAttribute(
      "aria-label",
      `Artwork for ${fetchNameFromUrl ? fetchedStationName : stationName}`
    );
  }, [showTime, artWork, fetchNameFromUrl, fetchedStationName, stationName]);

  return (
    <section
      style={{ width: "100%", overflow: "hidden" }}
      className="sc_radio advanced-container"
      role="region"
      aria-label="Advanced audio player"
    >
      <div
        className="advanced-streamcast"
        style={{ width: "390px" }}
        ref={advConRef}
      >
        <ul className="playlist">
          <li
            data-cover={artWork?.url ? artWork.url : defaultArtWorkImage}
            aria-label={`Playlist item for ${
              fetchNameFromUrl ? fetchedStationName : stationName
            }`}
          >
            <a href={streamURL}>
              {welcomeMessage || "Listen to the radio stream"}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Advanced;
