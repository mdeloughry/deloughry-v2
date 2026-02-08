import type { APIContext, GetStaticPathsResult } from "astro";
import satori from "satori";
import siteConfig from "@/site-config";
import { getPlaylistfromDB, getPlaylistsfromDB } from "@/data/models/playlist";
import { Resvg } from "@resvg/resvg-js";
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as sharp from 'sharp';

export const prerender = true;

// Lazy loading for fonts and image
let assetsLoaded = false;
let monoFontReg: Buffer;
let monoFontBold: Buffer;
let profileImageDataUrl: string;

async function loadAssets() {
  if (assetsLoaded) return;
  const fontsDir = resolve(process.cwd(), 'public/fonts');
  monoFontReg = readFileSync(resolve(fontsDir, 'jetbrains-mono-400.ttf'));
  monoFontBold = readFileSync(resolve(fontsDir, 'jetbrains-mono-700.ttf'));

  // Load profile image and convert to PNG for Satori compatibility
  const imagePath = resolve(process.cwd(), 'src/assets/profile-glitch.webp');
  const sharpFn = (sharp as any).default || sharp;
  const pngBuffer = await sharpFn(imagePath).png().toBuffer();
  profileImageDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

  assetsLoaded = true;
}

function getOgOptions() {
  return {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: [
      { name: "JetBrains Mono", data: monoFontReg, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: monoFontBold, weight: 700, style: "normal" },
    ],
  };
}

function markup(title: string, description: string, trackCount: number, artwork: string) {
  return {
    type: 'div',
    props: {
      tw: 'flex flex-col w-full h-full bg-black text-[#E5E5E5]',
      style: { fontFamily: 'JetBrains Mono', position: 'relative' },
      children: [
        // Glitch lines
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#FF4757', opacity: 0.6 } } },
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '8px', left: 0, width: '100%', height: '4px', background: '#00D9FF', opacity: 0.4 } } },
        // Main content
        {
          type: 'div',
          props: {
            tw: 'flex items-center flex-1 w-full p-12',
            children: [
              // Album artwork with glitch effect
              {
                type: 'div',
                props: {
                  tw: 'flex',
                  style: { position: 'relative' },
                  children: [
                    { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '4px', left: '4px', width: '256px', height: '256px', background: '#FF4757', opacity: 0.5, borderRadius: '2px' } } },
                    { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '-4px', left: '-4px', width: '256px', height: '256px', background: '#00D9FF', opacity: 0.3, borderRadius: '2px' } } },
                    {
                      type: 'img',
                      props: {
                        src: artwork,
                        width: 256,
                        height: 256,
                        tw: 'flex border-2 border-[#DAFF01]',
                        style: { borderRadius: '2px', objectFit: 'cover', position: 'relative' },
                      },
                    },
                  ],
                },
              },
              // Text content
              {
                type: 'div',
                props: {
                  tw: 'flex flex-col pl-10 flex-1',
                  children: [
                    // Category label
                    {
                      type: 'div',
                      props: {
                        tw: 'flex items-center mb-3',
                        children: [
                          { type: 'span', props: { tw: 'text-[#DAFF01] text-xl mr-2', children: '//' } },
                          { type: 'span', props: { tw: 'text-[#8A8A8A] text-xl', children: 'Spotify Playlist' } },
                        ],
                      },
                    },
                    // Title
                    {
                      type: 'div',
                      props: {
                        tw: 'flex text-4xl font-bold text-white mb-4',
                        style: { letterSpacing: '-0.02em', lineHeight: 1.2 },
                        children: title,
                      },
                    },
                    // Description
                    ...(description ? [{
                      type: 'div',
                      props: {
                        tw: 'flex text-lg text-[#8A8A8A] mb-4',
                        style: { lineHeight: 1.4 },
                        children: description,
                      },
                    }] : []),
                    // Track count
                    {
                      type: 'div',
                      props: {
                        tw: 'flex',
                        children: {
                          type: 'div',
                          props: {
                            tw: 'flex text-lg text-[#DAFF01] border border-[#DAFF01] px-4 py-2',
                            style: { borderRadius: '2px' },
                            children: `${trackCount} tracks`,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            tw: 'flex items-center justify-between w-full p-12 border-t-2 border-[#DAFF01]',
            children: [
              {
                type: 'div',
                props: {
                  tw: 'flex items-center',
                  children: [
                    // Profile image in footer
                    {
                      type: 'div',
                      props: {
                        tw: 'flex mr-4',
                        style: { position: 'relative' },
                        children: [
                          { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '3px', left: '3px', width: '56px', height: '56px', background: '#FF4757', opacity: 0.5, borderRadius: '2px' } } },
                          { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '-3px', left: '-3px', width: '56px', height: '56px', background: '#00D9FF', opacity: 0.3, borderRadius: '2px' } } },
                          {
                            type: 'img',
                            props: {
                              src: profileImageDataUrl,
                              width: 56,
                              height: 56,
                              tw: 'flex border-2 border-[#DAFF01]',
                              style: { borderRadius: '2px', objectFit: 'cover', position: 'relative' },
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        tw: 'flex flex-col',
                        children: [
                          { type: 'span', props: { tw: 'text-lg font-semibold text-white', children: siteConfig.title } },
                          { type: 'span', props: { tw: 'text-sm text-[#8A8A8A]', children: 'Developer // Gamer // Maker' } },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  tw: 'flex items-center',
                  children: { type: 'span', props: { tw: 'text-lg text-[#00FF87] font-semibold', children: '♫ Spotify' } },
                },
              },
            ],
          },
        },
        // Bottom glitch line
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#00D9FF', opacity: 0.5 } } },
      ],
    },
  };
}

export async function GET({ params: { slug } }: APIContext) {
  try {
    await loadAssets();
    if (typeof slug !== "string") {
      return new Response("Not Found", { status: 404 });
    }

    const playlist = await getPlaylistfromDB(slug);
    const title = playlist?.name ?? siteConfig.title;
    const description = playlist?.description ?? '';
    const trackCount = playlist?.tracks?.length ?? 0;
    const artwork = (playlist?.artwork[0]?.url && playlist?.artwork[0]?.url.length > 0)
      ? playlist?.artwork[0]?.url
      : 'https://res.cloudinary.com/dr-dinomight/image/upload/v1676719004/192x192_hdl78r.png';

    const svg = await satori(
      markup(parseString(title), parseString(description), trackCount, artwork) as any,
      getOgOptions() as any
    );
    const png = new Resvg(svg).render().asPng();

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (e) {
    console.error('OG Image generation failed:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

function parseString(text: string): string {
  const { window } = new JSDOM(`<!doctype html><body>${text}</body></html>`);
  return window.document.body.textContent || '';
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const playlists = await getPlaylistsfromDB();
  return playlists.map(({ id }) => ({ params: { slug: id } }));
}
