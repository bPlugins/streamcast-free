import { useEffect, useState } from "react";
import Advanced from "../Common/Players/Advanced";
import Minimal from "../Common/Players/Minimal";
import Standard from "../Common/Players/Standard";
import Ultimate from "../Common/Players/Ultimate";
import EchoStream from "../Common/Players/EchoStream";
import Style from "../Common/Style";
import AuroraPlay from "../Common/Players/AuroraPlay";
import Wooden from "../Common/Players/Wooden";
import Advanced2 from "../Common/Players/Advanced2";

const StreamCast = ({ attributes, id }) => {
  const { radioPlayer } = attributes;
  const {
    playerType,
    skin,
    streamURL,
    streamPort,
    stationName,
    fetchNameFromUrl,
    streamProvider,
  } = radioPlayer;
  const [fetchedStationName, setFetchedStationName] = useState(null);

  let urlToFetch = "";
  let urlToFetchIceCast = "";

  if (playerType === "ultimate") {
    urlToFetch = `${streamURL}:${streamPort}/currentsong?sid=1`;
    urlToFetchIceCast = `${streamURL}:${streamPort}/status-json.xsl`;
    if (streamProvider === "other") {
      urlToFetch = `${streamURL}/currentsong?sid=1`;
      urlToFetchIceCast = `${streamURL}/status-json.xsl`;
    }
  } else {
    urlToFetch = `${streamURL}/currentsong?sid=1`;
    urlToFetchIceCast = `${streamURL}/status-json.xsl`;
  }

  const fetchShoutCastData = async () => {
    try {
      const formData = new FormData();
      formData.append("action", "streamcast_fetch_stream");
      formData.append("url", urlToFetch);
      formData.append("nonce", window.streamcastData.nonce);

      // Fetch data from the server
      const response = await fetch(`${window.streamcastData.ajaxUrl}`, {
        method: "POST",
        body: formData,
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the JSON response
      const data = await response.json();
      if (data?.data) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return null;
    }
  };

  const fetchIceCastData = async () => {
    try {
      const formData = new FormData();
      formData.append("action", "streamcast_fetch_stream");
      formData.append("url", urlToFetchIceCast);
      formData.append("nonce", window.streamcastData.nonce);

      const response = await fetch(`${window.streamcastData.ajaxUrl}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result?.success && result?.data) {
        const data = JSON.parse(result.data);
        const stream = data.icestats?.source || null;
        if (stream) {
          const title =
            stream?.title ||
            stream?.song ||
            stream?.server_name ||
            "No Title Available";
          return title;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const getStreamTitle = async (playerType, streamProvider) => {
    let title = null;

    // For Standard and Advanced players
    if (
      playerType === "standard" ||
      playerType === "advanced" ||
      playerType === "echoStream" ||
      playerType === "auroraPlay" ||
      playerType === "wooden"
    ) {
      title = await fetchShoutCastData();
      if (!title) {
        title = await fetchIceCastData();
      }
      if (!title) {
        title = stationName;
      }
    }
    // For Ultimate player
    else if (playerType === "ultimate") {
      if (streamProvider === "shout-cast") {
        title = await fetchShoutCastData();
      } else if (streamProvider === "ice-cast") {
        title = await fetchIceCastData();
      } else if (streamProvider === "other") {
        title = await fetchShoutCastData();
        if (!title) {
          title = await fetchIceCastData();
        }
        if (!title) {
          title = stationName;
        }
      }
      if (!title) {
        title = stationName;
      }
    }

    return title;
  };

  useEffect(() => {
    if (fetchNameFromUrl) {
      getStreamTitle(playerType, streamProvider).then((title) => {
        if (title) setFetchedStationName(title);
      });
    }
  }, [playerType, streamProvider, streamPort, fetchNameFromUrl]);

  return (
    <>
      <Style attributes={attributes} id={id} />
      <div className="streamcast-container" id={id}>
        {playerType === "standard" && skin.name === "b_circle" && (
          <Standard
            attributes={attributes}
            id={id}
            fetchedStationName={fetchedStationName}
          />
        )}
        {playerType === "ultimate" && (
          <Ultimate
            attributes={attributes}
            id={id}
            fetchedStationName={fetchedStationName}
          />
        )}
        {playerType === "advanced" && (
          <Advanced2
            attributes={attributes}
            id={id}
            fetchedStationName={fetchedStationName}
          />
        )}
        {playerType === "minimal" && (
          <Minimal
            attributes={attributes}
            id={id}
            fetchedStationName={fetchedStationName}
          />
        )}
        {playerType === "echoStream" && (
          <EchoStream
            attributes={attributes}
            id={id}
            fetchedStationName={fetchedStationName}
          />
        )}
        {playerType === "auroraPlay" && (
          <AuroraPlay
            attributes={attributes}
            id={id}
            fetchedStationName={fetchedStationName}
          />
        )}
        {playerType === "wooden" && (
          <Wooden
            attributes={attributes}
            id={id}
            fetchedStationName={fetchedStationName}
          />
        )}
      </div>
    </>
  );
};
export default StreamCast;
