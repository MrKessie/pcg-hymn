# 💻 PCG Hymnal Web Admin & Presenter Portal

Administrative Content Management System (CMS) and Live Sunday Service Projection Portal for the **Presbyterian Church of Ghana Hymnal**, built with React 19.

---

## 🚀 Key Features

- **Hymns CMS**: Create, update, publish, and format bilingual hymn texts (English and Twi) with tune metadata, scripture references, and sol-fa notes.
- **Live Service Presenter Mode (`/presenter`)**:
  - Fullscreen sanctuary projector view with keyboard navigation (Arrow keys / Spacebar).
  - Bilingual dual-column display or single language mode.
  - Stage Black, Cathedral Blue, Dark, and Light projection themes.
  - Scalable font sizes.
- **Audio & Media Hub (`/media`)**: Manage MP3 tracks and link external or Supabase Storage audio files.
- **Categories & Church Seasons (`/categories`, `/collections`)**: Organize hymns by liturgical themes and season sets.
- **Liturgies & Creeds Manager (`/liturgies`)**: Maintain official PCG liturgy texts and confessional creeds.
- **Bulk Import & Export (`/import-export`)**:
  - Export full JSON database backups.
  - Import CSV and JSON files with schema validation.
- **User & Role Management (`/users`)**: Manage team accounts and administrative permissions via Supabase Auth.

---

## 🛠 Tech Stack

- **Framework**: React 19 / Create React App
- **Routing**: React Router DOM v7
- **Database / Backend**: Supabase JS Client v2
- **UI / Styling**: Vanilla CSS, SweetAlert2, FontAwesome, and Custom SVG Icons

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `web` root directory:
```env
REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Run Locally
```bash
# Start development server on port 3000
npm start

# Build for production
npm run build
```

---

## 📂 Directory Structure

- `src/components/`: Shared components (`Sidebar`, `Navbar`, `HymnFormDrawer`, `HymnDetailDrawer`)
- `src/config/`: Supabase client and SVG icon configurations
- `src/data/`: Built-in liturgy and church season dataset presets
- `src/pages/`: Admin pages (`DashboardPage`, `HymnsPage`, `CategoriesPage`, `PresenterPage`, `MediaPage`, `ImportExportPage`, `UsersPage`, etc.)
- `src/App.css`: Design system and layout styles
