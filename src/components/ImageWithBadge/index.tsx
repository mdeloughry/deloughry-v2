import React, { useState } from "react";
import "./style.css";
import { SpotifyLogo } from "./spotify-logo";
import { PlayIcon } from "./play-icon";

interface ImageWithBadgeTypes {
  imageUrl: string;
  underText?: string;
}

const ImageWithBadge = ({ imageUrl, underText }: ImageWithBadgeTypes) => {
  const [hovered, setHovered] = useState(false);
  const [svgToDisplay, setSvgToDisplay] = useState("spotify");

  const handleMouseEnter = () => {
    setHovered(true);
    // setTimeout(() => {
    setSvgToDisplay("play");
    // }, 200);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTimeout(() => {
      setSvgToDisplay("spotify");
    }, 200);
  };

  return (
    <div>
      <div
        className={`crt-filter container ${hovered ? "active" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`overlay`}>
          {svgToDisplay == "play" ? (
            <PlayIcon className="play" />
          ) : (
            <SpotifyLogo className="logo" />
          )}
        </div>
        <img className="image crt-image" src={imageUrl} alt="" />
      </div>

      {underText}
    </div>
  );
};

export default ImageWithBadge;
