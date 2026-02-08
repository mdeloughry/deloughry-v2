/**
 * OG Image Testing Script
 *
 * Tests OG image generation locally by fetching images from the dev server
 * and saving them to a test-og-images directory for preview.
 *
 * Usage: npm run test:og
 *
 * Requirements: Dev server must be running (npm run dev)
 */

import { mkdir, writeFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const isLive = args.includes('--live');

const BASE_URL = isLive
  ? (process.env.OG_TEST_URL || 'https://deloughry.co.uk')
  : (process.env.OG_TEST_URL || 'http://localhost:4321');
const OUTPUT_DIR = './test-og-images';

interface TestCase {
  name: string;
  url: string;
  description: string;
}

async function getTestCases(): Promise<TestCase[]> {
  const testCases: TestCase[] = [
    // Generic OG images
    {
      name: 'generic-home',
      url: `${BASE_URL}/og-image/generic.png?title=Home&subtitle=A%20little%20hovel%20of%20Mine`,
      description: 'Generic OG image for home page',
    },
    {
      name: 'generic-about',
      url: `${BASE_URL}/og-image/generic.png?title=About&subtitle=All%20about%20me%20Matt`,
      description: 'Generic OG image for about page',
    },
    {
      name: 'generic-projects',
      url: `${BASE_URL}/og-image/generic.png?title=Projects&subtitle=A%20collection%20of%20tools%20and%20experiments`,
      description: 'Generic OG image for projects page',
    },
  ];

  // Try to fetch a sample blog post
  try {
    const postsDir = './src/content/post';
    if (existsSync(postsDir)) {
      const files = await readdir(postsDir);
      const mdxFiles = files.filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
      if (mdxFiles.length > 0) {
        // Get first 3 posts for testing
        const samplePosts = mdxFiles.slice(0, 3);
        for (const file of samplePosts) {
          const slug = file.replace(/\.(mdx?|md)$/, '');
          testCases.push({
            name: `post-${slug}`,
            url: `${BASE_URL}/og-image/${slug}.png`,
            description: `Blog post OG image: ${slug}`,
          });
        }
      }
    }
  } catch (e) {
    console.log('Could not read posts directory, skipping post OG tests');
  }

  // Try to fetch sample recipes
  try {
    const recipesDir = './src/recipes';
    if (existsSync(recipesDir)) {
      const files = await readdir(recipesDir);
      const cookFiles = files.filter(f => f.endsWith('.cook'));
      if (cookFiles.length > 0) {
        const sampleRecipes = cookFiles.slice(0, 2);
        for (const file of sampleRecipes) {
          const slug = file.replace('.cook', '');
          testCases.push({
            name: `recipe-${slug}`,
            url: `${BASE_URL}/recipes/og-image/${slug}.png`,
            description: `Recipe OG image: ${slug}`,
          });
        }
      }
    }
  } catch (e) {
    console.log('Could not read recipes directory, skipping recipe OG tests');
  }

  return testCases;
}

async function fetchAndSaveImage(testCase: TestCase): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`  Fetching: ${testCase.name}...`);

    const response = await fetch(testCase.url, {
      headers: {
        'Accept': 'image/png,image/svg+xml,image/*',
      },
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const contentType = response.headers.get('content-type') || '';
    const extension = contentType.includes('svg') ? 'svg' : 'png';
    const buffer = Buffer.from(await response.arrayBuffer());

    const filename = `${testCase.name}.${extension}`;
    const filepath = join(OUTPUT_DIR, filename);

    await writeFile(filepath, buffer);

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function generateIndexHtml(testCases: TestCase[], results: Map<string, boolean>): Promise<void> {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OG Image Test Results</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'JetBrains Mono', monospace;
      background: #000;
      color: #E5E5E5;
      padding: 2rem;
      margin: 0;
    }
    h1 {
      color: #DAFF01;
      border-bottom: 2px solid #DAFF01;
      padding-bottom: 1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .card {
      background: #0A0A0A;
      border: 2px solid #333;
      padding: 1rem;
    }
    .card.success { border-color: #00FF87; }
    .card.error { border-color: #FF4757; }
    .card h3 {
      margin: 0 0 0.5rem 0;
      color: #DAFF01;
      font-size: 0.875rem;
    }
    .card p {
      margin: 0 0 1rem 0;
      color: #8A8A8A;
      font-size: 0.75rem;
    }
    .card img {
      width: 100%;
      height: auto;
      border: 1px solid #333;
    }
    .status {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      display: inline-block;
      margin-bottom: 0.5rem;
    }
    .status.success { background: #00FF87; color: #000; }
    .status.error { background: #FF4757; color: #fff; }
    .timestamp {
      color: #8A8A8A;
      font-size: 0.75rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <h1>// OG Image Test Results</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>

  <div class="grid">
    ${testCases.map(tc => {
      const success = results.get(tc.name) ?? false;
      const ext = 'png';
      return `
    <div class="card ${success ? 'success' : 'error'}">
      <span class="status ${success ? 'success' : 'error'}">${success ? 'OK' : 'FAILED'}</span>
      <h3>${tc.name}</h3>
      <p>${tc.description}</p>
      ${success ? `<img src="./${tc.name}.${ext}" alt="${tc.name}" loading="lazy" />` : '<p style="color: #FF4757;">Failed to generate</p>'}
    </div>`;
    }).join('\n')}
  </div>

  <p class="timestamp">Run <code>npm run test:og</code> to regenerate</p>
</body>
</html>`;

  await writeFile(join(OUTPUT_DIR, 'index.html'), html);
}

async function main(): Promise<void> {
  console.log('\n🖼️  OG Image Test Runner\n');
  console.log(`Mode: ${isLive ? 'LIVE' : 'LOCAL'}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Check if server is accessible (skip for live mode)
  if (!isLive) {
    try {
      await fetch(BASE_URL);
    } catch {
      console.error('❌ Error: Dev server is not running!');
      console.error(`   Please start the dev server first: npm run dev\n`);
      process.exit(1);
    }
  } else {
    // For live mode, just verify the URL is accessible
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        console.warn(`⚠️  Warning: Live URL returned ${response.status}`);
      }
    } catch (error) {
      console.warn(`⚠️  Warning: Could not verify live URL accessibility`);
    }
  }

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  // Get test cases
  const testCases = await getTestCases();
  console.log(`Found ${testCases.length} test cases\n`);

  // Fetch and save each image
  const results = new Map<string, boolean>();
  let successCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    const result = await fetchAndSaveImage(testCase);
    results.set(testCase.name, result.success);

    if (result.success) {
      console.log(`  ✅ ${testCase.name}`);
      successCount++;
    } else {
      console.log(`  ❌ ${testCase.name}: ${result.error}`);
      failCount++;
    }
  }

  // Generate index.html
  await generateIndexHtml(testCases, results);

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log(`\n📊 Results: ${successCount} passed, ${failCount} failed\n`);

  if (successCount > 0) {
    console.log(`📁 Images saved to: ${OUTPUT_DIR}/`);
    console.log(`🌐 Open ${OUTPUT_DIR}/index.html in a browser to preview\n`);
  }

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
