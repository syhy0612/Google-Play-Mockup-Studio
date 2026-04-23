import { Language } from '../types';

export interface PreviewExtras {
  searchPlaceholder: string;
  forYou: string;
  topCharts: string;
  children: string;
  premium: string;
  recommended: string;
  games: string;
  apps: string;
  books: string;
  ads: string;
  newUpdated: string;
}

const EXTRAS: Record<Language, PreviewExtras> = {
  en: {
    searchPlaceholder: 'Search apps & games',
    forYou: 'For you',
    topCharts: 'Top charts',
    children: 'Children',
    premium: 'Premium',
    recommended: 'Recommended for you',
    games: 'Games',
    apps: 'Apps',
    books: 'Books',
    ads: 'Ad',
    newUpdated: 'New & Updated',
  },
  zh: {
    searchPlaceholder: '搜索应用和游戏',
    forYou: '为您推荐',
    topCharts: '排行榜',
    children: '儿童',
    premium: '付费',
    recommended: '为您推荐',
    games: '游戏',
    apps: '应用',
    books: '图书',
    ads: '广告',
    newUpdated: '新上架和更新',
  },
};

export const getPreviewExtras = (lang: Language): PreviewExtras => EXTRAS[lang];
