import { getTypoCSS, isValidCSS } from "../../../../bpl-tools/utils/getCSS";

const Style = ({ attributes, id }) => {
  const { radioPlayer = {}, radioStyles = {} } = attributes;
  const { playerType, playerPosition } = radioPlayer;
  const {
    playerWidth = "100%",
    ultimate = {},
    backgroundColor = "#f09f8b",
    echoStream = {},
    stationName = {},
    artistFmName = {},
    playBtnColor = "red",
    timeStamp = {},
  } = radioStyles;
  const {
    playerColors = "theme",
    playerOverlayColor = "rgba(15,17,21,0.5)",
    thumbnailBorderColor = "rgba(255, 255, 255, 0.2)",
    contentColor = "#fff",
    progressActiveColor = "orangered",
    buttonHoverColor = "orangered",
    visualizerColor = "orangered",
    playerBackgroundImg = "",
  } = ultimate;

  if (
    ![
      "ultimate",
      "advanced",
      "minimal",
      "standard",
      "echoStream",
      "auroraPlay",
      "wooden",
    ].includes(playerType)
  )
    return null;

  const mainPlayer = `#${id}`;
  const minimalPlayer = `${mainPlayer} .minimal`;
  const minimalContainer = `${mainPlayer} .minimalContainer`;
  const advancedPlayer = `${mainPlayer} .advanced-player`;
  const ultimatePlayer = `${mainPlayer} .ultimate-container`;
  const bCirclePlayer = `${mainPlayer} .streamcast_custom_circle`;
  const echoStreamPlayer = `${mainPlayer} .echoStream`;
  const woodenPlayer = `${mainPlayer} .woodenPlayer`;
  const woodenContentBox = `${mainPlayer} .woodenContainer .contentBox`;
  const echoStreamContainer = `${echoStreamPlayer} .echoStream__container`;
  const echoStreamControls = `${echoStreamContainer} .echoStream__content .echoStream__controls`;

  const auroraPlay = `${mainPlayer} .auroraPlay`;
  const auroraAudioDetails = `${mainPlayer} .details-play-pause`;
  const auroraAudioStuff = `${auroraPlay} .audio-stuff`;

  // Default styles applied to all themes
  const defaultStyles = `
        ${getTypoCSS("", stationName?.typo)?.googleFontLink}
        ${getTypoCSS("", artistFmName?.typo)?.googleFontLink}
        ${getTypoCSS("", timeStamp?.typo)?.googleFontLink}
		${getTypoCSS(`${auroraAudioDetails} .details h3`, stationName?.typo).styles}
		${getTypoCSS(`${auroraAudioDetails} .details p`, artistFmName?.typo).styles}
		${
      getTypoCSS(
        `${echoStreamContainer} .echoStream__content .echoStream__info h1`,
        stationName?.typo
      ).styles
    }
		${
      getTypoCSS(
        `${echoStreamContainer} .echoStream__content .echoStream__info p`,
        artistFmName?.typo
      ).styles
    }
		${getTypoCSS(`${woodenContentBox} .title`, stationName?.typo).styles}
		${getTypoCSS(`${woodenContentBox} .info .time`, timeStamp?.typo).styles}

    `;

  const ultimateCustom = `
            ${ultimatePlayer} #bRadioPlayer {
                width: ${playerWidth};
                background-color: ${playerOverlayColor};
            }
            ${ultimatePlayer} #bRadioPlayer .imageHolder img {
                border-color: ${thumbnailBorderColor};
            }
            ${ultimatePlayer} #bRadioPlayer button svg,
            ${ultimatePlayer} #bRadioPlayer svg:active,
            ${ultimatePlayer} #bRadioPlayer svg:focus {
                fill: ${contentColor};
            }
            ${ultimatePlayer} #bRadioPlayer .text p,
            ${ultimatePlayer} #bRadioPlayer .rangeControls span {
                color: ${contentColor};
            }
            ${ultimatePlayer} #bRadioPlayer button svg:hover {
                fill: ${buttonHoverColor};
            }
            ${ultimatePlayer} #bRadioPlayer .audioControl button.live svg {
                -webkit-animation: cngBlinking 2s infinite; animation: cngBlinking 2s infinite;
            }
            
            ${ultimatePlayer} #bRadioPlayer input[type='range'] {
                background: linear-gradient(90deg, ${progressActiveColor} 50%, white 50%);
            }

            ${ultimatePlayer} .bRadioPlayer input[type='range']::-webkit-slider-thumb {
                background: ${progressActiveColor};
            }
            ${ultimatePlayer} .bRadioPlayer input[type='range']::-moz-range-thumb {
                background: ${progressActiveColor};
            }
            ${ultimatePlayer} .bRadioPlayer .visualizerCircle .visualizerCircleEl {
                background-image: linear-gradient(to bottom, ${visualizerColor}, transparent);
            }

            @-webkit-keyframes cngBlinking {
            0% {
                fill: ${contentColor};
            }
            50% {
                fill: ${buttonHoverColor};
            }
            100% {
                fill: ${contentColor};
            } }
            }
            @keyframes cngBlinking {
            0% {
                fill: ${contentColor};
            }
            50% {
                fill: ${buttonHoverColor};
            }
            100% {
                fill: ${contentColor};
            } }
            }
    `;

  // Theme-specific styles
  const themes = {
    minimal: `
            ${minimalPlayer} {
                ${isValidCSS("justify-content", playerPosition)}
            }
        `,
    standard: `
            ${bCirclePlayer} {
                ${isValidCSS("justify-content", playerPosition)}
            }
            ${bCirclePlayer} .plyr__control {
                ${isValidCSS("width", playerWidth)}
            }
        `,
    ultimate: ` 
           ${ultimatePlayer} {
                ${isValidCSS("justify-content", playerPosition)}
            }
            ${ultimatePlayer} #bRadioPlayer{
                background-image: url(${playerBackgroundImg?.url});
                ${isValidCSS("width", playerWidth)}
            }
        `,
    advanced: `
           ${advancedPlayer} {
                background: ${backgroundColor};
           }
        `,
    echoStream: `
            ${echoStreamPlayer} {
                ${isValidCSS("justify-content", playerPosition)}
            }
            ${echoStreamContainer} {
                ${isValidCSS("width", playerWidth)}
                background-image: url('${echoStream?.bgImg?.url}');
                backdrop-filter: blur(${echoStream?.blur}px);
            }
            ${echoStreamContainer} .echoStream__content .echoStream__info h1 {
                ${isValidCSS("color", stationName?.color)}
            }
            ${echoStreamContainer} .echoStream__content .echoStream__info p {
                ${isValidCSS("color", artistFmName?.color)}
            }
            ${echoStreamPlayer} .echoStream__volume-control button svg, ${echoStreamContainer} button svg, ${echoStreamControls} .echoStream__live-indicator span:last-child  {
                ${isValidCSS("color", radioStyles?.contentColor)}
            }
            ${echoStreamPlayer} .echoStream__bg-blur {
                filter: blur(${echoStream?.blur}px);
            }

            ${echoStreamContainer} .echoStream__content .echoStream__play-button svg {
                ${isValidCSS("color", playBtnColor)}
            }
        `,
    auroraPlay: `  
            ${auroraPlay} {
                ${isValidCSS("justify-content", playerPosition)}
            }
            ${auroraPlay} .auroraContainer {
                ${isValidCSS("width", playerWidth)}
                ${isValidCSS("background-color", backgroundColor)}
            }
            ${auroraAudioDetails} .play-pause-btn {
                ${isValidCSS("border-color", radioStyles.contentColor)}
            }
            ${auroraAudioDetails} .details h3 {
                ${isValidCSS("color", stationName?.color)}
            }
            ${auroraAudioDetails} .details p {
                ${isValidCSS("color", artistFmName?.color)}
            }
            ${auroraAudioStuff} .details-play-pause .play-pause-btn svg, ${auroraAudioStuff} .volume-audioTime .vol-and-share-btn svg, ${auroraAudioStuff} .volume-audioTime .currentTime .time {
                ${isValidCSS("color", radioStyles?.contentColor)}
            }

        `,
    wooden: `
            ${woodenPlayer} {
                ${isValidCSS("justify-content", playerPosition)}
            }
            ${woodenPlayer} .woodenContainer {
                ${isValidCSS("width", playerWidth)}
                ${isValidCSS("background-color", backgroundColor)}
            }
            ${woodenContentBox} .title{
                ${isValidCSS("color", stationName?.color)}
                ${isValidCSS("background-color", stationName?.bgColor)}
                transition: all 0.3s ease-in-out;
            }
            ${woodenContentBox} .title:hover {
                ${isValidCSS("color", stationName?.hoverColor)}
                ${isValidCSS("background-color", stationName?.hoverBgColor)}
            }
            ${woodenContentBox} .woodenControls .play-pause-btn svg, ${woodenContentBox} .woodenControls .toggleVol svg, ${woodenContentBox} .info .wooden-live-indicator  {
                ${isValidCSS("color", radioStyles?.contentColor)}
            }
            ${woodenContentBox} .woodenControls input::-webkit-slider-runnable-track {
                ${isValidCSS("background-color", radioStyles?.contentColor)}
            }
            ${woodenContentBox} .woodenControls  input::-webkit-slider-thumb {
                ${isValidCSS("background-color", radioStyles?.contentColor)}
            }
            ${woodenContentBox} .info .time {
                ${isValidCSS("color", timeStamp?.color)}
                ${isValidCSS("background-color", timeStamp?.bgColor)}
                transition: all 0.3s ease-in-out;
            }
            ${woodenContentBox} .info .time:hover {
                ${isValidCSS("color", timeStamp?.hoverColor)}
                ${isValidCSS("background-color", timeStamp?.hoverBgColor)}
            }
        `,
  };

  const appliedStyles = themes[playerType] || "";
  const appliedUltimateCustom = playerColors === "custom" ? ultimateCustom : "";

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: defaultStyles + appliedStyles + appliedUltimateCustom,
      }}
    />
  );
};

export default Style;
