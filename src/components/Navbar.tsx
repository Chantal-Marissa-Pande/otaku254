import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function Navbar() {
  const [user, setUser] =
    useState<User | null>(null);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") !== "light"
  );

  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Load authenticated user
   */
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          setUser(currentUser);

          if (!currentUser) {
            setIsAdmin(false);
            return;
          }

          try {
            const userDoc =
              await getDoc(
                doc(
                  db,
                  "users",
                  currentUser.uid
                )
              );

            if (userDoc.exists()) {
              const userData =
                userDoc.data();

              setIsAdmin(
                userData.role === "admin"
              );
            } else {
              setIsAdmin(false);
            }
          } catch (error) {
            console.error(
              "Error checking user role:",
              error
            );

            setIsAdmin(false);
          }
        }
      );

    return unsubscribe;
  }, []);

  /*
   * Close dropdowns whenever
   * the user changes page.
   */
  useEffect(() => {
    setIsProfileOpen(false);
    setIsSettingsOpen(false);
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setIsDark(root.getAttribute("data-theme") !== "light");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = async () => {
    const nextTheme = isDark ? "light" : "dark";
    const root = document.documentElement;
    root.setAttribute("data-theme", nextTheme);
    root.setAttribute("data-theme-choice", nextTheme);
    root.classList.toggle("dark", nextTheme === "dark");
    root.style.colorScheme = nextTheme;
    localStorage.setItem("otaku-theme", nextTheme);
    setIsDark(nextTheme === "dark");

    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { theme: nextTheme }, { merge: true });
      } catch (error) {
        console.error("Error saving navbar theme:", error);
      }
    }
  };

  /*
   * Logout
   */
  const logout = async () => {
    try {
      await signOut(auth);

      setIsProfileOpen(false);
      setIsSettingsOpen(false);
      setIsAdmin(false);

      navigate("/");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      alert(
        "Logout failed. Please try again."
      );
    }
  };

  const displayName =
    user?.displayName || "Profile";

  return (
    <nav
      className="
        sticky top-0
        z-50
        border-b
        border-gray-200
        bg-white/95
        text-gray-900
        backdrop-blur
        transition-colors
        duration-300

        dark:border-purple-500/20
        dark:bg-[#0d0d18]/90
        dark:text-white
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-4
          flex
          justify-between
          items-center
        "
      >

        {/* LOGO */}
        <Link
          to="/"
          className="
            text-2xl
            font-bold
            transition-opacity
            hover:opacity-80
          "
        >
          <span className="text-purple-500">
            Otaku
          </span>

          <span className="text-pink-500">
            254
          </span>
        </Link>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 text-2xl md:hidden dark:border-white/10"
          aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileOpen((open) => !open)}
        >
          <span aria-hidden="true">{isMobileOpen ? "×" : "☰"}</span>
        </button>


        {/* MAIN NAVIGATION */}
        <div
          className="
            hidden
            md:flex
            gap-6
            text-sm
            items-center
          "
        >

          <Link
            to="/"
            className="
              text-gray-700
              transition
              hover:text-purple-600

              dark:text-gray-300
              dark:hover:text-purple-400
            "
          >
            Home
          </Link>

          <Link
            to="/anime"
            className="
              text-gray-700
              transition
              hover:text-purple-600

              dark:text-gray-300
              dark:hover:text-purple-400
            "
          >
            Anime
          </Link>

          <Link
            to="/manga"
            className="
              text-gray-700
              transition
              hover:text-purple-600

              dark:text-gray-300
              dark:hover:text-purple-400
            "
          >
            Manga
          </Link>

          <Link
            to="/kpop"
            className="
              text-gray-700
              transition
              hover:text-purple-600

              dark:text-gray-300
              dark:hover:text-purple-400
            "
          >
            K-pop
          </Link>

          <Link
            to="/merch"
            className="
              text-gray-700
              transition
              hover:text-purple-600

              dark:text-gray-300
              dark:hover:text-purple-400
            "
          >
            Merch
          </Link>

          <Link
            to="/about"
            className="
              text-gray-700
              transition
              hover:text-purple-600

              dark:text-gray-300
              dark:hover:text-purple-400
            "
          >
            About
          </Link>

          <Link
            to="/community"
            className="
              text-gray-700
              transition
              hover:text-purple-600

              dark:text-gray-300
              dark:hover:text-purple-400
            "
          >
            Community
          </Link>

          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${isDark ? "light" : "dark"} mode`} aria-pressed={isDark}>
            <span aria-hidden="true">☀</span><span className="theme-toggle-track"><span className="theme-toggle-knob" /></span><span aria-hidden="true">☾</span>
          </button>


          {/* ADMIN */}
          {isAdmin && (
            <Link
              to="/admin"
              className="
                text-purple-600
                transition
                hover:text-purple-700

                dark:text-purple-400
                dark:hover:text-purple-300
              "
            >
              Admin
            </Link>
          )}


          {/* PROFILE */}
          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(
                  !isProfileOpen
                );

                setIsSettingsOpen(false);
              }}
              className="
                flex
                items-center
                gap-2
                text-gray-700
                transition
                hover:text-purple-600

                dark:text-gray-300
                dark:hover:text-purple-400
              "
            >
              <span>👤</span>

              <span className="max-w-[100px] truncate">
                {displayName}
              </span>

              <span className="text-xs">
                ▼
              </span>
            </button>


            {/* PROFILE DROPDOWN */}
            {isProfileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-52
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-900
                  shadow-2xl
                  z-[100]

                  dark:border-white/10
                  dark:bg-[#151522]
                  dark:text-white
                "
              >

                {!user ? (
                  <>
                    <div
                      className="
                        border-b
                        border-gray-200
                        px-4
                        py-3

                        dark:border-white/10
                      "
                    >
                      <p className="font-semibold">
                        Welcome to Otaku254
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500

                          dark:text-gray-400
                        "
                      >
                        Join the community
                      </p>
                    </div>


                    <Link
                      to="/register"
                      className="
                        block
                        px-4
                        py-3
                        transition
                        hover:bg-purple-50
                        hover:text-purple-700

                        dark:hover:bg-purple-600/20
                        dark:hover:text-white
                      "
                    >
                      Create Account
                    </Link>


                    <Link
                      to="/login"
                      className="
                        block
                        px-4
                        py-3
                        transition
                        hover:bg-purple-50
                        hover:text-purple-700

                        dark:hover:bg-purple-600/20
                        dark:hover:text-white
                      "
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <>
                    <div
                      className="
                        border-b
                        border-gray-200
                        px-4
                        py-3

                        dark:border-white/10
                      "
                    >
                      <p className="font-semibold truncate">
                        {user.displayName ||
                          "Otaku User"}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          text-gray-500

                          dark:text-gray-400
                        "
                      >
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="
                        block
                        px-4
                        py-3
                        transition
                        hover:bg-purple-50
                        hover:text-purple-700

                        dark:hover:bg-purple-600/20
                        dark:hover:text-white
                      "
                    >
                      Edit Profile
                    </Link>


                    <button
                      type="button"
                      onClick={logout}
                      className="
                        w-full
                        px-4
                        py-3
                        text-left
                        text-red-600
                        transition
                        hover:bg-red-50

                        dark:text-red-400
                        dark:hover:bg-red-500/10
                      "
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>


          {/* SETTINGS */}
          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(
                  !isSettingsOpen
                );

                setIsProfileOpen(false);
              }}
              className="
                flex
                items-center
                gap-2
                text-gray-700
                transition
                hover:text-purple-600

                dark:text-gray-300
                dark:hover:text-purple-400
              "
            >
              <span>⚙</span>

              <span>
                Settings
              </span>

              <span className="text-xs">
                ▼
              </span>
            </button>


            {/* SETTINGS / PERSONALIZATION DROPDOWN */}
            {isSettingsOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-52
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-900
                  shadow-2xl
                  z-[100]

                  dark:border-white/10
                  dark:bg-[#151522]
                  dark:text-white
                "
              >
                <Link
                  to="/settings"
                  className="
                    block
                    px-4
                    py-3
                    font-medium
                    transition

                    text-gray-800
                    hover:bg-purple-50
                    hover:text-purple-700

                    dark:text-gray-200
                    dark:hover:bg-purple-600/20
                    dark:hover:text-white
                  "
                >
                  Personalization
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {isMobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-200 px-4 pb-5 pt-3 md:hidden dark:border-white/10"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            <button type="button" onClick={toggleTheme} className="mb-2 flex items-center justify-between rounded-xl border border-[var(--otaku-border)] bg-[var(--otaku-surface)] px-4 py-3 font-medium">
              <span>{isDark ? "Dark mode" : "Light mode"}</span><span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
            </button>
            {[
              ["Home", "/"],
              ["Anime", "/anime"],
              ["Manga", "/manga"],
              ["K-pop", "/kpop"],
              ["Merch", "/merch"],
              ["Community", "/community"],
              ["About", "/about"],
            ].map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className={`rounded-xl px-4 py-3 text-base font-medium transition ${
                  location.pathname === path
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-600/20 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}

            {isAdmin && (
              <Link to="/admin" className="rounded-xl px-4 py-3 font-medium text-purple-500">
                Admin
              </Link>
            )}

            <div className="my-2 border-t border-gray-200 dark:border-white/10" />

            {user ? (
              <>
                <Link to="/profile" className="rounded-xl px-4 py-3 font-medium hover:bg-purple-50 dark:hover:bg-purple-600/20">
                  Profile
                </Link>
                <Link to="/settings" className="rounded-xl px-4 py-3 font-medium hover:bg-purple-50 dark:hover:bg-purple-600/20">
                  Settings
                </Link>
                <button type="button" onClick={logout} className="rounded-xl px-4 py-3 text-left font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link to="/login" className="rounded-xl border border-purple-500 px-4 py-3 text-center font-medium text-purple-500">
                  Login
                </Link>
                <Link to="/register" className="rounded-xl bg-purple-600 px-4 py-3 text-center font-medium text-white">
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
