export interface OgImage {
  url: string;
  width?: string;
  height?: string;
  type?: string;
  alt?: string;
}

export interface OgResult {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: OgImage[];
  ogUrl?: string;
  ogSiteName?: string;
  ogType?: string;
  ogLocale?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: OgImage[];
  twitterSite?: string;
  twitterCreator?: string;
  favicon?: string;
  charset?: string;
  requestUrl?: string;
  success?: boolean;
}

export interface ValidationItem {
  tag: string;
  label: string;
  value?: string;
  message: string;
}

export interface ValidationResult {
  score: number;
  passed: ValidationItem[];
  warnings: ValidationItem[];
  errors: ValidationItem[];
}

export interface OgAnalysisResult {
  success: boolean;
  url: string;
  fetchedAt: string;
  result?: OgResult;
  validation: ValidationResult;
  error?: {
    code: string;
    message: string;
  };
}
