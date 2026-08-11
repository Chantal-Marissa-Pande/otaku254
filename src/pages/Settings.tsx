import { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("purple");

  const [anime, setAnime] = useState(true);
  const [manga, setManga] = useState(true);
  const [kpop, setKpop] = useState(true);

  const [communityNotifications, setCommunityNotifications] =
    useState(true);

  const [articleNotifications, setArticleNotifications] =
    useState(true);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-2">
        Settings
      </h1>

      <p className="text-gray-400 mb-8">
        Personalize your Otaku254 experience.
      </p>

      <div className="space-y-6">

        {/* APPEARANCE */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-2">
            Appearance
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Choose how Otaku254 looks for you.
          </p>

          <div className="space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
              />

              <span>Dark</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
              />

              <span>Light</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={() => setTheme("system")}
              />

              <span>Use system preference</span>
            </label>

          </div>

        </section>

        {/* ACCENT COLOR */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-2">
            Accent Colour
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Choose your preferred accent colour.
          </p>

          <select
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-full md:w-64 p-3 rounded-lg bg-black border border-white/20"
          >
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
            <option value="pink">Pink</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>

        </section>

        {/* CONTENT PREFERENCES */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-2">
            Content Preferences
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Choose the content you are most interested in.
          </p>

          <div className="space-y-4">

            <label className="flex items-center justify-between">
              <span>Anime</span>

              <input
                type="checkbox"
                checked={anime}
                onChange={(e) => setAnime(e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Manga</span>

              <input
                type="checkbox"
                checked={manga}
                onChange={(e) => setManga(e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between">
              <span>K-pop</span>

              <input
                type="checkbox"
                checked={kpop}
                onChange={(e) => setKpop(e.target.checked)}
              />
            </label>

          </div>

        </section>

        {/* NOTIFICATIONS */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-2">
            Notifications
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Control the notifications you receive.
          </p>

          <div className="space-y-4">

            <label className="flex items-center justify-between">
              <span>Community notifications</span>

              <input
                type="checkbox"
                checked={communityNotifications}
                onChange={(e) =>
                  setCommunityNotifications(e.target.checked)
                }
              />
            </label>

            <label className="flex items-center justify-between">
              <span>New article notifications</span>

              <input
                type="checkbox"
                checked={articleNotifications}
                onChange={(e) =>
                  setArticleNotifications(e.target.checked)
                }
              />
            </label>

          </div>

        </section>

        {/* SAVE */}
        <button
          onClick={() => alert("Settings saved!")}
          className="w-full bg-purple-600 hover:bg-purple-700 transition px-5 py-3 rounded-xl font-semibold"
        >
          Save Settings
        </button>

      </div>

    </div>
  );
}