import { produce } from "immer";
import Advanced from "../Components/Common/Players/Advanced";
import Minimal from "../Components/Common/Players/Minimal";
import Standard from "../Components/Common/Players/Standard";
import Ultimate from "../Components/Common/Players/Ultimate";
import { skins } from "./options";
import EchoStream from "../Components/Common/Players/EchoStream";
import AuroraPlay from "../Components/Common/Players/AuroraPlay";
import Wooden from "../Components/Common/Players/Wooden";
import Advanced2 from "../Components/Common/Players/Advanced2";

export const renderPlayer = (
  playerType,
  attributes,
  id,
  fetchedStationName
) => {
  switch (playerType) {
    case "advanced":
      return (
        <Advanced2
          attributes={attributes}
          fetchedStationName={fetchedStationName}
        />
      );
    case "minimal":
      return (
        <Minimal
          attributes={attributes}
          fetchedStationName={fetchedStationName}
        />
      );
    case "standard":
      return (
        <Standard
          attributes={attributes}
          id={id}
          fetchedStationName={fetchedStationName}
        />
      );
    case "ultimate":
      return (
        <Ultimate
          attributes={attributes}
          fetchedStationName={fetchedStationName}
        />
      );
    case "echoStream":
      return (
        <EchoStream
          attributes={attributes}
          fetchedStationName={fetchedStationName}
        />
      );
    case "auroraPlay":
      return (
        <AuroraPlay
          attributes={attributes}
          fetchedStationName={fetchedStationName}
        />
      );
    case "wooden":
      return (
        <Wooden
          attributes={attributes}
          fetchedStationName={fetchedStationName}
        />
      );
    default:
      return <p>Please select a player type in settings!</p>;
  }
};

export const skinSwitch = (skinName = "mcclean", attributes) =>
  produce(attributes, (draft) => {
    draft["radioPlayer"]["skin"]["name"] = skinName;
    if (skinName === "b_circle") {
      draft["radioStyles"]["playerWidth"] = "200px";
    }
    const skin = skins.find((s) => s.value === skinName);
    if (skin) {
      const match = skin.label.match(/\((\d+)x(\d+)\)/);
      if (match) {
        draft["radioPlayer"]["skin"]["width"] = parseInt(match[1], 10);
        draft["radioPlayer"]["skin"]["height"] = parseInt(match[2], 10);
      }
    }
  });

export const playerTypeSwitch = (playerType = "ultimate", attributes) =>
  produce(attributes, (draft) => {
    draft["radioPlayer"]["playerType"] = playerType;

    switch (playerType) {
      case "minimal":
        draft["radioPlayer"]["streamURL"] =
          "https://media-ssl.musicradio.com/HeartLondon";
        break;
      case "advanced":
        draft["radioStyles"]["backgroundColor"] = "#f09f8b";
        draft["radioPlayer"]["artWork"] = "";
        break;
      case "echoStream":
        draft["radioStyles"]["playerWidth"] = "450px";
        draft["radioStyles"]["contentColor"] = "#fff";
        break;
      case "auroraPlay":
        draft["radioStyles"]["backgroundColor"] = "black";
        draft["radioStyles"]["playerWidth"] = "100%";
        draft["radioPlayer"]["artWork"] = {
          url: "https://danialsabagh.com/singleaudioplayer/img/radio.jpg",
        };
        draft["radioStyles"]["contentColor"] = "#fff";
        draft["radioPlayer"]["welcomeMessage"] = "106.2";
        break;
      case "ultimate":
        draft["radioStyles"]["playerWidth"] = "100%";
        draft["radioPlayer"]["streamURL"] =
          "http://s5-webradio.antenne.de/antenne?icy=https";
        break;
      case "wooden":
        draft["radioStyles"]["backgroundColor"] = "#693328";
        draft["radioPlayer"]["streamURL"] =
          "https://media-ssl.musicradio.com/HeartLondon";
        break;
    }
  });
