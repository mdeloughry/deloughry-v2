import type { OgResult } from './types';

interface OgPreviewProps {
  result: OgResult;
  url: string;
}

export default function OgPreview({ result, url }: OgPreviewProps) {
  const title = result.ogTitle || result.twitterTitle || 'No title';
  const description = result.ogDescription || result.twitterDescription || 'No description';
  const imageUrl = result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url;
  const siteName = result.ogSiteName || new URL(url).hostname;

  return (
    <div className="og-previews">
      <h3 className="preview-heading">// Preview</h3>

      {/* Facebook/LinkedIn Style Preview */}
      <div className="preview-card facebook-preview">
        <span className="preview-label">Facebook / LinkedIn</span>
        {imageUrl && (
          <div className="preview-image">
            <img src={imageUrl} alt="OG Preview" loading="lazy" />
          </div>
        )}
        <div className="preview-content">
          <span className="preview-site">{siteName.toUpperCase()}</span>
          <h4 className="preview-title">{title}</h4>
          <p className="preview-description">{description}</p>
        </div>
      </div>

      {/* Twitter Style Preview */}
      <div className="preview-card twitter-preview">
        <span className="preview-label">Twitter / X</span>
        <div className="twitter-card">
          {imageUrl && (
            <div className="preview-image">
              <img src={imageUrl} alt="Twitter Preview" loading="lazy" />
            </div>
          )}
          <div className="preview-content">
            <h4 className="preview-title">{title}</h4>
            <p className="preview-description">{description}</p>
            <span className="preview-site">{siteName}</span>
          </div>
        </div>
      </div>

      {/* Raw Data */}
      <details className="raw-data">
        <summary>View Raw OG Data</summary>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </details>
    </div>
  );
}
