import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

import Home from "./pages/Home";
import Anime from "./pages/Anime";
import Manga from "./pages/Manga";
import Kpop from "./pages/Kpop";
import Merch from "./pages/Merch";
import About from "./pages/About";
import PostPage from "./pages/PostPage";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

import { auth, db } from "./firebase";

type Theme = "dark" | "light" | "system";

/*
 * Apply the user's selected theme.
 */
function applyUserTheme(theme: Theme) {
  const root = document.documentElement;

  let actualTheme: "dark" | "light";

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    actualTheme = prefersDark ? "dark" : "light";
  } else {
    actualTheme = theme;
  }

  /*
   * Store the actual theme being displayed.
   */
  root.setAttribute(
    "data-theme",
    actualTheme
  );

  /*
   * Store the user's selected option.
   */
  root.setAttribute(
    "data-theme-choice",
    theme
  );

  /*
   * IMPORTANT:
   *
   * Tailwind's dark: classes depend on
   * the "dark" class being present on <html>.
   *
   * Without this, classes such as:
   *
   * dark:bg-[#171725]
   * dark:text-white
   * dark:border-gray-800
   *
   * will not activate.
   */
  root.classList.toggle(
    "dark",
    actualTheme === "dark"
  );
}

export default function App() {
  const location = useLocation();

  /*
   * Load saved theme whenever
   * authentication changes.
   */
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          /*
           * Not logged in:
           * use dark mode by default.
           */
          if (!user) {
            applyUserTheme("dark");
            return;
          }

          try {
            const userRef = doc(
              db,
              "users",
              user.uid
            );

            const userSnapshot =
              await getDoc(userRef);

            if (userSnapshot.exists()) {
              const data =
                userSnapshot.data();

              const savedTheme =
                (data.theme as Theme) ??
                "dark";

              applyUserTheme(
                savedTheme
              );
            } else {
              applyUserTheme("dark");
            }
          } catch (error) {
            console.error(
              "Error loading user theme:",
              error
            );

            applyUserTheme("dark");
          }
        }
      );

    return () => unsubscribe();
  }, []);

  /*
   * Listen for operating system
   * theme changes.
   *
   * This only affects users who
   * selected "system".
   */
  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemThemeChange =
      () => {
        const selectedTheme =
          document.documentElement.getAttribute(
            "data-theme-choice"
          );

        if (
          selectedTheme !== "system"
        ) {
          return;
        }

        const actualTheme =
          mediaQuery.matches
            ? "dark"
            : "light";

        document.documentElement.setAttribute(
          "data-theme",
          actualTheme
        );

        /*
         * Keep Tailwind's dark variant
         * synchronized as well.
         */
        document.documentElement.classList.toggle(
          "dark",
          actualTheme === "dark"
        );
      };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, []);

  /*
   * Hide chatbot on authentication pages.
   */
  const hideChatbot =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="otaku-app flex flex-col min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-[#0f0f1a] dark:text-white">

      <Navbar />

      <main className="flex-grow">
        <Routes>

          {/* PUBLIC PAGES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/anime"
            element={<Anime />}
          />

          <Route
            path="/manga"
            element={<Manga />}
          />

          <Route
            path="/kpop"
            element={<Kpop />}
          />

          <Route
            path="/merch"
            element={<Merch />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/post/:id"
            element={<PostPage />}
          />

          <Route
            path="/community"
            element={<Community />}
          />

          {/* AUTHENTICATION */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* USER PAGES */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* ADMIN */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>

      {!hideChatbot && (
        <Chatbot />
      )}

      <Footer />

    </div>
  );
}