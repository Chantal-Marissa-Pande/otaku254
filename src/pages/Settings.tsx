import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

type Theme = "dark" | "light" | "system";

interface ContentPreferences {
  anime: boolean;
  manga: boolean;
  kpop: boolean;
  merch: boolean;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);

  const [theme, setTheme] =
    useState<Theme>("dark");

  const [preferences, setPreferences] =
    useState<ContentPreferences>({
      anime: true,
      manga: true,
      kpop: true,
      merch: true,
    });

  const [loading, setLoading] =
    useState(true);

  /*
   * Load user settings
   */
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          setUser(currentUser);

          if (!currentUser) {
            setLoading(false);
            return;
          }

          try {
            const userRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const snapshot =
              await getDoc(userRef);

            if (snapshot.exists()) {
              const data =
                snapshot.data();

              setTheme(
                (data.theme as Theme) ||
                  "dark"
              );

              setPreferences({
                anime:
                  data.contentPreferences
                    ?.anime ?? true,

                manga:
                  data.contentPreferences
                    ?.manga ?? true,

                kpop:
                  data.contentPreferences
                    ?.kpop ?? true,

                merch:
                  data.contentPreferences
                    ?.merch ?? true,
              });
            }
          } catch (error) {
            console.error(
              "Error loading settings:",
              error
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return unsubscribe;
  }, []);

  /*
   * Apply theme immediately
   */
  useEffect(() => {
    const root =
      document.documentElement;

    let actualTheme:
      | "dark"
      | "light";

    if (theme === "system") {
      actualTheme =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light";
    } else {
      actualTheme = theme;
    }

    root.setAttribute(
      "data-theme",
      actualTheme
    );
  }, [theme]);

  /*
   * Save theme immediately
   */
  const handleThemeChange = async (
    newTheme: Theme
  ) => {
    setTheme(newTheme);

    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          theme: newTheme,
        },
        {
          merge: true,
        }
      );
    } catch (error) {
      console.error(
        "Error saving theme:",
        error
      );
    }
  };

  /*
   * Save content preference immediately
   */
  const handlePreferenceChange = async (
    preference: keyof ContentPreferences
  ) => {
    const newValue =
      !preferences[preference];

    const updatedPreferences = {
      ...preferences,
      [preference]: newValue,
    };

    setPreferences(
      updatedPreferences
    );

    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          contentPreferences:
            updatedPreferences,
        },
        {
          merge: true,
        }
      );
    } catch (error) {
      console.error(
        "Error saving content preference:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400">
          Loading settings...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Settings
          </h1>

          <p className="text-gray-400">
            Please log in to manage your
            settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        px-4
        py-10
      "
    >
      {/* IMPORTANT:
          max-w-4xl controls the overall card width.
      */}
      <div
        className="
          max-w-4xl
          mx-auto
        "
      >

        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Settings
          </h1>

          <p
            className="
              mt-2
              text-gray-400
            "
          >
            Personalize your Otaku254
            experience.
          </p>
        </div>

        {/* APPEARANCE CARD */}
        <section
          className="
            rounded-2xl
            border
            border-gray-300
            dark:border-gray-800
            bg-white
            dark:bg-[#171725]
            p-6
            md:p-7
            mb-6
            shadow-sm
          "
        >
          <h2
            className="
              text-2xl
              font-semibold
              mb-2
            "
          >
            Appearance
          </h2>

          <p
            className="
              text-gray-600
              dark:text-gray-400
              mb-6
            "
          >
            Choose how Otaku254 looks
            for you.
          </p>

          {/* DARK */}
          <label
            className="
              flex
              items-start
              gap-4
              p-3
              rounded-xl
              cursor-pointer
              hover:bg-gray-100
              dark:hover:bg-white/5
              transition
            "
          >
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={
                theme === "dark"
              }
              onChange={() =>
                handleThemeChange(
                  "dark"
                )
              }
              className="
                mt-1
                h-5
                w-5
                accent-purple-600
              "
            />

            <div>
              <p className="font-semibold">
                Dark
              </p>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  mt-1
                "
              >
                Use the dark Otaku254
                theme.
              </p>
            </div>
          </label>

          {/* LIGHT */}
          <label
            className="
              flex
              items-start
              gap-4
              p-3
              rounded-xl
              cursor-pointer
              hover:bg-gray-100
              dark:hover:bg-white/5
              transition
            "
          >
            <input
              type="radio"
              name="theme"
              value="light"
              checked={
                theme === "light"
              }
              onChange={() =>
                handleThemeChange(
                  "light"
                )
              }
              className="
                mt-1
                h-5
                w-5
                accent-purple-600
              "
            />

            <div>
              <p className="font-semibold">
                Light
              </p>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  mt-1
                "
              >
                Use the light Otaku254
                theme.
              </p>
            </div>
          </label>

          {/* SYSTEM */}
          <label
            className="
              flex
              items-start
              gap-4
              p-3
              rounded-xl
              cursor-pointer
              hover:bg-gray-100
              dark:hover:bg-white/5
              transition
            "
          >
            <input
              type="radio"
              name="theme"
              value="system"
              checked={
                theme === "system"
              }
              onChange={() =>
                handleThemeChange(
                  "system"
                )
              }
              className="
                mt-1
                h-5
                w-5
                accent-purple-600
              "
            />

            <div>
              <p className="font-semibold">
                Use system preference
              </p>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  mt-1
                "
              >
                Follow your device's
                theme.
              </p>
            </div>
          </label>
        </section>

        {/* CONTENT PREFERENCES CARD */}
        <section
          className="
            rounded-2xl
            border
            border-gray-300
            dark:border-gray-800
            bg-white
            dark:bg-[#171725]
            p-6
            md:p-7
            mb-8
            shadow-sm
          "
        >
          <h2
            className="
              text-2xl
              font-semibold
              mb-2
            "
          >
            Content Preferences
          </h2>

          <p
            className="
              text-gray-600
              dark:text-gray-400
              mb-6
            "
          >
            Choose the content you are
            most interested in. Your
            preferences are saved
            automatically.
          </p>

          {/* ANIME */}
          <PreferenceRow
            title="Anime"
            description="Show anime content and recommendations."
            checked={preferences.anime}
            onChange={() =>
              handlePreferenceChange(
                "anime"
              )
            }
          />

          {/* MANGA */}
          <PreferenceRow
            title="Manga"
            description="Show manga content and recommendations."
            checked={preferences.manga}
            onChange={() =>
              handlePreferenceChange(
                "manga"
              )
            }
          />

          {/* K-POP */}
          <PreferenceRow
            title="K-pop"
            description="Show K-pop content and recommendations."
            checked={preferences.kpop}
            onChange={() =>
              handlePreferenceChange(
                "kpop"
              )
            }
          />

          {/* MERCH */}
          <PreferenceRow
            title="Merch"
            description="Show merchandise and shopping-related content."
            checked={preferences.merch}
            onChange={() =>
              handlePreferenceChange(
                "merch"
              )
            }
          />
        </section>
      </div>
    </div>
  );
}

/*
 * Reusable preference row
 */
interface PreferenceRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: PreferenceRowProps) {
  return (
    <label
      className="
        flex
        items-center
        justify-between
        gap-6
        py-4
        px-3
        rounded-xl
        cursor-pointer
        hover:bg-gray-100
        dark:hover:bg-white/5
        transition
      "
    >
      <div className="min-w-0">
        <p className="font-semibold">
          {title}
        </p>

        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
            mt-1
          "
        >
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="
          h-5
          w-5
          shrink-0
          accent-purple-600
          cursor-pointer
        "
      />
    </label>
  );
}