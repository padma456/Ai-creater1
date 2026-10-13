
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
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
        throw new Error(
          result.message || "Registration failed. Please try again."
        );
      }

      setIsError(false);
      setMessage("Account created successfully! Redirecting to login...");

      form.reset();

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Make sure your backend is running on port 5000."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-wrap">
      <form className="form-panel" onSubmit={submit}>
        <span className="eyebrow">JOIN THE COMMUNITY</span>

        <h1>Create your account</h1>

        <label>
          Full name
          <input
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>

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
          Account type
          <select name="role" defaultValue="creator">
            <option value="creator">AI Creator</option>
            <option value="user">Brand / Agency</option>
          </select>
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            minLength={8}
            required
            placeholder="At least 8 characters"
            autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="form-foot">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}
