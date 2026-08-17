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
    <div className="page-shell flex items-center justify-center">
      <div className="form-card w-full max-w-md">

        <span className="eyebrow">Join the fandom</span><h1 className="page-title mb-2">
          Join Otaku254
        </h1>

        <p className="theme-muted mb-8">
          Create an account and join the community.
        </p>

        <div className="space-y-4">

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-field"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-field"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-field"
          />

          {/* REGISTER */}
          <button
            onClick={register}
            disabled={loading}
            className="primary-action w-full"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </div>

        {/* LOGIN LINK */}
        <p className="theme-muted mt-6 text-center">
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
