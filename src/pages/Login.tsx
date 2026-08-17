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
    <div className="page-shell flex items-center justify-center">
      <div className="form-card w-full max-w-md">

        <span className="eyebrow">Welcome back</span><h1 className="page-title mb-2">
          Welcome Back
        </h1>

        <p className="theme-muted mb-8">
          Login to your Otaku254 account.
        </p>

        <div className="space-y-4">

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

          {/* LOGIN */}
          <button
            onClick={login}
            disabled={loading}
            className="primary-action w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

        {/* REGISTER LINK */}
        <p className="theme-muted mt-6 text-center">
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
