import type { FC } from "react";
import type { TrackWithAllRelationships } from "@/lib/types/spotify";

type TracksProps = {
  tracks: TrackWithAllRelationships[] | [];
};

const Tracks: FC<TracksProps> = ({
  tracks
}) => {

  return (
    <ol>
      {
        tracks.flatMap((track, index) => (
          <li className="flex flex-row justify-between" key={track.id}>
            <a className={`flex flex-row gap-1 flex-wrap mb-2 align-middle brutal-link no-underline`} href={track.externalUrl} title="View Track in Spotify" target="_BLANK">
              <span>{index + 1}.</span>
              <div className="flex flex-col flex-wrap flex-1">
                <span>{track.name}</span>
                <span className="text-xs text-textColor"> {track.artists.flatMap(artist => artist.name).join(', ')}</span>
              </div>
            </a>

          </li>
        ))
      }
    </ol >
  );
};

export default Tracks;
