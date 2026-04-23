export type Language = 'en' | 'zh';

export interface AppConfig {
  appName: string;
  devName: string;
  description: string;
  rating: string;
  downloads: string;
  reviews: string;
  size: string;
  ratedFor: string;
  version: string;
  logoUrl: string;
  bannerUrl: string;
  screenshots: string[];
  tags: string[];
}

export interface SavedScheme {
  id: string;
  name: string;
  config: AppConfig;
  savedAt: number;
}

// Strings used inside the phone preview only.
// Editor panel UI is hardcoded Chinese per design spec.
export interface I18nStrings {
  install: string;
  reviews: string;
  downloads: string;
  aboutApp: string;
  dataSafety: string;
  dataSafetySubtitle: string;
}
