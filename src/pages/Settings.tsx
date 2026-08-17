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

interface ContentPreferences {
  anime: boolean;
  manga: boolean;
  kpop: boolean;
  merch: boolean;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [preferences, setPreferences] =
    useState<ContentPreferences>({
      anime: true,
      manga: true,
      kpop: true,
      merch: true,
    });

  /*
   * Load authenticated user and their saved settings.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
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

          const snapshot = await getDoc(userRef);

          if (snapshot.exists()) {
            const data = snapshot.data();

            const savedPreferences =
              data.contentPreferences || {};

            setPreferences({
              anime:
                savedPreferences.anime ?? true,

              manga:
                savedPreferences.manga ?? true,

              kpop:
                savedPreferences.kpop ?? true,

              merch:
                savedPreferences.merch ?? true,
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

    return () => unsubscribe();
  }, []);

  /*
   * Save content preferences immediately.
   */
  const handlePreferenceChange = async (
    preference: keyof ContentPreferences
  ) => {
    const updatedPreferences = {
      ...preferences,
      [preference]:
        !preferences[preference],
    };

    setPreferences(updatedPreferences);

    if (!user) {
      return;
    }

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
        "Error saving content preferences:",
        error
      );
    }
  };

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <main className="theme-page min-h-[70vh] flex items-center justify-center px-6">
        <div className="theme-card rounded-2xl border p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />

          <p className="theme-muted">
            Loading settings...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Not logged in.
   */
  if (!user) {
    return (
      <main className="theme-page min-h-[70vh] flex items-center justify-center px-6">
        <div className="theme-card max-w-md rounded-2xl border p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-2xl">
            ⚙️
          </div>

          <h1 className="theme-heading text-3xl font-bold mb-3">
            Settings
          </h1>

          <p className="theme-muted leading-relaxed">
            Please log in to manage your
            Otaku254 preferences.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="theme-page min-h-screen px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <header className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-500">
            <span>⚙️</span>
            Personalization
          </div>

          <h1 className="theme-heading text-4xl md:text-5xl font-bold tracking-tight">
            Settings
          </h1>

          <p className="theme-muted mt-3 max-w-2xl text-base md:text-lg leading-relaxed">
            Choose the fandoms you want to see more often and shape your Otaku254 experience.
          </p>
        </header>

        <div className="space-y-6">

          <aside className="theme-gradient-card flex items-center gap-4 rounded-2xl border p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xl">◐</div>
            <div><h2 className="theme-heading font-bold">Display mode</h2><p className="theme-muted mt-1 text-sm">Use the sun and moon toggle in the navigation bar to switch between light and dark mode.</p></div>
          </aside>

          {/* CONTENT PREFERENCES */}
          <section className="theme-card rounded-3xl border p-6 md:p-8 shadow-sm">

            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-500/10 text-2xl">
                ✨
              </div>

              <div>
                <h2 className="theme-heading text-2xl font-bold">
                  Your fandoms
                </h2>

                <p className="theme-muted mt-1 max-w-2xl">
                  Select the topics that matter to you. These choices are saved automatically.
                </p>
              </div>
            </div>

            <div className="space-y-2">

              <PreferenceRow
                title="Anime"
                description="Show anime content and recommendations."
                icon="🎌"
                checked={preferences.anime}
                onChange={() =>
                  handlePreferenceChange("anime")
                }
              />

              <PreferenceRow
                title="Manga"
                description="Show manga content and recommendations."
                icon="📚"
                checked={preferences.manga}
                onChange={() =>
                  handlePreferenceChange("manga")
                }
              />

              <PreferenceRow
                title="K-pop"
                description="Show K-pop content and recommendations."
                icon="🎵"
                checked={preferences.kpop}
                onChange={() =>
                  handlePreferenceChange("kpop")
                }
              />

              <PreferenceRow
                title="Merch"
                description="Show merchandise and shopping-related content."
                icon="🛍️"
                checked={preferences.merch}
                onChange={() =>
                  handlePreferenceChange("merch")
                }
              />

            </div>
          </section>

          {/* SAVING INFORMATION */}
          <div className="flex items-center justify-center gap-2 py-2 text-sm theme-muted">
            <span className="text-green-500">✓</span>
            Changes are saved automatically.
          </div>

        </div>
      </div>
    </main>
  );
}


/*
 * CONTENT PREFERENCE ROW
 */
interface PreferenceRowProps {
  title: string;
  description: string;
  icon: string;
  checked: boolean;
  onChange: () => void;
}

function PreferenceRow({
  title,
  description,
  icon,
  checked,
  onChange,
}: PreferenceRowProps) {
  return (
    <label
      className="
        theme-option
        flex
        items-center
        gap-4
        rounded-2xl
        border
        p-4
        md:p-5
        cursor-pointer
        transition-all
        duration-200
      "
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-lg">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="theme-heading font-semibold">
          {title}
        </p>

        <p className="theme-muted mt-1 text-sm">
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
          cursor-pointer
          accent-purple-600
        "
      />
    </label>
  );
}
