import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Sign in with Firebase Authentication
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Get user's Firestore document
      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      );

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check user role
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // If the account exists but doesn't have
        // a Firestore user document yet
        navigate("/");
      }

    } catch (error: unknown) {
      console.error("Login failed:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            alert("Incorrect email or password.");
            break;

          case "auth/user-not-found":
            alert("No account was found with this email.");
            break;

          case "auth/wrong-password":
            alert("Incorrect password.");
            break;

          case "auth/invalid-email":
            alert("Please enter a valid email address.");
            break;

          default:
            alert("Login failed. Please try again.");
        }
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 mb-8">
          Login to your Otaku254 account.
        </p>

        <div className="space-y-4">

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

          {/* LOGIN */}
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

        {/* REGISTER LINK */}
        <p className="text-gray-400 mt-6 text-center">
          Don't have an account?{" "}

          <button
            onClick={() => navigate("/register")}
            className="text-purple-400 hover:text-purple-300"
          >
            Create Account
          </button>
        </p>

      </div>
    </div>
  );
}