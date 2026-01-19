import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.google.mockup',
  appName: 'Play Mockup',
  webDir: 'dist',
  
  // ✨ 新增这部分配置 ✨
  plugins: {
    SplashScreen: {
      // 1. 【核心】设置背景颜色为纯白
      // 这会改变 Android 12+ 自动合成时的底色，也会填充图片的空隙
      backgroundColor: "#ffffff", 

      // 2. 启动图显示时长 (毫秒)，3秒比较合适
      launchShowDuration: 1000,
      
      // 3. 自动隐藏 (必须为 true，否则你要自己在代码里关)
      launchAutoHide: true,

      // 4. 图片缩放模式
      // CENTER_CROP: 填满屏幕 (可能会裁掉一点边缘)
      // CENTER_INSIDE: 完整显示图片 (可能会有留白，但因为背景是白色所以看不出来)
      // 推荐用 CENTER_CROP 看起来更沉浸
      androidScaleType: "CENTER_CROP",

      // 5. 建议关掉转圈圈 (Loading Spinner)
      // 白底配个灰色圈圈通常不太好看，现在的 App 一般都不显示这个
      showSpinner: false,
      
      // (可选) 如果你想改转圈圈的颜色
      // androidSpinnerStyle: "large",
      // spinnerColor: "#999999",
    },
  },
};

export default config;