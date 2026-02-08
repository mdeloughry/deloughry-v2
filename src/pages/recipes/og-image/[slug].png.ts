import type { APIContext, GetStaticPathsResult } from 'astro';
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import siteConfig from "@/site-config";
import { getRecipe, getAllRecipes } from '../../../lib/recipes.data';
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

function markup(title: string, tags: string[] = [], servings?: number) {
  const tagElements = tags.slice(0, 3).map(tag => ({
    type: 'div',
    props: {
      tw: 'flex text-base text-[#FFB347] mr-3 border border-[#FFB347] px-3 py-1',
      style: { borderRadius: '2px' },
      children: tag,
    },
  }));

  const servingsElement = servings ? [{
    type: 'div',
    props: {
      tw: 'flex text-base text-[#8A8A8A] ml-2',
      children: `· ${servings} servings`,
    },
  }] : [];

  return {
    type: 'div',
    props: {
      tw: 'flex flex-col w-full h-full bg-black text-[#E5E5E5]',
      style: { fontFamily: 'JetBrains Mono', position: 'relative' },
      children: [
        // Glitch lines
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: '#FF4757', opacity: 0.6 } } },
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '10px', left: 0, width: '100%', height: '3px', background: '#00D9FF', opacity: 0.4 } } },
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '60px', right: 0, width: '40%', height: '2px', background: '#FFB347', opacity: 0.5 } } },
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', bottom: '100px', left: 0, width: '50%', height: '2px', background: '#FF4757', opacity: 0.3 } } },
        // Main content
        {
          type: 'div',
          props: {
            tw: 'flex flex-1 w-full p-12 items-center',
            children: [
              // MPD box with glitch effect
              {
                type: 'div',
                props: {
                  tw: 'flex mr-10',
                  style: { position: 'relative' },
                  children: [
                    { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '5px', left: '5px', width: '140px', height: '140px', background: '#FF4757', opacity: 0.5, borderRadius: '4px' } } },
                    { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '-5px', left: '-5px', width: '140px', height: '140px', background: '#00D9FF', opacity: 0.3, borderRadius: '4px' } } },
                    {
                      type: 'div',
                      props: {
                        tw: 'flex items-center justify-center w-[140px] h-[140px] border-3 border-[#FFB347] bg-black',
                        style: { borderRadius: '4px', position: 'relative' },
                        children: { type: 'span', props: { tw: 'text-[#FFB347] text-5xl font-bold', children: 'MPD' } },
                      },
                    },
                  ],
                },
              },
              // Text content
              {
                type: 'div',
                props: {
                  tw: 'flex flex-col flex-1 justify-center',
                  children: [
                    // Category label
                    {
                      type: 'div',
                      props: {
                        tw: 'flex items-center mb-3',
                        children: [
                          { type: 'span', props: { tw: 'text-[#FFB347] text-xl mr-2', children: '//' } },
                          { type: 'span', props: { tw: 'text-[#8A8A8A] text-xl', children: 'Recipe' } },
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
                    // Tags and servings
                    {
                      type: 'div',
                      props: {
                        tw: 'flex items-center flex-wrap',
                        children: [...tagElements, ...servingsElement],
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
            tw: 'flex items-center justify-between w-full p-10 border-t-2 border-[#FFB347]',
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
                          { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '3px', left: '3px', width: '48px', height: '48px', background: '#FF4757', opacity: 0.5, borderRadius: '2px' } } },
                          { type: 'div', props: { tw: 'flex', style: { position: 'absolute', top: '-3px', left: '-3px', width: '48px', height: '48px', background: '#00D9FF', opacity: 0.3, borderRadius: '2px' } } },
                          {
                            type: 'img',
                            props: {
                              src: profileImageDataUrl,
                              width: 48,
                              height: 48,
                              tw: 'flex border-2 border-[#FFB347]',
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
                  children: { type: 'span', props: { tw: 'text-lg text-[#FFB347]', children: 'deloughry.co.uk' } },
                },
              },
            ],
          },
        },
        // Bottom glitch lines
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#00D9FF', opacity: 0.5 } } },
        { type: 'div', props: { tw: 'flex', style: { position: 'absolute', bottom: '7px', left: 0, width: '70%', height: '2px', background: '#FF4757', opacity: 0.3 } } },
      ],
    },
  };
}

export async function GET({ params }: APIContext) {
  try {
    await loadAssets();
    const recipe = await getRecipe(params.slug!);
    if (!recipe) return new Response('Not found', { status: 404 });

    const svg = await satori(markup(recipe.title, recipe.tags, recipe.servings) as any, getOgOptions() as any);
    const png = new Resvg(svg).render().asPng();

    return new Response(png, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (e) {
    console.error('OG Image generation failed:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => ({ params: { slug: recipe.slug } }));
}
