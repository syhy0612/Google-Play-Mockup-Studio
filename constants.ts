import { AppConfig, I18nStrings, Language } from './types';

export const INITIAL_CONFIG: AppConfig = {
  appName: "Play Mockup",
  devName: "Telegram@MayGoogle",
  description: "It simulates the Google Play app store experience and supports native swiping and image editing.",
  rating: "4.7",
  downloads: "500M+",
  reviews: "12M",
  size: "45 MB",
  ratedFor: "3+",
  version: "1.0.0",
  logoUrl: "https://picsum.photos/id/237/200/200", 
  bannerUrl: "/assets/Feature.png",
  screenshots: [

  ],
  tags: ["Developer", "Tools", "Design"]
};

// NOTE: These strings are ONLY for the Preview Content inside the phone frame.
// The Editor Panel UI is static Chinese per v1.5 specs.
export const DICTIONARY: Record<Language, I18nStrings> = {
  en: {
    install: "Install",
    uninstall: "Uninstall",
    open: "Open",
    reviews: "reviews",
    downloads: "Downloads",
    ratedFor: "Rated for 3+",
    aboutApp: "About this app",
    aboutAppSubtitle: "arrow_forward",
    dataSafety: "Data safety",
    dataSafetySubtitle: "Safety starts with understanding how developers collect and share your data.",
    editorsChoice: "Editors' Choice",
    rateThisApp: "Rate this app",
    devContact: "Developer contact",
    writeReview: "Write a review",
    // These keys are kept for type compatibility but unused in Editor UI
    settings: "", basicInfo: "", metrics: "", visualAssets: "", manageScreenshots: "", 
    uploadLogo: "", uploadBanner: "", uploadScreenshots: "", appNamePlaceholder: "", 
    devNamePlaceholder: "", descPlaceholder: "", uiLanguage: "", versionLabel: "", 
    delete: "", moveLeft: "", moveRight: "", close: "", edit: ""
  },
  zh: {
    install: "安装",
    uninstall: "卸载",
    open: "打开",
    reviews: "万条评价",
    downloads: "次下载",
    ratedFor: "3岁以上",
    aboutApp: "关于此应用",
    aboutAppSubtitle: "arrow_forward",
    dataSafety: "数据安全",
    dataSafetySubtitle: "安全始于了解开发者如何收集和分享您的数据。",
    editorsChoice: "编辑精选",
    rateThisApp: "为应用评分",
    devContact: "开发者联系方式",
    writeReview: "撰写评论",
    settings: "", basicInfo: "", metrics: "", visualAssets: "", manageScreenshots: "", 
    uploadLogo: "", uploadBanner: "", uploadScreenshots: "", appNamePlaceholder: "", 
    devNamePlaceholder: "", descPlaceholder: "", uiLanguage: "", versionLabel: "", 
    delete: "", moveLeft: "", moveRight: "", close: "", edit: ""
  }
};