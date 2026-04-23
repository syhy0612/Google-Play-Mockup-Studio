import { AppConfig, I18nStrings, Language } from './types';

export const INITIAL_CONFIG: AppConfig = {
  appName: "Play Mockup",
  devName: "Telegram@MayGong",
  description: "It simulates the Google Play app store experience and supports native swiping and image editing.",
  rating: "4.7",
  downloads: "500M+",
  reviews: "12M",
  size: "45 MB",
  ratedFor: "3+",
  version: "1.0.0",
  logoUrl: "https://picsum.photos/id/237/200/200",
  bannerUrl: "/assets/Feature.png",
  screenshots: [],
  tags: ["Developer", "Tools", "Design"],
};

// Strings used inside the phone preview only.
// Editor panel UI is hardcoded Chinese per design spec.
export const DICTIONARY: Record<Language, I18nStrings> = {
  en: {
    install: "Install",
    reviews: "reviews",
    downloads: "Downloads",
    aboutApp: "About this app",
    dataSafety: "Data safety",
    dataSafetySubtitle: "Safety starts with understanding how developers collect and share your data.",
  },
  zh: {
    install: "安装",
    reviews: "万条评价",
    downloads: "次下载",
    aboutApp: "关于此应用",
    dataSafety: "数据安全",
    dataSafetySubtitle: "安全始于了解开发者如何收集和分享您的数据。",
  },
};
