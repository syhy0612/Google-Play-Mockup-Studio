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

export interface I18nStrings {
  // Preview
  install: string;
  uninstall: string;
  open: string;
  reviews: string;
  downloads: string;
  ratedFor: string;
  aboutApp: string;
  aboutAppSubtitle: string;
  dataSafety: string;
  dataSafetySubtitle: string;
  editorsChoice: string;
  rateThisApp: string;
  devContact: string;
  writeReview: string;
  
  // Controller
  settings: string;
  basicInfo: string;
  metrics: string;
  visualAssets: string;
  manageScreenshots: string;
  uploadLogo: string;
  uploadBanner: string;
  uploadScreenshots: string;
  appNamePlaceholder: string;
  devNamePlaceholder: string;
  descPlaceholder: string;
  uiLanguage: string;
  versionLabel: string;
  
  // Actions
  delete: string;
  moveLeft: string;
  moveRight: string;
  close: string;
  edit: string;
}