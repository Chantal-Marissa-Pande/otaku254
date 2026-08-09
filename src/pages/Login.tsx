import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-10 space-y-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login} className="bg-purple-600 px-4 py-2">
        Login
      </button>
    </div>
  );
}
