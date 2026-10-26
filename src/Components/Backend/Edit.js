import { useEffect, useState } from "react";
import { useBlockProps } from "@wordpress/block-editor";
import {
  tabController,
  updateData,
} from "../../../../bpl-tools/utils/functions";

import Settings from "./Settings/Settings";
import Style from "../Common/Style";
import { renderPlayer } from "../../utils/functions";

const Edit = (props) => {
  const { attributes, setAttributes, clientId, isSelected } = props;
  const { radioPlayer } = attributes;
  const {
    playerType,
    streamURL,
    streamPort,
    fetchNameFromUrl,
    streamProvider,
    stationName,
  } = radioPlayer;
  const [fetchedStationName, setFetchedStationName] = useState(null);

  useEffect(() => tabController(), [isSelected]);

  const id = `streamcast-${clientId}`;

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
        return null;
      }

      // Parse the JSON response
      const data = await response.json();
      if (data?.data) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
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
        return null;
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
      const fetchTitle = async () => {
        const title = await getStreamTitle(playerType, streamProvider);
        setFetchedStationName(title);
      };

      fetchTitle();
    }
  }, [playerType, streamProvider, streamPort, fetchNameFromUrl, stationName]);

  return (
    <>
      <Settings attributes={attributes} setAttributes={setAttributes} />
      <div {...useBlockProps()} id={id} style={{ position: "relative" }}>
        <Style attributes={attributes} id={id} />

        {renderPlayer(playerType, attributes, id, fetchedStationName)}
      </div>
    </>
  );
};
export default Edit;
