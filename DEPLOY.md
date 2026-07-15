# BLNTLY — Deployment & App Store Guide

This guide takes you from local code to live at `blntly.app` with native iOS and Android apps in the stores.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 22.13 | https://nodejs.org |
| npm | ≥ 10 | bundled with Node |
| Wrangler CLI | 4.x | `npm i -g wrangler` |
| Git | any | https://git-scm.com |
| Xcode | ≥ 16 | Mac App Store (iOS only) |
| Android Studio | latest | https://developer.android.com/studio (Android only) |

---

## Step 1 — GitHub Repository

1. Create a new private GitHub repo at https://github.com/new  
   Name it `blntly` (or `blntly-app`).

2. Push this project:
   ```bash
   git init
   git add .
   git commit -m "chore: initial BLNTLY project"
   git remote add origin https://github.com/YOUR_USERNAME/blntly.git
   git push -u origin main
   ```

3. In GitHub repo → **Settings → Secrets and variables → Actions**, add all secrets listed in Step 4.

---

## Step 2 — Cloudflare Setup

### 2a. Create a Cloudflare Account
Sign up at https://cloudflare.com (free plan works for development).

### 2b. Register or Transfer `blntly.app`
- Register `blntly.app` at https://domains.cloudflare.com ($10–15/yr)
- If already registered elsewhere, change nameservers to Cloudflare's  
  (Cloudflare shows you the exact nameservers after you add the domain)

### 2c. Create a D1 Database
```bash
wrangler login
wrangler d1 create blntly-db
```
Copy the database ID it prints. Open `wrangler.toml` and paste it:
```toml
[[d1_databases]]
database_id = "PASTE_ID_HERE"
```

### 2d. Get Your API Token and Account ID
- **API Token**: Cloudflare dashboard → My Profile → API Tokens  
  → Create Token → use "Edit Cloudflare Workers" template  
  → Add permission: Zone / Cache Purge  
  → Zone Resources: include `blntly.app`
- **Account ID**: Cloudflare dashboard → right sidebar when any domain is selected
- **Zone ID**: Cloudflare dashboard → select `blntly.app` → right sidebar

---

## Step 3 — Local Development

```bash
npm ci
cp .env.example .env.local
# Fill in .env.local with provider keys (see .env.example comments)
npm run dev
```

The dev server starts at http://localhost:3000 with Cloudflare Workers runtime emulation.

---

## Step 4 — GitHub Actions Secrets

Add these in GitHub → Settings → Secrets and variables → Actions:

### Cloudflare (required for web deploy)
| Secret | Where to find it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Step 2d |
| `CLOUDFLARE_ACCOUNT_ID` | Step 2d |
| `CLOUDFLARE_ZONE_ID` | Step 2d |

### iOS App Store (required for iOS build)
| Secret | How to get it |
|---|---|
| `IOS_DISTRIBUTION_CERT_BASE64` | Export Distribution cert from Keychain, base64 encode: `base64 -i cert.p12` |
| `IOS_CERT_PASSWORD` | The p12 export password you set |
| `IOS_PROVISIONING_PROFILE_BASE64` | Download from developer.apple.com, base64 encode |
| `ASC_KEY_ID` | App Store Connect → Users & Access → Keys → + → Key ID |
| `ASC_ISSUER_ID` | Same page as Key ID — Issuer ID at the top |
| `ASC_PRIVATE_KEY` | Download the .p8 file, paste its full contents |
| `APPLE_TEAM_ID` | developer.apple.com → Account → Team ID (top right) |

### Android Google Play (required for Android build)
| Secret | How to get it |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `keytool -genkey -v -keystore blntly.keystore -alias blntly -keyalg RSA -keysize 2048 -validity 10000`, then `base64 blntly.keystore` |
| `ANDROID_KEY_ALIAS` | `blntly` (or whatever alias you used above) |
| `ANDROID_KEYSTORE_PASSWORD` | The password you set when generating |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Google Play Console → Setup → API access → Create service account → download JSON |

---

## Step 5 — First Deploy to Cloudflare Workers

```bash
wrangler login
npm run build
wrangler deploy --env production
```

Then go to Cloudflare dashboard → Workers & Pages → blntly → Settings → Triggers  
→ Add Custom Domain → enter `blntly.app` and `www.blntly.app`

After DNS propagates (~5 min with Cloudflare), `https://blntly.app` is live.

---

## Step 6 — iOS App (Capacitor)

### 6a. Initialize the iOS project (one-time, on a Mac)
```bash
npm ci
npm run build   # or: next build --out-dir out
npx cap add ios
npx cap sync ios
```

### 6b. Open in Xcode
```bash
npm run cap:ios
```

In Xcode:
1. Select the `App` target → **Signing & Capabilities**
2. Set **Team** to your Apple Developer team
3. Set **Bundle Identifier** to `com.blntly.app`
4. Enable **Push Notifications** capability
5. Enable **Background Modes** → check "Background fetch" and "Remote notifications"

### 6c. App Store Connect setup
1. Go to https://appstoreconnect.apple.com
2. My Apps → + → New App
3. Platform: iOS, Name: BLNTLY, Bundle ID: com.blntly.app, SKU: blntly-ios
4. Fill out app information, age rating (17+ for tobacco content), pricing, availability

### 6d. Build & Upload (CI)
Push to `main` branch — the `mobile.yml` workflow builds and uploads to TestFlight automatically.

Or build manually:
```bash
xcodebuild archive \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -archivePath build/BLNTLY.xcarchive \
  -configuration Release
xcodebuild -exportArchive \
  -archivePath build/BLNTLY.xcarchive \
  -exportPath build/ \
  -exportOptionsPlist ios/ExportOptions.plist
```

### 6e. Age Rating
In App Store Connect → App Information → Age Rating:  
Set to **17+** and check "Frequent/Intense Alcohol, Tobacco, or Drug Use or References".

---

## Step 7 — Android App (Capacitor)

### 7a. Initialize the Android project (one-time)
```bash
npx cap add android
npx cap sync android
```

### 7b. Open in Android Studio
```bash
npm run cap:android
```

In Android Studio:
1. File → Project Structure → App → set `applicationId` to `com.blntly.app`
2. Build → Generate Signed Bundle/APK → Android App Bundle  
   (Use the keystore from Step 4 or generate one now)

### 7c. Google Play Console setup
1. Go to https://play.google.com/console
2. Create app → App name: BLNTLY, Default language: English (US)
3. App category: Shopping
4. Content rating: complete the questionnaire  
   (answer Yes to tobacco/nicotine products — this results in a 18+ rating)

### 7d. Build & Upload (CI)
Push to `main` — `mobile.yml` builds the AAB and uploads to internal testing track automatically.

---

## Step 8 — App Store Review Notes

Prepare this text for the App Store / Play Store review team:

> BLNTLY is a regulated on-demand delivery marketplace for adults 21+ only.  
> Users must verify their age at account creation and present a valid government photo ID  
> to the delivery driver at handoff. No unattended drop-offs. Products are sold by  
> licensed retailers and subject to state and local tobacco regulations.  
> 
> Test credentials for review: [create a demo account and add here]

---

## Step 9 — Environment Variables in Production

In Cloudflare dashboard → Workers & Pages → blntly → Settings → Variables:

Add each variable from `.env.example` with real values from your providers:

- `AGE_VERIFICATION_PROVIDER` / `AGE_VERIFICATION_API_KEY` — e.g. Persona, Jumio, Onfido
- `PAYMENT_ADAPTER_PROVIDER` / `PAYMENT_ADAPTER_API_KEY` — high-risk processor approved for tobacco
- `MAPS_PROVIDER` / `MAPS_API_KEY` — Google Maps, Mapbox, or HERE
- `MESSAGING_PROVIDER` / `MESSAGING_API_KEY` — Twilio, Vonage (masked calls + SMS)
- `AI_SUPPORT_PROVIDER` / `AI_SUPPORT_API_KEY` — OpenAI, Anthropic, etc.
- `AUTH_SECRET` — random 32+ byte secret: `openssl rand -hex 32`
- `DATABASE_URL` — Cloudflare D1 (already bound in wrangler.toml) or Turso/Neon for Postgres
- `REDIS_URL` — Upstash or Cloudflare Queues

Mark each as **Encrypted** in the Cloudflare dashboard.

---

## CI/CD Flow Summary

```
git push to main
  └─ deploy.yml
       ├─ lint
       ├─ build (vinext)
       ├─ deploy-production (wrangler → blntly.app)
       └─ purge Cloudflare cache

git push to any branch
  └─ deploy.yml → deploy-staging (staging.blntly.app)

git push to main (also)
  └─ mobile.yml
       ├─ web-build (next build → out/)
       ├─ ios-build → TestFlight upload
       └─ android-build → Play internal track
```

---

## Domain DNS (if not using Cloudflare Registrar)

If `blntly.app` is registered at GoDaddy, Namecheap, etc.:

1. Add nameservers: Change to Cloudflare's assigned nameservers  
   (shown in Cloudflare dashboard when you add the domain under your account)
2. In Cloudflare DNS, Worker Routes handle everything — no A/CNAME records needed.

Or, without moving DNS, add these manual DNS records:
- Type `CNAME`, Name `@`, Value: your Worker's `*.workers.dev` URL  
- Type `CNAME`, Name `www`, Value: same

Then in Cloudflare Workers dashboard → Triggers → add `blntly.app` as a custom domain.

---

## Troubleshooting

**`wrangler deploy` fails: "workers.dev subdomain not found"**  
→ Run `wrangler subdomain create blntly` first.

**iOS build: "No signing certificate found"**  
→ Make sure `IOS_DISTRIBUTION_CERT_BASE64` is the Distribution (not Development) cert.  
→ The provisioning profile must be App Store distribution type.

**Android: "keystore not found"**  
→ Ensure the base64 encoding used `base64 -i blntly.keystore` (no line wrapping).  
→ Set `ANDROID_KEYSTORE_PASSWORD` to match exactly what you used with `keytool`.

**App store review rejected: tobacco content**  
→ Add a clear 21+ age gate (already implemented), include review notes from Step 8,  
→ Set age rating to 17+ (iOS) or 18+ (Android).

**`blntly.app` shows "Error 1101"**  
→ The Worker is deployed but the custom domain isn't verified yet.  
→ Go to Workers → blntly → Triggers and confirm the custom domain is active.
