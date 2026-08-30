# 📖 Presbyterian Church of Ghana (PCG) Hymnal & Admin System

A modern, full-featured digital hymnal ecosystem built for the Presbyterian Church of Ghana. The repository consists of an **offline-first cross-platform mobile application** (iOS & Android) and a **cloud-synchronized Web Admin & Projection Portal** with live church service presenter mode.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
  - [📱 Mobile App (React Native / Expo)](#-mobile-app-react-native--expo)
  - [💻 Web Admin & Presenter Portal (React)](#-web-admin--presenter-portal-react)
- [Technology Stack](#-technology-stack)
- [Database Schema & Sync Architecture](#-database-schema--sync-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Backend & Database Setup (Supabase)](#1-backend--database-setup-supabase)
  - [2. Mobile App Setup](#2-mobile-app-setup)
  - [3. Web Admin Setup](#3-web-admin-setup)
- [Environment Variables](#-environment-variables)
- [Key Workflows & Capabilities](#-key-workflows--capabilities)
- [Available Scripts](#-available-scripts)
- [Contributing & Maintenance](#-contributing--maintenance)
- [License](#-license)

---

## 🌟 Overview

The **PCG Hymnal System** is crafted to preserve and elevate church worship through technology. It allows congregants, choristers, pastors, and audio-visual teams to access hymns, creeds, liturgies, and tunes anytime—both online and offline—while empowering church administrators with rich content management and live projection capabilities.

---

## 🏛 System Architecture

```
                                  ┌──────────────────────────┐
                                  │    Supabase Cloud DB     │
                                  │   (PostgreSQL + Storage) │
                                  └─────────────┬────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       │ REST / Auth / Storage API                       │
                       ▼                                                 ▼
        ┌──────────────────────────────┐                ┌──────────────────────────────┐
        │       Web Admin Portal       │                │      Mobile Application      │
        │      (React 19 + Vite/CRA)   │                │     (React Native / Expo)    │
        ├──────────────────────────────┤                ├──────────────────────────────┤
        │ • Hymn CMS & Rich Editor     │                │ • Offline SQLite DB (WAL)    │
        │ • Live Service Presenter     │                │ • Full Audio Player & Cache  │
        │ • Media / MP3 Audio Manager  │                │ • Tonic Sol-fa View          │
        │ • Liturgies & Creeds         │                │ • Bilingual (English & Twi)  │
        │ • JSON / CSV Bulk Import/Exp │                │ • Playlists & Favorites      │
        │ • Church Season Sets         │                │ • Dialpad Quick-Jump         │
        └──────────────────────────────┘                └──────────────────────────────┘
```

---

## ✨ Key Features

### 📱 Mobile App (React Native / Expo)

- **100% Offline-First Architecture**: Hymns, categories, and liturgy data are stored locally in an `expo-sqlite` database with WAL mode enabled.
- **Bilingual Hymns Support**: Instant switching or dual-view for English (`lyrics_en`, `title_en`) and Twi (`lyrics_twi`, `title_twi`).
- **Tonic Sol-fa Notation**: In-app sheet / sol-fa viewer for choristers and instrumentalists.
- **Integrated Audio Player & Offline Downloads**:
  - Background audio playback using `expo-av`.
  - Built-in floating Mini Player and expandable Full Player with scrub controls.
  - Download MP3 tracks to device storage using `expo-file-system` for full offline playback.
- **Church Liturgy & Creeds**: Apostles' Creed, Nicene Creed, Order of Service, and Sacraments in both English and Twi.
- **Smart Search & Quick Dialpad**:
  - Fuzzy text search powered by `fuse.js` across hymn numbers, titles, and lyrics.
  - Quick Dialpad modal to jump directly to any hymn number in seconds.
- **Personal Library & Custom Playlists**:
  - Bookmark favorite hymns.
  - Create, edit, and curate custom playlists for services, choir rehearsals, and personal devotions.
  - Recent view history tracking.
- **Theme & Typography Customization**:
  - Cathedral Navy and Regal Gold theme with polished Light and Midnight Dark modes.
  - Dynamic font size adjustment for readability during worship.
- **Delta Cloud Sync**: Automatically pulls new or updated hymns and categories from Supabase when network connectivity is detected (`@react-native-community/netinfo`).

---

### 💻 Web Admin & Presenter Portal (React)

- **Interactive Dashboard**: Real-time church hymnal statistics (total hymns, categories, audio availability, and active team members).
- **Hymn Content Management (CMS)**:
  - Add, edit, draft, or publish hymns.
  - Manage meter, key signature, tune composer, scripture references, tonic sol-fa notations, and categories.
- **Live Sunday Service Presenter (Projector Mode)**:
  - Fullscreen church sanctuary projection view (`/presenter` and `/presenter/:hymnId`).
  - Stanza-by-stanza keyboard navigation (Arrow keys, Spacebar, Esc).
  - Theme switching: Stage Black, Sanctuary Blue, Elegant Dark, and Clean Light.
  - Dual-language parallel display or single-language projection with scalable typography.
- **Media & Audio Hub**: Upload, preview, link, and manage MP3 audio files hosted on Supabase Storage or external CDNs.
- **Category & Season Sets Management**: Group hymns by liturgical themes (Praise & Adoration, Holy Communion, Lent, Easter, Baptism, etc.) and curated Church Season sets.
- **Liturgies & Creeds Management**: Maintain official PCG liturgies, confessional creeds, and orders of service.
- **Data Portability (Bulk Import & Backup)**:
  - One-click JSON database backup and restoration.
  - CSV bulk import/export with format validation.
- **Role-Based Authentication**: Secure access via Supabase Auth.

---

## 🛠 Technology Stack

| Platform / Layer | Technology / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Mobile Core** | React Native / Expo | `0.81.5` / `~54.0` | Cross-platform mobile foundation |
| **Mobile Navigation** | React Navigation | `v7` | Bottom tabs + Stack navigators |
| **Mobile State Management**| Zustand | `^5.0` | Lightweight, performant state management |
| **Mobile Database** | Expo SQLite | `~16.0` | Local SQL storage for offline access |
| **Mobile Audio & Media** | Expo AV & FileSystem | `~16.0` / `~19.0` | Audio streaming and local file downloads |
| **Mobile Search** | Fuse.js | `^7.4` | Fast client-side fuzzy searching |
| **Mobile Icons** | Tabler Icons React Native | `^3.46` | Vector iconography |
| **Web Frontend** | React | `^19.2` | Admin dashboard and projection portal |
| **Web Routing** | React Router DOM | `^7.18` | Client-side routing and presenter routes |
| **Web UI & Alerts** | FontAwesome / Custom CSS / SweetAlert2 | `^11.26` | Modern UI styling and feedback modals |
| **Cloud Backend & DB** | Supabase (PostgreSQL + Auth + Storage) | `^2.110` | Real-time database and audio bucket storage |

---

## 🗄 Database Schema & Sync Architecture

### Supabase / SQLite Tables

```sql
-- Hymns Table
CREATE TABLE hymns (
  id TEXT PRIMARY KEY,
  hymn_number INTEGER NOT NULL UNIQUE,
  category_id TEXT REFERENCES categories(id),
  title_en TEXT NOT NULL,
  title_twi TEXT,
  lyrics_en TEXT NOT NULL,
  lyrics_twi TEXT,
  tonic_solfa TEXT,
  composer TEXT,
  scripture_reference TEXT,
  meter TEXT,
  key_signature TEXT,
  audio_url TEXT,
  audio_duration INTEGER DEFAULT 0,
  audio_size_bytes INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories / Themes Table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_twi TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Local Mobile Tables (SQLite only)
-- favorites (hymn_id, added_at)
-- history (hymn_id, viewed_at)
-- playlists (id, name, description, created_at, updated_at)
-- playlist_hymns (id, playlist_id, hymn_id, sort_order, added_at)
-- downloads (hymn_id, file_path, file_size, downloaded_at)
-- sync_meta (key, value)
```

### Delta Sync Strategy
1. The mobile app stores `last_synced_at` in `sync_meta`.
2. When online, `syncService.js` queries Supabase with `.gte('updated_at', last_synced_at)`.
3. Only modified or newly added records are downloaded and written locally using `INSERT OR REPLACE INTO`.
4. `last_synced_at` is updated to the current timestamp.

---

## 📂 Project Directory Structure

```
PCG_Hymn/
├── mobile/                        # React Native / Expo Mobile Project
│   ├── app/                       # Expo Router / Root app entry
│   ├── assets/                    # Static assets, fonts, icons & images
│   ├── scripts/                   # Reset & utility scripts
│   ├── src/
│   │   ├── components/            # UI Components (HymnCard, FullPlayerModal, MiniPlayer,
│   │   │                          # QuickDialPadModal, PresentationModal, LyricsView, etc.)
│   │   ├── config/                # Supabase client configuration
│   │   ├── data/                  # Static Liturgy and Creed datasets
│   │   ├── database/              # SQLite schema, initializers, queries (localDb.js)
│   │   ├── navigation/            # Bottom tabs & stack navigators (AppNavigator.jsx)
│   │   ├── screens/               # Screen components (HomeScreen, HymnDetailScreen,
│   │   │                          # HymnListScreen, ExploreScreen, LibraryScreen, etc.)
│   │   ├── services/              # Audio streaming/downloading, sync, and search services
│   │   ├── stores/                # Zustand stores (hymnStore, playerStore, settingsStore)
│   │   ├── theme/                 # Theme definitions, colors, spacing, and typography
│   │   └── utils/                 # Constants, helpers, and formatters
│   ├── app.json                   # Expo configuration & app metadata
│   └── package.json
│
├── web/                           # React Admin & Sanctuary Presenter Web Portal
│   ├── public/                    # Static files & HTML template
│   ├── src/
│   │   ├── components/            # Shared components (Sidebar, Navbar, HymnFormDrawer, etc.)
│   │   ├── config/                # Supabase configuration and icon sets
│   │   ├── data/                  # Liturgies, Creeds, and Seasonal collection presets
│   │   ├── pages/                 # Admin pages (Dashboard, Hymns, Categories, Liturgies,
│   │   │                          # Media, Collections, Presenter, ImportExport, Users)
│   │   ├── App.css                # Global UI styling and responsive layouts
│   │   └── App.jsx                # Router, auth gate, and layout composition
│   └── package.json
│
└── README.md                      # Comprehensive project documentation
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version `18.x` or `>=20.x` recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go app](https://expo.dev/go) (on your iOS/Android device) or Android Studio / Xcode Simulator
- A [Supabase](https://supabase.com/) project account

---

### 1. Backend & Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com/).
2. In the **SQL Editor**, execute the table creation queries for `hymns` and `categories`.
3. In **Storage**, create a public or authenticated bucket named `hymn-audio` for storing audio tracks.
4. Retrieve your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from **Project Settings > API**.

---

### 2. Mobile App Setup

Navigate to the `mobile` directory and install dependencies:

```bash
cd mobile
npm install
```

#### Configure Supabase:
Ensure `mobile/src/config/supabase.js` contains your Supabase credentials or environment configuration:
```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://<your-project-ref>.supabase.co";
const SUPABASE_ANON_KEY = "<your-anon-key>";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

#### Run the Mobile App:
```bash
# Start Expo development server
npx expo start

# Run on Android emulator / device
npm run android

# Run on iOS simulator
npm run ios

# Run web preview
npm run web
```
Scan the QR code displayed in your terminal with the **Expo Go** app on your physical mobile device.

---

### 3. Web Admin Setup

Navigate to the `web` directory and install dependencies:

```bash
cd web
npm install
```

#### Configure Environment Variables:
Create a `.env` file in the `web` directory:
```env
REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

#### Run the Web Admin Portal:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

### Web (`web/.env`)
| Variable | Description |
| :--- | :--- |
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase public anonymous API key |

### Mobile (`mobile/src/config/supabase.js`)
Configured directly or via Expo Constants / `.env`.

---

## 💡 Key Workflows & Capabilities

### 📽 Live Sanctuary Presenter (Projector Mode)
1. In the Web Admin, click **Presenter Mode** in the top navigation bar or navigate to `/presenter`.
2. Select any hymn from the live search drawer or jump list.
3. Use **Arrow Right / Left** or **Spacebar** to advance through verses.
4. Switch language presentation between **English**, **Twi**, or **Dual-Column**.
5. Toggle between **Stage Black**, **Cathedral Blue**, and **High Contrast** for optimal projection clarity.

### 🎵 Audio Streaming & Downloading (Mobile)
1. Open any hymn that has an audio track assigned.
2. Tap the **Play** button on the bottom bar or detail screen to start streaming.
3. Tap the **Download** button to cache the `.mp3` locally. The track will subsequently play from the device filesystem with zero data usage.
4. Manage and clear cached audio files under **My Library > Downloads** or **Settings**.

### 🔄 Data Import & Backup
1. Go to **Database Backup & Import** (`/import-export`) in the Web Admin.
2. Click **Export Full JSON Backup** to download an archival snapshot of all hymns and categories.
3. Upload CSV spreadsheets or JSON files to batch import or update hymns.

---

## 📜 Available Scripts

### Mobile (`mobile/`)
- `npm start`: Starts the Expo development server.
- `npm run android`: Boots the app on an Android device/emulator.
- `npm run ios`: Boots the app on an iOS simulator.
- `npm run web`: Runs the web version of the Expo app.
- `npm run lint`: Runs ESLint validation.

### Web (`web/`)
- `npm start`: Starts the React development server at `localhost:3000`.
- `npm run build`: Bundles the React application for production deployment.
- `npm test`: Runs test suites with Jest and React Testing Library.

---

## 🤝 Contributing & Maintenance

1. **Fork & Branch**: Create feature branches with descriptive names (e.g. `feat/audio-playback-speed`, `fix/twi-orthography`).
2. **Code Style**: Ensure clean, readable code following standard React and React Native conventions.
3. **Testing**: Validate changes across both mobile (iOS/Android) and web presenter screens.
4. **Pull Requests**: Submit PRs with a clear explanation of changes and test results.

---

## 📄 License

This project is developed for the **Presbyterian Church of Ghana (PCG)**. All hymn texts, liturgies, and church resources remain the intellectual property of their respective holders and the Presbyterian Church of Ghana.
