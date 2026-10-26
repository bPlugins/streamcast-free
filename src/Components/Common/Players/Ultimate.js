import React, { useEffect, useRef, useState } from "react";
import defaultImg from "../../../../public/images/on-air.png";

const Ultimate = ({ attributes, fetchedStationName }) => {
  const { radioStyles, radioPlayer } = attributes;
  const {
    streamProvider,
    streamMountPoint,
    streamPort,
    streamURL,
    fetchNameFromUrl,
    stationName,
  } = radioPlayer;
  const { ultimate } = radioStyles;
  const { playerTheme, posterImg, progressActiveColor } = ultimate;

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);

  const initializeAudioContext = () => {
    if (!audioRef.current) return;

    audioCtxRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    sourceRef.current = audioCtxRef.current.createMediaElementSource(
      audioRef.current
    );
    analyserRef.current = audioCtxRef.current.createAnalyser();

    sourceRef.current.connect(analyserRef.current);
    sourceRef.current.connect(audioCtxRef.current.destination);
  };

  const getFinalStreamURL = (
    streamProvider,
    streamURL,
    streamPort,
    streamMountPoint
  ) => {
    let finalStreamURL = "";

    if (streamProvider === "shout-cast") {
      finalStreamURL = `${streamURL}:${streamPort}/;`;
    } else if (streamProvider === "ice-cast") {
      finalStreamURL = `${streamURL}:${streamPort}/${streamMountPoint}`;
    } else {
      finalStreamURL = streamURL;
    }

    return finalStreamURL + "?download=false";
  };

  const isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  const pauseIcon =
    "<svg xmlns='http://www.w3.org/2000/svg' width='130' height='130' viewBox='0 0 800 800'><path d='M86.3,400.7C84.8,229.1,226.5,86.7,400.6,87c172.9,0.3,313.7,142.5,313.1,314.8c-0.6,170.5-138.2,313.3-314.4,313.1	C224.3,714.7,84.9,572.1,86.3,400.7z M378.8,400.8C378.8,400.8,378.7,400.8,378.8,400.8c-0.1-32.6-0.5-65.3,0.2-97.9	c0.3-13.7-10.3-23.4-22.7-22.8c-18.3,0.8-36.6,0.2-54.8,0.2c-13.9,0-22.1,8.1-22.1,21.9c0,65.7,0.2,131.4-0.2,197.1	c-0.1,12.6,9.2,22.6,22.4,22.2c18.4-0.6,36.9-0.5,55.3,0c12.1,0.3,22.2-7.4,22-21.9C378.6,466.7,378.8,433.8,378.8,400.8z	 M420.9,400.8C420.9,400.8,420.9,400.8,420.9,400.8c0.1,33.1,0,66.1,0.1,99.2c0,13.8,7.7,21.4,21.5,21.4c18.8,0,37.7-0.3,56.5,0.1	c12.3,0.3,21.6-9.6,21.5-21.4c-0.2-66.1-0.1-132.2-0.1-198.3c0-13.3-8.2-21.4-21.7-21.5c-18.6,0-37.2,0.5-55.7-0.2	c-12-0.5-22.5,9.2-22.3,22C421.2,335,420.9,367.9,420.9,400.8z'></path></svg>";
  const playIcon =
    "<svg xmlns='http://www.w3.org/2000/svg' width='130' height='130' viewBox='0 0 800 800'><path d='M713.9,400.5c1.4,171.2-137.8,314.4-313.9,314.3c-175.6,0-314.2-143-314-315c0.2-171.3,140.6-313.9,315-313.4	C574,87,715.4,228.9,713.9,400.5z M279.5,400.3c0,23.1,0,46.2,0,69.3c0,20.8-0.2,41.7,0.1,62.5c0.1,12.2,6,21.1,17,26.6	c11,5.5,21.2,3,31.2-2.9c23.3-13.6,46.8-27,70.2-40.5c49.8-28.6,99.6-57.1,149.3-85.8c18.1-10.4,18.7-38.7,1.1-49.4	c-74.5-45.4-149-90.8-223.5-136.1c-6-3.7-12.6-5.5-19.8-4.2c-15.7,2.9-25.5,14.4-25.5,30.5C279.4,313.6,279.5,357,279.5,400.3z' /></svg>";

  useEffect(() => {
    if (!audioCtxRef.current) {
      initializeAudioContext();
    }

    const allAudioPlayer = document.querySelectorAll(".bRadioPlayer");

    Object.values(allAudioPlayer).map((audioPlayer) => {
      const audioElement = audioPlayer.querySelector(`#bRadioAudio`);
      const playPauseButton = document.querySelector(`.playPauseAudio`);
      const volumeBar = document.querySelector(`.volumeBar`);
      const volumeZero = document.querySelector(`.rangeControls .mute`);
      const volumePlace = document.querySelector(`.rangeControls .volumePlace`);
      const volumeHundred = document.querySelector(`.rangeControls .unMute`);

      const isMobile = 544 > window.innerWidth; // Is Mobile

      const audioState = {
        isReplay: false,
        isPaused: true,
      };

      const audioPlayPause = () => {
        if (audioState.isPaused) {
          playPauseButton.innerHTML = pauseIcon;
          audioRef.current.play();
        } else {
          if (audioState.isReplay) {
            // Replay
            playPauseButton.innerHTML = pauseIcon;
            audioRef.current.play();
            audioState.isReplay = false;
            return;
          }
          playPauseButton.innerHTML = playIcon;
          audioRef.current.pause();
        }

        audioState.isPaused = !audioState.isPaused;
      };

      playPauseButton.addEventListener("click", () => {
        if (isChrome) {
          audioCtxRef.current?.resume().then((res) => {
            audioPlayPause();
          });
        } else {
          audioPlayPause();
        }
      });

      // Volume Control
      volumeBar.value = 50;

      const volumeBarStyle = (val) => {
        volumeBar.style.background = `-webkit-gradient(linear, left top, right top, color-stop(${val}%,${progressActiveColor}), color-stop(${val}%, #fff))`;
        volumeBar.style.background = `linear-gradient(90deg,${progressActiveColor} ${val}%, #fff ${val}%)`;

        volumePlace.innerHTML = `${parseInt(val)}%`;
      };

      // Set Volume by clicking volume progress
      volumeBar.addEventListener("input", (e) => {
        volumeBar.value = e.target.value;
        audioElement.volume = e.target.value / 100;

        volumeBarStyle(e.target.value);
      });

      // Set Volume by clicking on the mute and unmute button
      volumeZero.addEventListener("click", () => {
        const interval = setInterval(() => {
          if (volumeBar.value > 0) {
            volumeBar.value--;
            audioElement.volume = volumeBar.value / 100;

            volumeBarStyle(volumeBar.value);
          } else {
            clearInterval(interval);
          }
        });
      });

      volumeHundred.addEventListener("click", () => {
        const interval = setInterval(() => {
          if (volumeBar.value < 100) {
            volumeBar.value++;
            audioElement.volume = volumeBar.value / 100;

            volumeBarStyle(volumeBar.value);
          } else {
            clearInterval(interval);
          }
        });
      });

      const frequencyData = new Uint8Array(
        analyserRef.current.frequencyBinCount
      );
      analyserRef.current.getByteFrequencyData(frequencyData);

      // Visualize Circle
      const visualizerCircleContainer = document.querySelector(
        `#${audioPlayer.id} .visualizerCircle`
      ); // Visualizer Circle container
      const visualizerCircle = () => {
        const numberOfCircleEl = 360; // The number of circle elements that should be displayed

        // Create a set of pre-defined circle elements
        for (let i = 0; i < numberOfCircleEl; i++) {
          const circleEl = document.createElement("SPAN");
          circleEl.setAttribute("id", `circleEl${i}`);
          circleEl.setAttribute("class", "visualizerCircleEl");
          visualizerCircleContainer.appendChild(circleEl);
        }

        // This function has the task to adjust the circle elements heights according to the frequency data
        const renderCircleFrame = () => {
          // Update our frequency data array with the latest frequency data
          analyserRef.current.getByteFrequencyData(frequencyData);

          for (let i = 0; i < numberOfCircleEl; i++) {
            // Since the frequency data array is 1024 in length, we don't want to fetch
            // the first numberOfCircleEl of values, but try and grab frequencies over the whole spectrum
            const index = i + 40;
            // fd is a frequency value between 0 and 255
            const fd = frequencyData[index];

            // Fetch the circle elements
            const circleEl = document.querySelector(
              `#${audioPlayer.id}  .visualizerCircle #circleEl${i}`
            );
            if (!circleEl) {
              continue;
            }

            // If fd is undefined, default to 0, then make sure fd is at least 280
            // This will make make a quiet frequency at least 280px high for visual effects
            const initCircleElHeight = isMobile ? 206 : 280;

            const circleElHeight = Math.max(
              initCircleElHeight,
              fd / 2 + initCircleElHeight || 0
            );
            circleEl.style.height = `${circleElHeight}px`;
            circleEl.style.transform = `translate(-50%, -50%) rotate(${i - 90
              }deg)`;
          }

          // At the next animation frame, call ourselves
          requestAnimationFrame(renderCircleFrame);
        };
        renderCircleFrame();
      };

      // Visualizer Bar
      const visualizerBarContainer = document.querySelector(
        `#${audioPlayer.id} .visualizerBar`
      ); // Visualizer Bar container
      const visualizerBar = () => {
        const numberOfBarEl = 50; // The number of bar elements that should be displayed

        // Create a set of pre-defined bar elements
        for (let i = 0; i < numberOfBarEl; i++) {
          const barEl = document.createElement("SPAN");
          barEl.setAttribute("id", `barEl${i}`);
          barEl.setAttribute("class", "visualizerBarEl");
          visualizerBarContainer.appendChild(barEl);
        }

        // This function has the task to adjust the bar elements heights according to the frequency data
        const renderBarFrame = () => {
          // Update our frequency data array with the latest frequency data
          analyserRef.current.getByteFrequencyData(frequencyData);

          for (let i = 0; i < numberOfBarEl; i++) {
            // Since the frequency data array is 1024 in length, we don't want to fetch
            // the first numberOfBarEl of values, but try and grab frequencies over the whole spectrum
            const index = (i + 10) * 10;
            // fd is a frequency value between 0 and 255
            const fd = frequencyData[index];

            // Fetch the bar elements DIV element
            const barEl = document.querySelector(
              `#${audioPlayer.id} .visualizerBar #barEl${i}`
            );
            if (!barEl) {
              continue;
            }

            // If fd is undefined, default to 0, then make sure fd is at least 2
            // This will make make a quiet frequency at least 2px high for visual effects
            const barElHeight = Math.max(2, fd || 0);
            barEl.style.height = `${barElHeight}px`;
          }

          // At the next animation frame, call ourselves
          requestAnimationFrame(renderBarFrame);
        };
        renderBarFrame();
      };

      // Toggle between visualizer
      const visualizerToggle = document.querySelector(
        `#${audioPlayer.id} .audioControl .visualizerToggle`
      );
      let isNumber = 0;
      visualizerToggle.addEventListener("click", () => {
        isNumber === 2 ? (isNumber = 0) : isNumber++;

        switch (isNumber) {
          case 0:
            visualizerBarContainer.innerHTML = "";
            visualizerCircleContainer.innerHTML = "";
            break;
          case 1:
            visualizerCircle();
            visualizerBarContainer.innerHTML = "";
            break;
          case 2:
            visualizerBar();
            visualizerCircleContainer.innerHTML = "";
        }
      });
    });
  }, []);

  return (
    // <div className="ultimate-container">
    //     <div id="bRadioPlayer" className={`bRadioPlayer ${playerTheme}`}>
    //         <div className="imageHolder">
    //             <img src={`${posterImg?.url !== "" ? posterImg === "" ? defaultImg : posterImg?.url : defaultImg}`} alt="300" />
    //             <div className="visualizerCircle"></div>
    //         </div>

    //         <div className="text">
    //             <p>{fetchNameFromUrl ? fetchedStationName : stationName}</p>
    //         </div>

    //         <input
    //             className="volumeBar"
    //             type="range"
    //             min="0"
    //             max="100"
    //             step="0.001"
    //             value="50"
    //         />

    //         <div className="rangeControls">
    //             <button className="mute" >
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 124.625 124.625">
    //                     <path d="M6,92.404h23.1l25.6,19.3c4,3,9.601,0.2,9.601-4.8v-89.2c0-4.9-5.701-7.8-9.601-4.8l-25.6,19.3H6c-3.3,0-6,2.7-6,6v48.301   C0,89.704,2.7,92.404,6,92.404z" />
    //                     <path d="M122.4,40.604c-2.7-2.7-7.2-2.7-9.9,0l-11.8,11.8l-11.8-11.8c-2.7-2.7-7.2-2.7-9.9,0c-2.699,2.7-2.699,7.2,0,9.9   l11.801,11.8L79,74.104c-2.699,2.7-2.699,7.2,0,9.9c1.4,1.399,3.2,2.1,5,2.1c1.801,0,3.6-0.7,5-2.1l11.801-11.801L112.6,84.004   c1.4,1.399,3.201,2.1,5,2.1c1.801,0,3.601-0.7,5-2.1c2.701-2.7,2.701-7.2,0-9.9l-12-11.8l11.801-11.8   C125.1,47.804,125.1,43.304,122.4,40.604z" />
    //                 </svg>
    //             </button>

    //             <span className="volumePlace">50%</span>

    //             <button className="unMute" >
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 93.038 93.038">
    //                     <path d="M46.547,75.521c0,1.639-0.947,3.128-2.429,3.823c-0.573,0.271-1.187,0.402-1.797,0.402c-0.966,0-1.923-0.332-2.696-0.973   l-23.098-19.14H4.225C1.892,59.635,0,57.742,0,55.409V38.576c0-2.334,1.892-4.226,4.225-4.226h12.303l23.098-19.14   c1.262-1.046,3.012-1.269,4.493-0.569c1.481,0.695,2.429,2.185,2.429,3.823L46.547,75.521L46.547,75.521z M62.784,68.919   c-0.103,0.007-0.202,0.011-0.304,0.011c-1.116,0-2.192-0.441-2.987-1.237l-0.565-0.567c-1.482-1.479-1.656-3.822-0.408-5.504   c3.164-4.266,4.834-9.323,4.834-14.628c0-5.706-1.896-11.058-5.484-15.478c-1.366-1.68-1.24-4.12,0.291-5.65l0.564-0.565   c0.844-0.844,1.975-1.304,3.199-1.231c1.192,0.06,2.305,0.621,3.061,1.545c4.977,6.09,7.606,13.484,7.606,21.38   c0,7.354-2.325,14.354-6.725,20.24C65.131,68.216,64.007,68.832,62.784,68.919z M80.252,81.976   c-0.764,0.903-1.869,1.445-3.052,1.495c-0.058,0.002-0.117,0.004-0.177,0.004c-1.119,0-2.193-0.442-2.988-1.237l-0.555-0.555   c-1.551-1.55-1.656-4.029-0.246-5.707c6.814-8.104,10.568-18.396,10.568-28.982c0-11.011-4.019-21.611-11.314-29.847   c-1.479-1.672-1.404-4.203,0.17-5.783l0.554-0.555c0.822-0.826,1.89-1.281,3.115-1.242c1.163,0.033,2.263,0.547,3.036,1.417   c8.818,9.928,13.675,22.718,13.675,36.01C93.04,59.783,88.499,72.207,80.252,81.976z" />
    //                 </svg>
    //             </button>
    //         </div>

    //         <div className="audioControl">
    //             <button className="visualizerToggle" >
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 800 800">
    //                     <path d="M180.3,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V235.8c0-13.5,11-24.5,24.5-24.5h72.4c13.5,0,24.5,11,24.5,24.5v469.1	C204.7,718.4,193.7,729.4,180.3,729.4" />
    //                     <path d="M351,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V331.7c0-13.5,11-24.5,24.5-24.5H351c13.5,0,24.5,11,24.5,24.5v373.2	C375.4,718.4,364.4,729.4,351,729.4" />
    //                     <path d="M521.9,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V95.1c0-13.5,11-24.5,24.5-24.5h72.4c13.5,0,24.5,11,24.5,24.5v609.8	C546.3,718.4,535.3,729.4,521.9,729.4" />
    //                     <path d="M692.1,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V331.7c0-13.5,11-24.5,24.5-24.5h72.4c13.5,0,24.5,11,24.5,24.5v373.2	C716.6,718.4,705.6,729.4,692.1,729.4" />
    //                 </svg>
    //             </button>

    //             <button className="playPauseAudio" >
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 800 800">
    //                     <path
    //                         d="M713.9,400.5c1.4,171.2-137.8,314.4-313.9,314.3c-175.6,0-314.2-143-314-315c0.2-171.3,140.6-313.9,315-313.4	C574,87,715.4,228.9,713.9,400.5z M279.5,400.3c0,23.1,0,46.2,0,69.3c0,20.8-0.2,41.7,0.1,62.5c0.1,12.2,6,21.1,17,26.6	c11,5.5,21.2,3,31.2-2.9c23.3-13.6,46.8-27,70.2-40.5c49.8-28.6,99.6-57.1,149.3-85.8c18.1-10.4,18.7-38.7,1.1-49.4	c-74.5-45.4-149-90.8-223.5-136.1c-6-3.7-12.6-5.5-19.8-4.2c-15.7,2.9-25.5,14.4-25.5,30.5C279.4,313.6,279.5,357,279.5,400.3z" />
    //                 </svg>
    //             </button>

    //             <button className="live">
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="-16 0 512 512.00113">
    //                     <path
    //                         d="m262.84375 140.558594c-12.699219 12.671875-33.28125 12.671875-45.980469 0-12.695312-12.671875-12.695312-33.21875 0-45.890625 12.699219-12.671875 33.28125-12.671875 45.980469 0 12.695312 12.671875 12.695312 33.21875 0 45.890625zm0 0" />
    //                     <path
    //                         d="m307.257812 189.726562c-3.960937 0-7.921874-1.511718-10.9375-4.539062-6.03125-6.039062-6.019531-15.824219.019532-21.851562 12.238281-12.214844 18.976562-28.453126 18.976562-45.722657s-6.738281-33.507812-18.976562-45.722656c-6.039063-6.03125-6.050782-15.8125-.019532-21.855469 6.027344-6.039062 15.8125-6.050781 21.851563-.019531 18.089844 18.054687 28.050781 42.058594 28.050781 67.597656 0 25.535157-9.960937 49.542969-28.050781 67.597657-3.015625 3.011718-6.964844 4.515624-10.914063 4.515624zm0 0" />
    //                     <path
    //                         d="m342.210938 235.222656c-3.960938 0-7.921876-1.511718-10.9375-4.535156-6.03125-6.042969-6.019532-15.824219.019531-21.855469 24.414062-24.367187 37.863281-56.761719 37.863281-91.21875s-13.449219-66.851562-37.863281-91.21875c-6.039063-6.03125-6.050781-15.8125-.019531-21.855469 6.03125-6.039062 15.8125-6.050781 21.851562-.019531 30.265625 30.207031 46.9375 70.371094 46.933594 113.09375 0 42.722657-16.667969 82.890625-46.933594 113.097657-3.015625 3.007812-6.964844 4.511718-10.914062 4.511718zm0 0" />
    //                     <path
    //                         d="m172.371094 189.726562c-3.949219 0-7.898438-1.503906-10.917969-4.515624-18.089844-18.054688-28.050781-42.0625-28.050781-67.597657 0-25.539062 9.960937-49.542969 28.050781-67.597656 6.039063-6.03125 15.824219-6.023437 21.851563.019531 6.03125 6.039063 6.019531 15.824219-.019532 21.855469-12.238281 12.214844-18.976562 28.453125-18.976562 45.722656s6.738281 33.507813 18.976562 45.722657c6.039063 6.027343 6.050782 15.8125.019532 21.851562-3.015626 3.023438-6.976563 4.539062-10.933594 4.539062zm0 0" />
    //                     <path
    //                         d="m137.417969 235.222656c-3.953125 0-7.902344-1.503906-10.917969-4.515625-30.265625-30.207031-46.933594-70.371093-46.933594-113.09375 0-42.726562 16.667969-82.890625 46.933594-113.097656 6.039062-6.027344 15.824219-6.019531 21.851562.023437 6.03125 6.039063 6.019532 15.820313-.019531 21.851563-24.414062 24.367187-37.863281 56.761719-37.863281 91.21875s13.449219 66.855469 37.863281 91.222656c6.039063 6.03125 6.050781 15.8125.019531 21.855469-3.015624 3.023438-6.976562 4.535156-10.933593 4.535156zm0 0" />
    //                     <path
    //                         d="m443.480469 261.9375h-407.332031c-19.964844 0-36.148438 16.183594-36.148438 36.144531v177.769531c0 19.964844 16.183594 36.148438 36.148438 36.148438h407.328124c19.964844 0 36.148438-16.183594 36.148438-36.148438v-177.769531c0-19.960937-16.183594-36.144531-36.144531-36.144531zm-324.609375 203.683594h-56.933594c-8.53125 0-15.449219-6.917969-15.449219-15.453125v-126.398438c0-8.53125 6.917969-15.453125 15.449219-15.453125 8.535156 0 15.453125 6.917969 15.453125 15.453125v110.945313h41.480469c8.535156 0 15.453125 6.917968 15.453125 15.453125 0 8.535156-6.917969 15.453125-15.453125 15.453125zm63.328125-15.453125c0 8.535156-6.917969 15.453125-15.453125 15.453125s-15.453125-6.917969-15.453125-15.453125v-126.398438c0-8.53125 6.917969-15.453125 15.453125-15.453125s15.453125 6.917969 15.453125 15.453125zm130.015625-121.929688-38.160156 126.394531c-.003907.011719-.007813.023438-.011719.035157-4.144531 14.144531-25.273438 13.796875-29.5625 0-.003907-.011719-.007813-.023438-.011719-.035157l-38.160156-126.394531c-2.464844-8.171875 2.15625-16.792969 10.328125-19.261719 8.164062-2.464843 16.792969 2.15625 19.257812 10.328126l23.367188 77.394531 23.367187-77.394531c2.46875-8.171876 11.089844-12.796876 19.261719-10.328126 8.167969 2.46875 12.792969 11.089844 10.324219 19.261719zm95.066406 35.320313c8.535156 0 15.453125 6.917968 15.453125 15.453125 0 8.53125-6.917969 15.453125-15.453125 15.453125h-43.851562v40.25h52.175781c8.535156 0 15.453125 6.917968 15.453125 15.453125 0 8.535156-6.917969 15.453125-15.453125 15.453125h-67.628907c-8.535156 0-15.453124-6.917969-15.453124-15.453125v-126.398438c0-8.53125 6.917968-15.453125 15.453124-15.453125h69.710938c8.53125 0 15.453125 6.917969 15.453125 15.453125 0 8.535157-6.921875 15.453125-15.453125 15.453125h-54.261719v24.335938zm0 0" />
    //                 </svg>
    //             </button>
    //         </div>

    //         <div className="visualizerBar"></div>

    //         <audio id="bRadioAudio" className="bRadioAudio" crossOrigin="anonymous" ref={audioRef} style={{ height: 0, width: 0, opacity: 0 }}>
    //             <source src={getFinalStreamURL(streamProvider, streamURL, streamPort, streamMountPoint)} />
    //         </audio>
    //     </div>
    // </div>

    <section
      className="ultimate-container"
      role="region"
      aria-label="Ultimate audio player"
    >
      <div id="bRadioPlayer" className={`bRadioPlayer ${playerTheme}`}>
        <div className="imageHolder">
          <img
            src={
              posterImg?.url !== ""
                ? posterImg === ""
                  ? defaultImg
                  : posterImg?.url
                : defaultImg
            }
            alt={`${fetchNameFromUrl ? fetchedStationName : stationName
              } station poster`}
          />
          <div className="visualizerCircle" aria-hidden="true"></div>
        </div>

        <div className="text">
          <h2>{fetchNameFromUrl ? fetchedStationName : stationName}</h2>
        </div>

        <label
          htmlFor="volumeBar"
          className="sr-only"
          style={{ display: "none" }}
        >
          Volume
        </label>
        <input
          id="volumeBar"
          className="volumeBar"
          type="range"
          min="0"
          max="100"
          step="0.001"
          defaultValue="50"
          aria-label="Volume control"
        />

        <div className="rangeControls">
          <button className="mute" aria-label="Mute audio">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="0 0 124.625 124.625"
            >
              <path d="M6,92.404h23.1l25.6,19.3c4,3,9.601,0.2,9.601-4.8v-89.2c0-4.9-5.701-7.8-9.601-4.8l-25.6,19.3H6c-3.3,0-6,2.7-6,6v48.301   C0,89.704,2.7,92.404,6,92.404z" />
              <path d="M122.4,40.604c-2.7-2.7-7.2-2.7-9.9,0l-11.8,11.8l-11.8-11.8c-2.7-2.7-7.2-2.7-9.9,0c-2.699,2.7-2.699,7.2,0,9.9   l11.801,11.8L79,74.104c-2.699,2.7-2.699,7.2,0,9.9c1.4,1.399,3.2,2.1,5,2.1c1.801,0,3.6-0.7,5-2.1l11.801-11.801L112.6,84.004   c1.4,1.399,3.201,2.1,5,2.1c1.801,0,3.601-0.7,5-2.1c2.701-2.7,2.701-7.2,0-9.9l-12-11.8l11.801-11.8   C125.1,47.804,125.1,43.304,122.4,40.604z" />
            </svg>
          </button>

          <span className="volumePlace" aria-live="polite">
            50%
          </span>

          <button className="unMute" aria-label="Unmute audio">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="0 0 93.038 93.038"
            >
              <path d="M46.547,75.521c0,1.639-0.947,3.128-2.429,3.823c-0.573,0.271-1.187,0.402-1.797,0.402c-0.966,0-1.923-0.332-2.696-0.973   l-23.098-19.14H4.225C1.892,59.635,0,57.742,0,55.409V38.576c0-2.334,1.892-4.226,4.225-4.226h12.303l23.098-19.14   c1.262-1.046,3.012-1.269,4.493-0.569c1.481,0.695,2.429,2.185,2.429,3.823L46.547,75.521L46.547,75.521z M62.784,68.919   c-0.103,0.007-0.202,0.011-0.304,0.011c-1.116,0-2.192-0.441-2.987-1.237l-0.565-0.567c-1.482-1.479-1.656-3.822-0.408-5.504   c3.164-4.266,4.834-9.323,4.834-14.628c0-5.706-1.896-11.058-5.484-15.478c-1.366-1.68-1.24-4.12,0.291-5.65l0.564-0.565   c0.844-0.844,1.975-1.304,3.199-1.231c1.192,0.06,2.305,0.621,3.061,1.545c4.977,6.09,7.606,13.484,7.606,21.38   c0,7.354-2.325,14.354-6.725,20.24C65.131,68.216,64.007,68.832,62.784,68.919z M80.252,81.976   c-0.764,0.903-1.869,1.445-3.052,1.495c-0.058,0.002-0.117,0.004-0.177,0.004c-1.119,0-2.193-0.442-2.988-1.237l-0.555-0.555   c-1.551-1.55-1.656-4.029-0.246-5.707c6.814-8.104,10.568-18.396,10.568-28.982c0-11.011-4.019-21.611-11.314-29.847   c-1.479-1.672-1.404-4.203,0.17-5.783l0.554-0.555c0.822-0.826,1.89-1.281,3.115-1.242c1.163,0.033,2.263,0.547,3.036,1.417   c8.818,9.928,13.675,22.718,13.675,36.01C93.04,59.783,88.499,72.207,80.252,81.976z" />
            </svg>
          </button>
        </div>

        <div className="audioControl">
          <button
            className="visualizerToggle"
            aria-label="Toggle audio visualizer"
            aria-pressed="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="0 0 800 800"
            >
              <path d="M180.3,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V235.8c0-13.5,11-24.5,24.5-24.5h72.4c13.5,0,24.5,11,24.5,24.5v469.1	C204.7,718.4,193.7,729.4,180.3,729.4" />
              <path d="M351,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V331.7c0-13.5,11-24.5,24.5-24.5H351c13.5,0,24.5,11,24.5,24.5v373.2	C375.4,718.4,364.4,729.4,351,729.4" />
              <path d="M521.9,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V95.1c0-13.5,11-24.5,24.5-24.5h72.4c13.5,0,24.5,11,24.5,24.5v609.8	C546.3,718.4,535.3,729.4,521.9,729.4" />
              <path d="M692.1,729.4h-72.4c-13.5,0-24.5-11-24.5-24.5V331.7c0-13.5,11-24.5,24.5-24.5h72.4c13.5,0,24.5,11,24.5,24.5v373.2	C716.6,718.4,705.6,729.4,692.1,729.4" />
            </svg>
          </button>

          <button
            className="playPauseAudio"
            aria-label="Play audio"
            aria-pressed="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="130"
              height="130"
              viewBox="0 0 800 800"
            >
              <path d="M713.9,400.5c1.4,171.2-137.8,314.4-313.9,314.3c-175.6,0-314.2-143-314-315c0.2-171.3,140.6-313.9,315-313.4	C574,87,715.4,228.9,713.9,400.5z M279.5,400.3c0,23.1,0,46.2,0,69.3c0,20.8-0.2,41.7,0.1,62.5c0.1,12.2,6,21.1,17,26.6	c11,5.5,21.2,3,31.2-2.9c23.3-13.6,46.8-27,70.2-40.5c49.8-28.6,99.6-57.1,149.3-85.8c18.1-10.4,18.7-38.7,1.1-49.4	c-74.5-45.4-149-90.8-223.5-136.1c-6-3.7-12.6-5.5-19.8-4.2c-15.7,2.9-25.5,14.4-25.5,30.5C279.4,313.6,279.5,357,279.5,400.3z" />
            </svg>
          </button>

          <button className="live" aria-label="Live indicator" disabled>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="-16 0 512 512.00113"
            >
              <path d="m262.84375 140.558594c-12.699219 12.671875-33.28125 12.671875-45.980469 0-12.695312-12.671875-12.695312-33.21875 0-45.890625 12.699219-12.671875 33.28125-12.671875 45.980469 0 12.695312 12.671875 12.695312 33.21875 0 45.890625zm0 0" />
              <path d="m307.257812 189.726562c-3.960937 0-7.921874-1.511718-10.9375-4.539062-6.03125-6.039062-6.019531-15.824219.019532-21.851562 12.238281-12.214844 18.976562-28.453126 18.976562-45.722657s-6.738281-33.507812-18.976562-45.722656c-6.039063-6.03125-6.050782-15.8125-.019532-21.855469 6.027344-6.039062 15.8125-6.050781 21.851563-.019531 18.089844 18.054687 28.050781 42.058594 28.050781 67.597656 0 25.535157-9.960937 49.542969-28.050781 67.597657-3.015625 3.011718-6.964844 4.515624-10.914063 4.515624zm0 0" />
              <path d="m342.210938 235.222656c-3.960938 0-7.921876-1.511718-10.9375-4.535156-6.03125-6.042969-6.019532-15.824219.019531-21.855469 24.414062-24.367187 37.863281-56.761719 37.863281-91.21875s-13.449219-66.851562-37.863281-91.21875c-6.039063-6.03125-6.050781-15.8125-.019531-21.855469 6.03125-6.039062 15.8125-6.050781 21.851562-.019531 30.265625 30.207031 46.9375 70.371094 46.933594 113.09375 0 42.722657-16.667969 82.890625-46.933594 113.097657-3.015625 3.007812-6.964844 4.511718-10.914062 4.511718zm0 0" />
              <path d="m172.371094 189.726562c-3.949219 0-7.898438-1.503906-10.917969-4.515624-18.089844-18.054688-28.050781-42.0625-28.050781-67.597657 0-25.539062 9.960937-49.542969 28.050781-67.597656 6.039063-6.03125 15.824219-6.023437 21.851563.019531 6.03125 6.039063 6.019531 15.824219-.019532 21.855469-12.238281 12.214844-18.976562 28.453125-18.976562 45.722656s6.738281 33.507813 18.976562 45.722657c6.039063 6.027343 6.050782 15.8125.019532 21.851562-3.015626 3.023438-6.976563 4.539062-10.933594 4.539062zm0 0" />
              <path d="m137.417969 235.222656c-3.953125 0-7.902344-1.503906-10.917969-4.515625-30.265625-30.207031-46.933594-70.371093-46.933594-113.09375 0-42.726562 16.667969-82.890625 46.933594-113.097656 6.039062-6.027344 15.824219-6.019531 21.851562.023437 6.03125 6.039063 6.019532 15.820313-.019531 21.851563-24.414062 24.367187-37.863281 56.761719-37.863281 91.21875s13.449219 66.855469 37.863281 91.222656c6.039063 6.03125 6.050781 15.8125.019531 21.855469-3.015624 3.023438-6.976562 4.535156-10.933593 4.535156zm0 0" />
              <path d="m443.480469 261.9375h-407.332031c-19.964844 0-36.148438 16.183594-36.148438 36.144531v177.769531c0 19.964844 16.183594 36.148438 36.148438 36.148438h407.328124c19.964844 0 36.148438-16.183594 36.148438-36.148438v-177.769531c0-19.960937-16.183594-36.144531-36.144531-36.144531zm-324.609375 203.683594h-56.933594c-8.53125 0-15.449219-6.917969-15.449219-15.453125v-126.398438c0-8.53125 6.917969-15.453125 15.449219-15.453125 8.535156 0 15.453125 6.917969 15.453125 15.453125v110.945313h41.480469c8.535156 0 15.453125 6.917968 15.453125 15.453125 0 8.535156-6.917969 15.453125-15.453125 15.453125zm63.328125-15.453125c0 8.535156-6.917969 15.453125-15.453125 15.453125s-15.453125-6.917969-15.453125-15.453125v-126.398438c0-8.53125 6.917969-15.453125 15.453125-15.453125s15.453125 6.917969 15.453125 15.453125zm130.015625-121.929688-38.160156 126.394531c-.003907.011719-.007813.023438-.011719.035157-4.144531 14.144531-25.273438 13.796875-29.5625 0-.003907-.011719-.007813-.023438-.011719-.035157l-38.160156-126.394531c-2.464844-8.171875 2.15625-16.792969 10.328125-19.261719 8.164062-2.464843 16.792969 2.15625 19.257812 10.328126l23.367188 77.394531 23.367187-77.394531c2.46875-8.171876 11.089844-12.796876 19.261719-10.328126 8.167969 2.46875 12.792969 11.089844 10.324219 19.261719zm95.066406 35.320313c8.535156 0 15.453125 6.917968 15.453125 15.453125 0 8.53125-6.917969 15.453125-15.453125 15.453125h-43.851562v40.25h52.175781c8.535156 0 15.453125 6.917968 15.453125 15.453125 0 8.535156-6.917969 15.453125-15.453125 15.453125h-67.628907c-8.535156 0-15.453124-6.917969-15.453124-15.453125v-126.398438c0-8.53125 6.917968-15.453125 15.453124-15.453125h69.710938c8.53125 0 15.453125 6.917969 15.453125 15.453125 0 8.535157-6.921875 15.453125-15.453125 15.453125h-54.261719v24.335938zm0 0" />
            </svg>
          </button>
        </div>

        <div className="visualizerBar" aria-hidden="true"></div>

        <audio
          id="bRadioAudio"
          className="bRadioAudio"
          crossOrigin="anonymous"
          ref={audioRef}
          style={{ height: 0, width: 0, opacity: 0 }}
          aria-label={`Audio stream for ${fetchNameFromUrl ? fetchedStationName : stationName
            }`}
        >
          <source
            src={getFinalStreamURL(
              streamProvider,
              streamURL,
              streamPort,
              streamMountPoint
            )}
          />
        </audio>
      </div>
    </section>
  );
};

export default Ultimate;
