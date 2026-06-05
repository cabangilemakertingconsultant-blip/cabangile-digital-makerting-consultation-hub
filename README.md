# ⚡ Cabangile Marketing Consultant Hub

> **South Africa's Premier Marketing Consultant Hub** — migrated from Firebase to Supabase.

![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=flat&logo=supabase)
![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-181717?style=flat&logo=github)
![HTML5](https://img.shields.io/badge/HTML5-Static-E34F26?style=flat&logo=html5)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat&logo=bootstrap)

---

## 📁 Project Structure

```
CMC-IDLE/
├── index.html              # Home page
├── about.html              # About Us page
├── services.html           # Services & Pricing
├── portfolio.html          # Portfolio with filter
├── README.md               # This file
└── assets/
    ├── css/
    │   ├── main.css        # Global design system
    │   └── auth.css        # Auth page styles
    └── js/
        ├── supabase.js     # ✅ Supabase client setup (replaces firebase-config.js)
        ├── auth.js         # ✅ Supabase Auth (replaces Firebase Auth)
        └── main.js         # ✅ App logic using Supabase (replaces Firestore calls)
```

> **`assets/js/firebase-config.js`** is kept as a backup reference but is **no longer loaded** by any HTML page. You may safely delete it.

---

## 🔌 Firebase → Supabase Migration Map

| Firebase                              | Supabase Equivalent                          |
|---------------------------------------|----------------------------------------------|
| `firebase.initializeApp(config)`      | `createClient(url, key)`                     |
| `firebase.auth()`                     | `supabase.auth`                              |
| `auth.signInWithEmailAndPassword()`   | `supabase.auth.signInWithPassword()`         |
| `auth.createUserWithEmailAndPassword()` | `supabase.auth.signUp()`                   |
| `auth.signInWithPopup(GoogleProvider)` | `supabase.auth.signInWithOAuth({ provider: 'google' })` |
| `auth.onAuthStateChanged(cb)`         | `supabase.auth.onAuthStateChange(cb)`        |
| `auth.signOut()`                      | `supabase.auth.signOut()`                    |
| `db.collection('x').add(data)`        | `supabase.from('x').insert([data])`          |
| `firebase.firestore.FieldValue.serverTimestamp()` | Supabase uses `now()` column default |
| `measurementId` (Analytics)           | Not required — no Supabase equivalent needed |

---

## 🚀 Setup Instructions

### Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project** and fill in the details.
3. Wait for the project to be ready (~1–2 minutes).

---

### Step 2 — Get Your Project Credentials

In your Supabase dashboard:

1. Go to **Project Settings → API**.
2. Copy the **Project URL** (e.g. `https://abcdefgh.supabase.co`).
3. Copy the **anon / public** key (safe to expose in frontend code).

> ⚠️ **Never use your `service_role` key in frontend code.**

---

### Step 3 — Set Your Credentials in Every HTML File

Find and replace the placeholder meta tags in **every** HTML file:

```html
<!-- BEFORE -->
<meta name="supabase-url" content="https://YOUR_PROJECT_ID.supabase.co" />
<meta name="supabase-key" content="YOUR_ANON_PUBLIC_KEY" />

<!-- AFTER (example) -->
<meta name="supabase-url" content="https://abcdefgh.supabase.co" />
<meta name="supabase-key" content="eyJhbGciOiJIUzI1NiIsInR5cCI6..." />
```

Files to update:
- `index.html`
- `about.html`
- `services.html`
- `portfolio.html`
- Any future pages you add (e.g. `login.html`, `contact.html`)

---

### Step 4 — Create the Supabase Database Tables

In your Supabase dashboard go to **SQL Editor** and run:

```sql
-- Contact form submissions (replaces Firestore "contactSubmissions" collection)
CREATE TABLE contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  service    TEXT,
  message    TEXT,
  status     TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (contact form submissions from the public site)
CREATE POLICY "Allow public inserts"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (admins) can read submissions
CREATE POLICY "Admin reads"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
```

---

### Step 5 — Enable Authentication Providers

In your Supabase dashboard go to **Authentication → Providers**:

#### Email/Password (required)
- Toggle **Email** → **Enable**.
- Optionally enable **Confirm email** (users must click a confirmation link).

#### Google OAuth (optional)
1. Toggle **Google** → **Enable**.
2. Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com).
3. Set the **Authorised redirect URI** to:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
4. Paste the **Client ID** and **Client Secret** into Supabase.

---

### Step 6 — Configure Redirect URLs

In **Authentication → URL Configuration** add your allowed redirect URLs:

```
https://YOUR_GITHUB_USERNAME.github.io/CMC-IDLE/index.html
https://YOUR_GITHUB_USERNAME.github.io/CMC-IDLE/
http://localhost:5500/index.html   (for local dev with Live Server)
http://127.0.0.1:5500/index.html
```

---

### Step 7 — Deploy to GitHub Pages

```bash
# 1. Initialise git (if not already done)
git init
git remote add origin https://github.com/YOUR_USERNAME/CMC-IDLE.git

# 2. Commit all files
git add .
git commit -m "feat: migrate Firebase → Supabase"

# 3. Push to GitHub
git push -u origin main
```

Then in GitHub:
- **Settings → Pages → Source → Deploy from a branch → `main` / `/(root)`**
- Your site will be live at: `https://YOUR_USERNAME.github.io/CMC-IDLE/`

---

## 🔒 Security Notes

| Item | Status |
|------|--------|
| Anon key exposed in HTML meta tags | ✅ Safe — it is a **public** key by design |
| Service role key | ❌ Never put this in frontend code |
| Row Level Security (RLS) | ✅ Enabled on `contact_submissions` |
| Firebase config in `firebase-config.js` | ⚠️ Dead code — no longer loaded; delete it |

---

## 🛠️ Local Development

Open with **VS Code Live Server** (port 5500) or any static server:

```bash
# Python
python -m http.server 5500

# Node
npx serve .
```

> **Important:** ES Modules (`type="module"`) require a real HTTP server — opening `index.html` directly as a `file://` URL will **not** work. Always use a local server.

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Bootstrap 5.3, Vanilla CSS |
| Icons | Bootstrap Icons 1.11 |
| Fonts | Google Fonts — Outfit, Inter |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Database | Supabase (PostgreSQL via REST) |
| Hosting | GitHub Pages (static) |
| CDN | jsDelivr — `@supabase/supabase-js@2` ESM |

---

## 📞 Contact

**Cabangile Marketing Consultant Hub**  
📧 info@cabangile.co.za  
📍 South Africa

---

*© 2025 Cabangile Marketing Consultant Hub. All rights reserved.*
