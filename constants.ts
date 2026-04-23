import { AppConfig, Language, I18nStrings } from './types';

export const INITIAL_CONFIG: AppConfig = {
  appName: "App Preview",
  devName: "Telegram@MayGong",
  description: "A design preview tool that simulates a mobile app listing UI with native swiping and image editing.",
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

export interface UIStrings {
  // Editor panel shell
  settingsPanel: string;
  closePanel: string;
  // Tabs
  tabInfo: string;
  tabVisual: string;
  tabSchemes: string;
  // Reset dialog
  resetTitle: string;
  resetMessage: string;
  // Info tab
  basicInfo: string;
  storeData: string;
  globalSettings: string;
  appName: string;
  developer: string;
  appTags: string;
  description: string;
  addTag: string;
  rating: string;
  downloads: string;
  size: string;
  ratedFor: string;
  previewLang: string;
  galleryHeight: string;
  reset: string;
  // Visual tab
  appIcon: string;
  featureBanner: string;
  screenshotMgmt: string;
  uploadScreenshots: string;
  noScreenshots: string;
  processingImages: string;
  iconUploadErr: string;
  bannerUploadErr: string;
  screenshotUploadErr: string;
  moveUp: string;
  moveDown: string;
  delete: string;
  previewWatermark: string;
  watermarkDesc: string;
  watermarkLabel: string;
  // Schemes tab
  saveScheme: string;
  saveSchemeMsg: string;
  renameScheme: string;
  renameSchemeMsg: string;
  deleteScheme: string;
  deleteSchemeMsg: string;
  updateScheme: string;
  updateSchemeMsg: string;
  loadScheme: string;
  loadSchemeMsg: string;
  saveCurrentScheme: string;
  savedSchemes: string;
  noSavedSchemes: string;
  save: string;
  load: string;
  rename: string;
  schemeScreenshots: string;
  saveFailed: string;
  renameFailed: string;
  deleteFailed: string;
  updateFailed: string;
  // Dialog
  cancel: string;
  confirm: string;
  storageFull: string;
}

export const UI_STRINGS: Record<Language, UIStrings> = {
  en: {
    settingsPanel: "Settings Panel",
    closePanel: "Close settings panel",
    tabInfo: "Info",
    tabVisual: "Visual",
    tabSchemes: "Schemes",
    resetTitle: "Reset Settings",
    resetMessage: "Are you sure you want to reset this section?",
    basicInfo: "Basic Info",
    storeData: "Store Data",
    globalSettings: "Global Settings",
    appName: "App Name",
    developer: "Developer",
    appTags: "App Tags",
    description: "Description",
    addTag: "Add",
    rating: "Rating",
    downloads: "Downloads",
    size: "Size",
    ratedFor: "Rated For",
    previewLang: "Preview Language",
    galleryHeight: "Screenshot Gallery Height",
    reset: "Reset",
    appIcon: "App Icon",
    featureBanner: "Feature Banner",
    screenshotMgmt: "Screenshot Management",
    uploadScreenshots: "Upload Screenshots",
    noScreenshots: "No screenshots yet",
    processingImages: "Processing images…",
    iconUploadErr: "Icon upload failed",
    bannerUploadErr: "Banner upload failed",
    screenshotUploadErr: "Screenshot upload failed",
    moveUp: "Move up",
    moveDown: "Move down",
    delete: "Delete",
    previewWatermark: "Preview Watermark",
    watermarkDesc: "Turn off to take clean screenshots. Watermark reappears when app restarts.",
    watermarkLabel: "Watermark on/off",
    saveScheme: "Save Scheme",
    saveSchemeMsg: "Enter a name for this scheme",
    renameScheme: "Rename Scheme",
    renameSchemeMsg: "Enter a new name",
    deleteScheme: "Delete Scheme",
    deleteSchemeMsg: "Are you sure you want to delete this scheme? This cannot be undone.",
    updateScheme: "Update Scheme",
    updateSchemeMsg: "Overwrite \"{name}\" with current config? This cannot be undone.",
    loadScheme: "Load Scheme",
    loadSchemeMsg: "Load \"{name}\"? Unsaved changes will be lost.",
    saveCurrentScheme: "Save Current Scheme",
    savedSchemes: "Saved Schemes",
    noSavedSchemes: "No saved schemes yet",
    save: "Save",
    load: "Load",
    rename: "Rename",
    schemeScreenshots: "screenshots",
    saveFailed: "Save failed",
    renameFailed: "Rename failed",
    deleteFailed: "Delete failed",
    updateFailed: "Update failed",
    cancel: "Cancel",
    confirm: "Confirm",
    storageFull: "Storage is full. Please delete some schemes or screenshots and try again.",
  },
  zh: {
    settingsPanel: "配置面板",
    closePanel: "关闭配置面板",
    tabInfo: "信息",
    tabVisual: "视觉",
    tabSchemes: "方案",
    resetTitle: "重置设置",
    resetMessage: "确定要重置该部分的设置吗？",
    basicInfo: "基本信息",
    storeData: "商店数据",
    globalSettings: "全局设置",
    appName: "应用名称",
    developer: "开发者名称",
    appTags: "应用标签",
    description: "应用描述",
    addTag: "添加",
    rating: "评分",
    downloads: "下载量",
    size: "应用大小",
    ratedFor: "分级",
    previewLang: "预览语言",
    galleryHeight: "截图区域高度",
    reset: "重置",
    appIcon: "应用图标",
    featureBanner: "置顶大图",
    screenshotMgmt: "截图管理",
    uploadScreenshots: "上传截图",
    noScreenshots: "暂无截图",
    processingImages: "正在处理图片…",
    iconUploadErr: "图标上传失败",
    bannerUploadErr: "大图上传失败",
    screenshotUploadErr: "截图上传失败",
    moveUp: "上移",
    moveDown: "下移",
    delete: "删除",
    previewWatermark: "预览水印",
    watermarkDesc: "关闭后可以截图无遮挡。重新打开应用时自动恢复显示。",
    watermarkLabel: "水印开关",
    saveScheme: "保存方案",
    saveSchemeMsg: "请输入方案名称",
    renameScheme: "重命名方案",
    renameSchemeMsg: "请输入新的方案名称",
    deleteScheme: "删除方案",
    deleteSchemeMsg: "确定要删除这个方案吗？此操作无法撤销。",
    updateScheme: "更新方案",
    updateSchemeMsg: "确定要用当前配置覆盖 \"{name}\" 吗？此操作无法撤销。",
    loadScheme: "加载方案",
    loadSchemeMsg: "确定要加载 \"{name}\" 吗？当前未保存的更改将会丢失。",
    saveCurrentScheme: "保存当前方案",
    savedSchemes: "已保存的方案",
    noSavedSchemes: "没有保存的方案",
    save: "保存",
    load: "加载",
    rename: "重命名",
    schemeScreenshots: "张截图",
    saveFailed: "保存失败",
    renameFailed: "重命名失败",
    deleteFailed: "删除失败",
    updateFailed: "更新失败",
    cancel: "取消",
    confirm: "确认",
    storageFull: "本地存储空间已满，请删除部分方案或截图后重试。",
  },
};
