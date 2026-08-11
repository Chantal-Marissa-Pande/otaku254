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
  }, [location.pathname]);

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
        relative
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
    </nav>
  );
}