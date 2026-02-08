import type { OgResult, ValidationResult, ValidationItem } from '../components/OgTester/types';

const REQUIRED_TAGS = [
  { tag: 'og:title', key: 'ogTitle', label: 'Title' },
  { tag: 'og:description', key: 'ogDescription', label: 'Description' },
  { tag: 'og:image', key: 'ogImage', label: 'Image' },
  { tag: 'og:url', key: 'ogUrl', label: 'URL' },
];

const RECOMMENDED_TAGS = [
  { tag: 'og:type', key: 'ogType', label: 'Type' },
  { tag: 'og:site_name', key: 'ogSiteName', label: 'Site Name' },
  { tag: 'og:locale', key: 'ogLocale', label: 'Locale' },
];

const TWITTER_TAGS = [
  { tag: 'twitter:card', key: 'twitterCard', label: 'Twitter Card' },
  { tag: 'twitter:title', key: 'twitterTitle', label: 'Twitter Title' },
  { tag: 'twitter:description', key: 'twitterDescription', label: 'Twitter Description' },
];

export function validateOgTags(result: OgResult): ValidationResult {
  const passed: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];
  const errors: ValidationItem[] = [];

  // Check required tags
  for (const { tag, key, label } of REQUIRED_TAGS) {
    const value = getTagValue(result, key);
    if (value) {
      passed.push({
        tag,
        label,
        value: truncateValue(value),
        message: `${label} is present`,
      });
    } else {
      errors.push({
        tag,
        label,
        message: `Missing ${tag} - required for social sharing`,
      });
    }
  }

  // Check recommended tags
  for (const { tag, key, label } of RECOMMENDED_TAGS) {
    const value = getTagValue(result, key);
    if (value) {
      passed.push({
        tag,
        label,
        value: truncateValue(value),
        message: `${label} is present`,
      });
    } else {
      warnings.push({
        tag,
        label,
        message: `Missing ${tag} - recommended for better previews`,
      });
    }
  }

  // Check Twitter tags
  for (const { tag, key, label } of TWITTER_TAGS) {
    const value = getTagValue(result, key);
    if (value) {
      passed.push({
        tag,
        label,
        value: truncateValue(value),
        message: `${label} is present`,
      });
    } else {
      // Only warn if there's no fallback OG tag
      const ogFallback = key.replace('twitter', 'og');
      if (!getTagValue(result, ogFallback)) {
        warnings.push({
          tag,
          label,
          message: `Missing ${tag} with no OG fallback`,
        });
      }
    }
  }

  // Quality checks
  const title = result.ogTitle || result.twitterTitle;
  if (title) {
    if (title.length > 95) {
      errors.push({
        tag: 'og:title',
        label: 'Title Length',
        value: `${title.length} chars`,
        message: 'Title is too long (>95 chars) - will be truncated',
      });
    } else if (title.length > 70) {
      warnings.push({
        tag: 'og:title',
        label: 'Title Length',
        value: `${title.length} chars`,
        message: 'Title may be truncated on some platforms (>70 chars)',
      });
    } else if (title.length >= 30) {
      passed.push({
        tag: 'og:title',
        label: 'Title Length',
        value: `${title.length} chars`,
        message: 'Title length is optimal',
      });
    }
  }

  const description = result.ogDescription || result.twitterDescription;
  if (description) {
    if (description.length > 200) {
      errors.push({
        tag: 'og:description',
        label: 'Description Length',
        value: `${description.length} chars`,
        message: 'Description is too long (>200 chars)',
      });
    } else if (description.length > 160) {
      warnings.push({
        tag: 'og:description',
        label: 'Description Length',
        value: `${description.length} chars`,
        message: 'Description may be truncated (>160 chars)',
      });
    } else if (description.length >= 50) {
      passed.push({
        tag: 'og:description',
        label: 'Description Length',
        value: `${description.length} chars`,
        message: 'Description length is optimal',
      });
    }
  }

  // Image checks
  const images = result.ogImage || result.twitterImage;
  if (images && images.length > 0) {
    const img = images[0];

    if (img.url && !img.url.startsWith('https://')) {
      warnings.push({
        tag: 'og:image',
        label: 'Image HTTPS',
        value: img.url.substring(0, 50),
        message: 'Image should use HTTPS for security',
      });
    }

    if (img.width && img.height) {
      const width = parseInt(img.width);
      const height = parseInt(img.height);
      if (width >= 1200 && height >= 630) {
        passed.push({
          tag: 'og:image',
          label: 'Image Dimensions',
          value: `${width}x${height}`,
          message: 'Image dimensions are optimal for sharing',
        });
      } else {
        warnings.push({
          tag: 'og:image',
          label: 'Image Dimensions',
          value: `${width}x${height}`,
          message: 'Recommended: 1200x630 or larger for best quality',
        });
      }
    } else {
      warnings.push({
        tag: 'og:image:width/height',
        label: 'Image Dimensions',
        message: 'Missing image dimensions - may cause layout shifts',
      });
    }

    if (!img.alt) {
      warnings.push({
        tag: 'og:image:alt',
        label: 'Image Alt Text',
        message: 'Missing image alt text - important for accessibility',
      });
    } else {
      passed.push({
        tag: 'og:image:alt',
        label: 'Image Alt Text',
        value: truncateValue(img.alt),
        message: 'Image has alt text for accessibility',
      });
    }
  }

  // Calculate score
  let score = 100;
  score -= errors.length * 20;
  score -= warnings.length * 5;
  score = Math.max(0, score);

  return { score, passed, warnings, errors };
}

function getTagValue(result: OgResult, key: string): string | undefined {
  const value = (result as any)[key];
  if (Array.isArray(value)) {
    return value[0]?.url || value[0];
  }
  return value;
}

function truncateValue(value: string, maxLength = 60): string {
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength) + '...';
}
