# Otaku254

Otaku254 is an anime, manga and K-pop media platform with Firestore-powered articles, Firebase-protected publishing and an Otaku AI chat assistant.

## Run locally

1. Copy `.env.example` to `.env` and add the Firebase web app values from your Firebase project.
2. In Firebase, enable Email/Password authentication and create a Firestore database. Add a user in Authentication - that account can access `/admin`.
3. Copy `backend/.env.example` to `backend/.env` and add `OPENAI_API_KEY`.
4. Start the API with `cd backend` then `npm run dev`.
5. Start the website from the project root with `npm run dev`.

The browser app uses `http://localhost:5000` for the API by default. Set `VITE_API_URL` to the public backend address when deploying.

## Content model

Posts are stored in the `posts` Firestore collection. The admin dashboard writes the following fields: title, category, description, content, image URL, author, tags, read time, featured flag and creation time.

## Deployment checklist

- Add all Firebase variables to the frontend host.
- Add `OPENAI_API_KEY` to the backend host only - never expose it as a `VITE_` variable.
- Set `VITE_API_URL` to the deployed backend HTTPS URL.
- Restrict Firestore rules so only authenticated admin users can create or edit posts.
