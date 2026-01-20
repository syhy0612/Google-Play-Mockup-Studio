# Google Play Mockup Studio

**English** | [简体中文](./README.md)

A high-fidelity Google Play Store listing generator and simulator. This tool allows developers and designers to preview and customize their app store presence in real-time with a pixel-perfect mobile interface.

## 🚀 Live Demo & Download

- **Web Preview**: [google-play-mockup.pages.dev](https://google-play-mockup.pages.dev/)
- **Android APK**: [Download Latest Release](https://github.com/syhy0612/Google-Play-Mockup-Studio/releases/latest)

## Features

*   **Realistic Simulation**: Accurately mimics the Google Play Store experience, including Discovery (Home), Search, and App Details views.
*   **Real-time Editor**:
    *   **Customize Metadata**: Edit App Name, Developer Name, Description, Ratings, Downloads, and more.
    *   **Asset Management**: Upload and manage App Icon, Feature Banner, and Screenshots.
    *   **Visual Control**: Adjust screenshot gallery height and preview settings.
*   **Interactive Preview**:
    *   **Lightbox Gallery**: Click screenshots to view them in a full-screen lightbox with swipe support.
    *   **Banner Toggle**: Click the App Icon in the Details view to toggle the Feature Graphic banner.
    *   **Navigation**: Functional Back, Search, and Tab navigation simulation.
*   **Mobile-First & Responsive**:
    *   **Notch/Safe-area Support**: Fully adapted for devices with notches/cutouts (e.g., modern iPhones, Androids) using `safe-area-inset`.
    *   **Touch Interactions**: Drag-to-scroll galleries and smooth transitions using Framer Motion.
*   **Localization**: Built-in support for English (EN) and Chinese (ZH) interface languages.
*   **Blue Theme**: Updated to the latest Play Store visual style with #2656C8 accent color.

## Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (v3)
*   **Animations**: Framer Motion
*   **Mobile Wrapper**: Capacitor (Android support)
*   **Icons**: Lucide React

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/google-play-mockup-studio.git
    cd google-play-mockup-studio
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Start the development server:

```bash
npm run dev
```

Open your browser to the local URL provided (usually `http://localhost:5173`).

### Building

Build the project for production:

```bash
npm run build
```

## Usage Guide

1.  **Open Settings**: Click the **purple 'D' avatar** in the top-right corner of the Discovery page (or the settings icon in other views) to open the **Editor Panel**.
2.  **Edit Content**:
    *   **Info Tab**: Change text fields like App Name, Description, Tags, etc.
    *   **Visual Tab**: Update App Icon, Feature Graphic, and Screenshots.
    *   **Schemes Tab**: Save and load different app configurations.
3.  **Preview Interactions**:
    *   **Screenshots**: Click any screenshot in the preview to open the full-screen viewer.
    *   **Banner**: On the Details page, click the App Icon next to the title to show/hide the large Feature Graphic at the top.
    *   **Language**: Toggle between English and Chinese in the Global Settings section of the Editor Panel.

## Recent Updates (v1.1)

*   **Navigation Logic**:
    *   **Fixed Back Button**: Search page back button now correctly follows navigation history (returning to Discovery or previous view).
    *   **Default View**: App now strictly launches in Discovery view with Banner enabled by default.
    *   **Details Banner**: Feature Graphic in Details view is now **hidden by default** (click App Icon to toggle).
*   **Preview Improvements**:
    *   **Adaptive Screenshots**: Search page screenshots now respect aspect ratio (no longer cropped).
    *   **Lightbox Flow**: Closing a lightbox image now correctly triggers a history back action.
*   **Performance & Storage**:
    *   **Optimized Saving**: Reverted to LocalStorage with incremental saving logic (only saves changed data) to fix "QuotaExceededError" while maintaining performance.
    *   **Avatar Interaction**: Discovery page avatar now correctly opens settings without triggering search navigation.
*   **UI Polish**: Unified accent color to Blue (#2656C8), fixed install button styles, and removed bottom home indicator.
*   **Notch Support**: Added `viewport-fit=cover` and dynamic padding to support status bars on bezel-less devices.

## License

MIT
