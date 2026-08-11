import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const register = async () => {
    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Store username in Firebase Authentication
      await updateProfile(user, {
        displayName: username,
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        photoURL: "",
        role: "user",
        createdAt: Date.now(),
      });

      alert("Account created successfully!");

      // Send user to the community
      navigate("/");

    } catch (error: unknown) {
      console.error("Registration failed:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            alert("An account with this email already exists.");
            break;

          case "auth/invalid-email":
            alert("Please enter a valid email address.");
            break;

          case "auth/weak-password":
            alert("Password must be at least 6 characters.");
            break;

          default:
            alert("Registration failed. Please try again.");
        }
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold mb-2">
          Join Otaku254
        </h1>

        <p className="text-gray-400 mb-8">
          Create an account and join the community.
        </p>

        <div className="space-y-4">

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded bg-black border border-white/20"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-black border border-white/20"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black border border-white/20"
          />

          {/* REGISTER */}
          <button
            onClick={register}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </div>

        {/* LOGIN LINK */}
        <p className="text-gray-400 mt-6 text-center">
          Already have an account?{" "}

          <button
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-300"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}