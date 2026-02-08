import type { APIContext } from 'astro';
import ogs from 'open-graph-scraper';
import { validateOgTags } from '../../lib/ogValidator';
import type { OgAnalysisResult } from '../../components/OgTester/types';

export const prerender = false;

const ALLOWED_ORIGINS = [
  'https://deloughry.co.uk',
  'https://www.deloughry.co.uk',
  'http://localhost:4321',
  'http://localhost:3000',
];

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function POST({ request }: APIContext): Promise<Response> {
  // Security: Check Origin header
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Security: Check Referer header as backup
  const referer = request.headers.get('referer');
  if (!referer || !ALLOWED_ORIGINS.some(o => referer.startsWith(o))) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return jsonResponse({
        success: false,
        url: '',
        fetchedAt: new Date().toISOString(),
        validation: { score: 0, passed: [], warnings: [], errors: [] },
        error: { code: 'INVALID_URL', message: 'Please provide a valid URL' },
      }, 400);
    }

    // Basic URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return jsonResponse({
        success: false,
        url,
        fetchedAt: new Date().toISOString(),
        validation: { score: 0, passed: [], warnings: [], errors: [] },
        error: { code: 'INVALID_URL', message: 'Please enter a valid URL starting with http:// or https://' },
      }, 400);
    }

    // Fetch OG data
    const { result, error } = await ogs({
      url,
      timeout: 8000,
      onlyGetOpenGraphInfo: false,
      fetchOptions: {
        headers: { 'user-agent': USER_AGENT },
      },
    });

    if (error || !result.success) {
      const errorMessage = getErrorMessage(result);
      return jsonResponse({
        success: false,
        url,
        fetchedAt: new Date().toISOString(),
        validation: { score: 0, passed: [], warnings: [], errors: [] },
        error: { code: 'FETCH_ERROR', message: errorMessage },
      });
    }

    // Validate the OG tags
    const validation = validateOgTags(result);

    return jsonResponse({
      success: true,
      url,
      fetchedAt: new Date().toISOString(),
      result,
      validation,
    });

  } catch (err) {
    console.error('OG Tester API error:', err);
    return jsonResponse({
      success: false,
      url: '',
      fetchedAt: new Date().toISOString(),
      validation: { score: 0, passed: [], warnings: [], errors: [] },
      error: { code: 'UNKNOWN', message: 'An unexpected error occurred' },
    }, 500);
  }
}

function jsonResponse(data: OgAnalysisResult, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function getErrorMessage(result: any): string {
  if (result.error) {
    if (result.error.includes('timeout')) {
      return 'The website took too long to respond. Try again later.';
    }
    if (result.error.includes('404')) {
      return 'Page not found (404). Check the URL is correct.';
    }
    if (result.error.includes('403') || result.error.includes('blocked')) {
      return 'Access denied. The website may be blocking automated requests.';
    }
  }
  return 'Failed to fetch the URL. The website may be down or blocking requests.';
}
