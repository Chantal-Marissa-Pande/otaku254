import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";


export default function Profile() {
  const [user, setUser] =
    useState<User | null>(null);

  const [username, setUsername] =
    useState("");

  const [editUsername, setEditUsername] =
    useState("");

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const navigate = useNavigate();


  /*
   * LOAD USER
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

          /*
           * Firebase Auth display name is our
           * fallback username.
           */
          let currentUsername =
            currentUser.displayName ||
            "Otaku User";

          /*
           * Try to get the username stored
           * in Firestore.
           */
          try {
            const userRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const userSnapshot =
              await getDoc(userRef);

            if (userSnapshot.exists()) {
              const data =
                userSnapshot.data();

              if (
                data.username &&
                typeof data.username === "string"
              ) {
                currentUsername =
                  data.username;
              }
            }
          } catch (error) {
            console.error(
              "Error loading profile:",
              error
            );
          }

          setUsername(
            currentUsername
          );

          setEditUsername(
            currentUsername
          );

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();
  }, []);


  /*
   * SAVE PROFILE
   */
  const handleSaveProfile =
    async () => {
      const currentUser =
        auth.currentUser;

      if (!currentUser) {
        setMessage(
          "You must be logged in to edit your profile."
        );

        return;
      }

      const cleanedUsername =
        editUsername.trim();

      if (!cleanedUsername) {
        setMessage(
          "Username cannot be empty."
        );

        return;
      }

      if (
        cleanedUsername.length < 2
      ) {
        setMessage(
          "Username must be at least 2 characters."
        );

        return;
      }

      setSaving(true);
      setMessage("");

      try {
        /*
         * Update Firebase Authentication.
         */
        await updateProfile(
          currentUser,
          {
            displayName:
              cleanedUsername,
          }
        );

        /*
         * Update local Firebase user state.
         */
        setUser({
          ...currentUser,
          displayName:
            cleanedUsername,
        });

        /*
         * Save username to Firestore.
         *
         * merge: true means we don't
         * overwrite other user information.
         */
        await setDoc(
          doc(
            db,
            "users",
            currentUser.uid
          ),
          {
            username:
              cleanedUsername,

            updatedAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        setUsername(
          cleanedUsername
        );

        setEditUsername(
          cleanedUsername
        );

        setEditing(false);

        setMessage(
          "Profile updated successfully!"
        );
      } catch (error) {
        console.error(
          "Error updating profile:",
          error
        );

        setMessage(
          "Could not update your profile."
        );
      } finally {
        setSaving(false);
      }
    };


  /*
   * CANCEL EDITING
   */
  const handleCancelEdit =
    () => {
      setEditUsername(
        username
      );

      setEditing(false);

      setMessage("");
    };


  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p
          style={{
            color:
              "var(--otaku-muted)",
          }}
        >
          Loading profile...
        </p>
      </div>
    );
  }


  /*
   * NOT LOGGED IN
   */
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="text-6xl mb-6">
            👤
          </div>

          <h1
            className="text-3xl font-bold mb-3"
            style={{
              color:
                "var(--otaku-text)",
            }}
          >
            Your Otaku254 Profile
          </h1>

          <p
            className="mb-8"
            style={{
              color:
                "var(--otaku-muted)",
            }}
          >
            Create an account or login
            to join the Otaku254 community.
          </p>

          <div className="flex gap-4 justify-center">

            <button
              onClick={() =>
                navigate("/login")
              }
              className="theme-button px-6 py-3 rounded-xl font-semibold"
            >
              Login
            </button>

            <button
              onClick={() =>
                navigate("/register")
              }
              className="px-6 py-3 rounded-xl font-semibold transition"
              style={{
                border:
                  "1px solid var(--otaku-accent)",
                color:
                  "var(--otaku-accent)",
              }}
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

      <div
        className="rounded-2xl p-8"
        style={{
          background:
            "var(--otaku-surface)",
          border:
            "1px solid var(--otaku-border)",
        }}
      >

        {/* =================================
            PROFILE HEADER
        ================================== */}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* PROFILE IMAGE */}

          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
            style={{
              background:
                "var(--otaku-accent)",
            }}
          >
            {username
              ? username
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>


          <div className="text-center sm:text-left flex-1">

            <h1
              className="text-3xl font-bold"
              style={{
                color:
                  "var(--otaku-text)",
              }}
            >
              {username ||
                "Otaku User"}
            </h1>

            <p
              className="mt-1"
              style={{
                color:
                  "var(--otaku-muted)",
              }}
            >
              {user.email}
            </p>

            <p
              className="text-sm mt-3"
              style={{
                color:
                  "var(--otaku-muted)",
              }}
            >
              Member of the Otaku254
              community
            </p>

          </div>


          <button
            onClick={() =>
              navigate("/settings")
            }
            className="px-5 py-2 rounded-lg transition"
            style={{
              border:
                "1px solid var(--otaku-border)",
              color:
                "var(--otaku-text)",
            }}
          >
            Settings
          </button>

        </div>


        {/* =================================
            PROFILE INFORMATION
        ================================== */}

        <div
          className="mt-8 pt-8"
          style={{
            borderTop:
              "1px solid var(--otaku-border)",
          }}
        >

          <div className="flex items-center justify-between mb-6">

            <h2
              className="text-xl font-semibold"
              style={{
                color:
                  "var(--otaku-text)",
              }}
            >
              Profile Information
            </h2>


            {!editing && (
              <button
                onClick={() => {
                  setEditUsername(
                    username
                  );

                  setEditing(true);

                  setMessage("");
                }}
                className="theme-button px-4 py-2 rounded-lg font-semibold"
              >
                Edit Profile
              </button>
            )}

          </div>


          {editing ? (

            <div className="space-y-5">

              {/* USERNAME */}

              <div>

                <label
                  className="block text-sm mb-2"
                  style={{
                    color:
                      "var(--otaku-muted)",
                  }}
                >
                  Username
                </label>

                <input
                  type="text"
                  value={
                    editUsername
                  }
                  onChange={(event) =>
                    setEditUsername(
                      event.target.value
                    )
                  }
                  maxLength={30}
                  className="w-full rounded-lg px-4 py-3 outline-none"
                  style={{
                    background:
                      "var(--otaku-bg)",
                    color:
                      "var(--otaku-text)",
                    border:
                      "1px solid var(--otaku-border)",
                  }}
                  placeholder="Enter your username"
                />

              </div>


              {/* EMAIL */}

              <div>

                <label
                  className="block text-sm mb-2"
                  style={{
                    color:
                      "var(--otaku-muted)",
                  }}
                >
                  Email
                </label>

                <input
                  type="text"
                  value={
                    user.email || ""
                  }
                  disabled
                  className="w-full rounded-lg px-4 py-3 opacity-60 cursor-not-allowed"
                  style={{
                    background:
                      "var(--otaku-bg)",
                    color:
                      "var(--otaku-text)",
                    border:
                      "1px solid var(--otaku-border)",
                  }}
                />

              </div>


              {/* ACTION BUTTONS */}

              <div className="flex gap-3">

                <button
                  onClick={
                    handleSaveProfile
                  }
                  disabled={saving}
                  className="theme-button px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>


                <button
                  onClick={
                    handleCancelEdit
                  }
                  disabled={saving}
                  className="px-5 py-3 rounded-xl font-semibold"
                  style={{
                    border:
                      "1px solid var(--otaku-border)",
                    color:
                      "var(--otaku-text)",
                  }}
                >
                  Cancel
                </button>

              </div>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <p
                  className="text-sm"
                  style={{
                    color:
                      "var(--otaku-muted)",
                  }}
                >
                  Username
                </p>

                <p
                  className="mt-1"
                  style={{
                    color:
                      "var(--otaku-text)",
                  }}
                >
                  {username ||
                    "Not set"}
                </p>

              </div>


              <div>

                <p
                  className="text-sm"
                  style={{
                    color:
                      "var(--otaku-muted)",
                  }}
                >
                  Email
                </p>

                <p
                  className="mt-1"
                  style={{
                    color:
                      "var(--otaku-text)",
                  }}
                >
                  {user.email ||
                    "Not available"}
                </p>

              </div>

            </div>

          )}


          {message && (
            <p
              className="mt-4 text-sm"
              style={{
                color:
                  "var(--otaku-muted)",
              }}
            >
              {message}
            </p>
          )}

        </div>


        {/* =================================
            COMMUNITY
        ================================== */}

        <div
          className="mt-8 pt-8"
          style={{
            borderTop:
              "1px solid var(--otaku-border)",
          }}
        >

          <h2
            className="text-xl font-semibold mb-3"
            style={{
              color:
                "var(--otaku-text)",
            }}
          >
            Community
          </h2>

          <p
            className="mb-5"
            style={{
              color:
                "var(--otaku-muted)",
            }}
          >
            Join discussions and share
            your thoughts with other
            Otaku254 fans.
          </p>

          <button
            onClick={() =>
              navigate("/community")
            }
            className="theme-button px-5 py-3 rounded-xl font-semibold"
          >
            Go to Community
          </button>

        </div>

      </div>

    </div>
  );
}