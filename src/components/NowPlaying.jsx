import { useEffect, useState } from "react";
import useSWR from "swr";
import SoundWave from "./SoundWave";
import { ImageWithHeart } from "./ImageWithHeart";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NowPlaying() {
  let interval = null;
  const [progress, setProgress] = useState(0);

  // const { data, mutate, error, isLoading } = useSWR("http://localhost:3000/spotify/now-playing", fetcher, {
  // 	onSuccess: (data) => {
  // 		clearInterval(interval);
  // 		setProgress(data?.song?.progress);
  // 	},
  // });

  const { data, mutate } = useSWR("https://api.deloughry.co.uk/spotify/now-playing", fetcher, {
    onSuccess: (data) => {
      clearInterval(interval);
      setProgress(data?.song?.progress);
    },
  });

  useEffect(() => {
    if (data) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= data?.song?.duration) {
            clearInterval(interval);
            mutate();
          }
          return prev + 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [data?.song?.progress, data?.song?.duration]);

  if (!data?.isPlaying) {
    return null;
  }

  return (
    <div className="now-playing-wrapper mb-4">
      <h2 className="now-playing-heading">
        <span className="accent-slash">//</span> Now Playing on Spotify
      </h2>
      <div className="now-playing-card flex w-full items-stretch overflow-hidden">
        <ImageWithHeart
          image={data?.song?.albumArt[1]?.url || data?.song?.albumArt[0]?.url}
          className="now-playing-artwork relative"
          isLiked={data?.song?.isLiked}
        />
        <div className="min-w-0 flex-1 p-3 flex flex-col justify-center">
          <a
            className="now-playing-link flex w-full flex-col no-underline"
            href={data?.song?.uri}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="now-playing-title truncate">{data?.song?.name}</span>
            <span className="now-playing-artist truncate">
              {data?.song?.artist}
            </span>
          </a>

          <SoundWave
            progress={Math.floor((progress / data?.song?.duration) * 100) || 0}
            isPlaying={data?.isPlaying}
          />
        </div>
      </div>
    </div>
  );
}
