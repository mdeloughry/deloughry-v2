import React, { useEffect, useState } from "react";
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

  const { data, mutate, error, isLoading } = useSWR("https://api.deloughry.co.uk/spotify/now-playing", fetcher, {
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

  return (
    <div
      className={`${data?.isPlaying ? "visible" : "invisible"
        } flex flex-col justify-center align-middle transition-all duration-250 ease-in-out`}
    >
      {data?.isPlaying && (
        <div className="sticky space-around mb-4 flex w-full items-center space-x-0 overflow-hidden rounded-lg bg-zinc-200 p-2 align-middle shadow-lg dark:bg-zinc-700 sm:space-x-2">
          <ImageWithHeart
            image={data?.song?.albumArt[2].url}
            className="relative mr-2 w-[70px] aspect-square"
            isLiked={data?.song?.isLiked}
          />
          <div>
            <span className="flex-col items-center sm:flex-row">
              {data?.isPlaying ? (
                <a
                  className="capsize font-sm text-wrap flex w-full flex-col flex-wrap truncate break-all dark:text-white no-underline"
                  href={data?.song?.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="truncate text-accent font-orbitron font-bold text-lg uppercase">{data?.song?.name}</span>
                  <span className="capsize truncate break-all text-xs text-zinc-700 dark:text-gray-200">
                    {data?.song?.artist}
                  </span>
                </a>
              ) : (
                <p className="capsize font-md text-gray-200">Not Playing</p>
              )}
            </span>

            <SoundWave
              progress={Math.floor((progress / data?.song?.duration) * 100) || 0}
              isPlaying={data?.isPlaying}
            />
          </div>
        </div>
      )}
      {!data?.isPlaying && <p className="min-h-[102px]">Spotify Not Playing</p>}
    </div>
  );
}
