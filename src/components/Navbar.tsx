import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Load authenticated user
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (!currentUser) {
          setIsAdmin(false);
          return;
        }

        try {
          const userDoc = await getDoc(
            doc(db, "users", currentUser.uid)
          );

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.role === "admin");
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
   * IMPORTANT:
   * Close all dropdowns whenever the user changes page.
   *
   * This prevents the profile menu from remaining open
   * and covering the Settings/Profile page.
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
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const displayName =
    user?.displayName || "Profile";

  return (
    <nav
      className="
        bg-black/70
        backdrop-blur
        border-b
        border-purple-500/20
        relative
        z-50
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
          className="text-2xl font-bold"
        >
          <span className="text-purple-500">
            Otaku
          </span>

          <span className="text-pink-500">
            254
          </span>
        </Link>

        {/* MAIN NAVIGATION */}
        <div className="hidden md:flex gap-6 text-sm items-center">

          <Link
            to="/"
            className="hover:text-purple-400 transition"
          >
            Home
          </Link>

          <Link
            to="/anime"
            className="hover:text-purple-400 transition"
          >
            Anime
          </Link>

          <Link
            to="/manga"
            className="hover:text-purple-400 transition"
          >
            Manga
          </Link>

          <Link
            to="/kpop"
            className="hover:text-purple-400 transition"
          >
            K-pop
          </Link>

          <Link
            to="/merch"
            className="hover:text-purple-400 transition"
          >
            Merch
          </Link>

          <Link
            to="/about"
            className="hover:text-purple-400 transition"
          >
            About
          </Link>

          <Link
            to="/community"
            className="hover:text-purple-400 transition"
          >
            Community
          </Link>

          {/* ADMIN */}
          {isAdmin && (
            <Link
              to="/admin"
              className="
                text-purple-400
                hover:text-purple-300
                transition
              "
            >
              Admin
            </Link>
          )}

          {/* PROFILE */}
          <div className="relative">

            <button
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
                hover:text-purple-400
                transition
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

            {isProfileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-52
                  rounded-xl
                  overflow-hidden
                  shadow-2xl
                  border
                  border-white/10
                  bg-[#151522]
                  z-[100]
                "
              >

                {!user ? (
                  <>
                    <div
                      className="
                        px-4
                        py-3
                        border-b
                        border-white/10
                      "
                    >
                      <p className="font-semibold">
                        Welcome to Otaku254
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Join the community
                      </p>
                    </div>

                    <Link
                      to="/register"
                      className="
                        block
                        px-4
                        py-3
                        hover:bg-purple-600/20
                        transition
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
                        hover:bg-purple-600/20
                        transition
                      "
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <>
                    <div
                      className="
                        px-4
                        py-3
                        border-b
                        border-white/10
                      "
                    >
                      <p className="font-semibold truncate">
                        {user.displayName ||
                          "Otaku User"}
                      </p>

                      <p className="text-xs text-gray-400 truncate mt-1">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="
                        block
                        px-4
                        py-3
                        hover:bg-purple-600/20
                        transition
                      "
                    >
                      View Profile
                    </Link>

                    <Link
                      to="/profile"
                      className="
                        block
                        px-4
                        py-3
                        hover:bg-purple-600/20
                        transition
                      "
                    >
                      Edit Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        text-red-400
                        hover:bg-red-500/10
                        transition
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
                hover:text-purple-400
                transition
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

            {isSettingsOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-48
                  rounded-xl
                  overflow-hidden
                  shadow-2xl
                  border
                  border-white/10
                  bg-[#151522]
                  z-[100]
                "
              >
                <Link
                  to="/settings"
                  className="
                    block
                    px-4
                    py-3
                    hover:bg-purple-600/20
                    transition
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