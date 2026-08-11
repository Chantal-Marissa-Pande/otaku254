import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="text-6xl mb-6">
            👤
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Your Otaku254 Profile
          </h1>

          <p className="text-gray-400 mb-8">
            Create an account or login to join the Otaku254 community.
          </p>

          <div className="flex gap-4 justify-center">

            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="border border-purple-500 hover:bg-purple-500/10 px-6 py-3 rounded-xl font-semibold transition"
            >
              Create Account
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

        {/* PROFILE HEADER */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* PROFILE IMAGE */}
          <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-4xl font-bold">
            {user.displayName
              ? user.displayName.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="text-center sm:text-left flex-1">

            <h1 className="text-3xl font-bold">
              {user.displayName || "Otaku User"}
            </h1>

            <p className="text-gray-400 mt-1">
              {user.email}
            </p>

            <p className="text-sm text-gray-500 mt-3">
              Member of the Otaku254 community
            </p>

          </div>

          <button
            onClick={() => navigate("/settings")}
            className="border border-white/20 hover:bg-white/10 px-5 py-2 rounded-lg transition"
          >
            Settings
          </button>

        </div>

        {/* PROFILE INFORMATION */}
        <div className="border-t border-white/10 mt-8 pt-8">

          <h2 className="text-xl font-semibold mb-6">
            Profile Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Username
              </p>

              <p className="mt-1">
                {user.displayName || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1">
                {user.email || "Not available"}
              </p>
            </div>

          </div>

        </div>

        {/* COMMUNITY */}
        <div className="border-t border-white/10 mt-8 pt-8">

          <h2 className="text-xl font-semibold mb-3">
            Community
          </h2>

          <p className="text-gray-400 mb-5">
            Join discussions and share your thoughts with other Otaku254 fans.
          </p>

          <button
            onClick={() => navigate("/community")}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-semibold transition"
          >
            Go to Community
          </button>

        </div>

      </div>

    </div>
  );
}