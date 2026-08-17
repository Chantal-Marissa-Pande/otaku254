# Otaku254

Otaku254 is an anime, manga and K-pop media platform with Firestore-powered articles, Firebase-protected publishing and an Otaku AI chat assistant.

## Run locally

1. Copy `.env.example` to `.env` and add the Firebase web app values from your Firebase project.
2. In Firebase, enable Email/Password authentication and create a Firestore database. Add a user in Authentication - that account can access `/admin`.
3. Copy `backend/.env.example` to `backend/.env` and add `GROQ_API_KEY` and `TAVILY_API_KEY`. Tavily returns a maximum of three search results and Groq writes a grounded answer from that evidence.
4. In one terminal, start the API from the project root with `npm run dev:backend`.
5. In a second terminal, start the website with `npm run dev`.

The browser app uses `http://localhost:5000` for the API by default. Both services must be running locally for Otaku AI to work. Set `VITE_API_URL` to the public backend address when deploying.

## Content model

Posts are stored in the `posts` Firestore collection. The admin dashboard writes the following fields: title, category, description, content, image URL, author, tags, read time, featured flag and creation time.

## Deployment checklist

- Add all Firebase variables to the frontend host.
- Add `GROQ_API_KEY` to the backend host only - never expose it as a `VITE_` variable.
- The chatbot uses Tavily basic search plus `openai/gpt-oss-120b` on Groq. Keep both API keys on the backend only.
- Set `VITE_API_URL` to the deployed backend HTTPS URL.
- Restrict Firestore rules so only authenticated admin users can create or edit posts.

## Android application

The web interface is mobile-responsive and a Capacitor configuration is included for an Android application with package ID `com.otaku254.app`.

After Capacitor dependencies are installed, create and synchronize the native project:

```bash
npm install @capacitor/core @capacitor/android
npm install --save-dev @capacitor/cli
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Android Studio can then run the app on an emulator or connected device and produce signed AAB/APK releases. Set `VITE_API_URL` to the backend's public HTTPS address before building: `localhost` on a physical Android device points to the device itself, not the development computer.

For Firebase Authentication, add the Android app package `com.otaku254.app` in Firebase and register the release SHA fingerprints before publishing.
