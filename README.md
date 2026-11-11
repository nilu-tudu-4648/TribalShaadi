# TribalShaadi

Matrimony app for tribal communities, built with React Native 0.80.1 (Android in production).

> The full step-by-step handover guide is in [`docs/TribalShaadi_Developer_Handover.docx`](docs/TribalShaadi_Developer_Handover.docx). This README is the short version.

## Tech stack

| Area | Technology |
|---|---|
| Framework | React Native 0.80.1, React 19.1, TypeScript (mixed .tsx / .js) |
| Engine | Hermes on, New Architecture **off** |
| Navigation | React Navigation 7 (native stack + bottom tabs) |
| State | Redux Toolkit + custom API middleware (axios) |
| UI | Reanimated 3, Gesture Handler 2, @gorhom/bottom-sheet 5 |
| Payments | Razorpay |
| Notifications | Firebase Cloud Messaging + react-native-push-notification |
| Chat | socket.io-client |
| Analytics | PostHog, Facebook SDK |
| Package manager | **pnpm 12** (pinned in `package.json`) |

## Prerequisites

- Node.js 22 (`nvm install 22`)
- pnpm 12: `corepack enable && corepack prepare pnpm@12.15.0 --activate`
- Watchman: `brew install watchman`
- JDK 17 (Azul Zulu 17)
- Android Studio with SDK Platform 36, Build-Tools 35.0.0, NDK 27.1.12297006, CMake
- `ANDROID_HOME` and `JAVA_HOME` set in your shell profile

## Setup

```sh
git clone https://github.com/nilu-tudu-4648/TribalShaadi.git
cd TribalShaadi
git checkout prod
pnpm install
```

Use **pnpm only**. Do not use npm or yarn.

- `pnpm-workspace.yaml` sets `nodeLinker: hoisted`. React Native needs a flat `node_modules`; without it, Android fails with *"Included build …/@react-native/gradle-plugin does not exist"*.
- The same file sets `allowBuilds` to skip the unneeded install scripts of `@firebase/util` and `protobufjs`.

### Files not in Git (get them from the project owner)

| File | Location |
|---|---|
| Release keystore | `android/app/tribalshaadi-release.keystore` |
| Signing config (passwords) | `android/keystore.properties` (copy from `android/keystore.properties.template`) |

Without these, release builds are silently signed with the debug key and the Play Store will reject them.

## Run in development

```sh
pnpm start          # Metro (add --reset-cache if JS looks stale)
pnpm android        # build and install the debug app
```

### API environment

Set in `src/constants/functions.js`:

```js
export const apiUrl = 'https://api.tribalshaadi.co.in';      // production
// export const apiUrl = 'https://devapi.tribalshaadi.co.in'; // development
```

Switch back to production before building a release.

## Project structure

```
App.tsx                  Providers, auth bootstrapping, root navigator
src/navigation/          Bottom tabs, inner stack, navigation ref
src/screen/              One file per screen
src/components/          Shared UI, BottomSheets/, PremiumGateOverlay, svg/
src/constants/           functions.js (API URLs + helpers), data.js (ROUTES), colors, fonts, sizes
src/store/               Redux slices (auth, user, payment, chat) + apiMiddleware
src/notification/        FCM setup and handlers
```

## How API calls work

Dispatch `apiCallBegan` with a relative URL. The middleware adds the base URL and the `Bearer` token from AsyncStorage, then dispatches `onSuccess` / `onError`. A 401 logs the user out. Responses always carry data in `recordList`.

```js
export const getFooApi = url =>
  apiCallBegan({ method: 'get', url, onSuccess: setFoo.type });
```

Only pass `onStart` if your success reducer also sets `loader = false`; otherwise the full-screen loader never goes away.

## Main flows

- **Login:** phone number → OTP → token saved in AsyncStorage → onboarding wizard or Home.
- **Home:** swipe matches with **Skip** (`passUser`) and **Send Interest** (`sendProposal`, needs selfie verification).
- **Daily free limit:** `app/notsubscribeProfileCount/getDailyLimitStatus`. The card shows `remainingToday/dailyLimit` Free Profiles (resets at midnight). When `canPerformAction` is false, Skip and Send Interest open the upgrade sheet.
- **Upgrade:** packages from `admin/package/getpackage` (equal-size cards, the selected one is yellow, shows `plan_benefits`). Benefit points and image come from `admin/premiumBenefits/getPremiumBenefits`. Payment: Razorpay order → checkout → `insertPayment` → `savePremiumAccount`.
- **Preference paywall:** every preference sheet opens. Admin switches decide whether editing is paid:
  - `admin/preferences/getPreference` controls Marital Status, Age, Religion, Height
  - `admin/secondaryPreferences/getSecondaryPreference` controls Tribe, Location, Job type, Settle Down

  `isActive: true` = paid, `false` = free. Users without access are sent to Upgrade on any touch (`PremiumGateOverlay`).
- **Access rule:** a user with an active package, or any female user, is treated as premium.

## Release (Android)

1. Point `apiUrl` at production.
2. Bump `versionCode` (must increase) and `versionName` in `android/app/build.gradle`.
3. Build:

```sh
cd android
./gradlew bundleRelease    # AAB for Play Store
./gradlew assembleRelease  # APK for testing
```

Outputs: `android/app/build/outputs/bundle/release/app-release.aab` and `android/app/build/outputs/apk/release/app-release.apk`.

## Troubleshooting

| Problem | Fix |
|---|---|
| `ERR_PNPM_OTHER_PM_EXPECTED` | Use pnpm 12; `packageManager` in `package.json` must say pnpm |
| `@react-native/gradle-plugin does not exist` | `nodeLinker: hoisted` missing from `pnpm-workspace.yaml`; delete `node_modules` and reinstall |
| `ERR_PNPM_IGNORED_BUILDS` | Add the package to `allowBuilds` in `pnpm-workspace.yaml` |
| Stale JS / red screen | `pnpm start --reset-cache` |
| Native build errors | `cd android && ./gradlew clean` |
| Users edit preferences without paying | Admin switches return `isActive: false`; set them to `true` |

## Known gaps

- iOS is not set up for release (template bundle ID, no `GoogleService-Info.plist`, Razorpay/Facebook iOS setup missing).
- The API environment is switched by editing code.
- `package-lock.json` is left over from npm and can be deleted.
- Very few tests.
