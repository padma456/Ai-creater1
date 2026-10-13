
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email").trim(),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed.");
      }

      if (!result.token) {
        throw new Error("Login succeeded, but the server did not return a token.");
      }

      // Save the authentication token for later API requests.
      localStorage.setItem("creatorSphereToken", result.token);

      if (result.user) {
        localStorage.setItem(
          "creatorSphereUser",
          JSON.stringify(result.user)
        );
      }

      setIsError(false);
      setMessage("Login successful! Opening your dashboard...");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setIsError(true);

      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Make sure the backend is running on port 5000."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-wrap">
      <form className="form-panel" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>

        <h1>Log in to CreatorSphere</h1>
        <p className="muted">Continue your creative journey.</p>

        <label>
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={150}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            required
            placeholder="Your password"
            autoComplete="current-password"
          />
        </label>

        {message && (
          <p
            role="alert"
            style={{
              color: isError ? "#f87171" : "#4ade80",
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="button-primary full-width"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="form-foot">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}
