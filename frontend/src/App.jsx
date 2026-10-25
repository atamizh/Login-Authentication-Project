import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import { loginUser } from "./api";

// Login page
function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Frontend validation
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit login form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email.trim(), password);

      // Save mock login session
      localStorage.setItem("novaUser", JSON.stringify(data.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">

        <div className="brand">
          <div className="brand-icon">N</div>
          <span>nova<span className="brand-light">auth</span></span>
        </div>

        <div className="login-heading">
          <h1>Welcome back</h1>
          <p>Enter your details to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={errors.email ? "input-error" : ""}
            />

            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={errors.password ? "input-error" : ""}
            />

            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {apiError && (
            <div className="api-error" role="alert">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <div className="demo-info">
          <p>Demo credentials</p>
          <span>Email: user@example.com</span>
          <span>Password: Nova123</span>
        </div>

        <p className="footer-text">
          © 2026 NovaAuth. Built for learning.
        </p>

      </section>
    </main>
  );
}

// Dashboard page
function Dashboard() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("novaUser");

  // Protect dashboard from unauthenticated access
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);

  const handleLogout = () => {
    localStorage.removeItem("novaUser");
    navigate("/");
  };

  return (
    <main className="dashboard-page">

      <nav className="dashboard-nav">
        <div className="brand">
          <div className="brand-icon">N</div>
          <span>nova<span className="brand-light">auth</span></span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <section className="dashboard-content">

        <div className="welcome-badge">
          <span className="status-dot"></span>
          Signed in successfully
        </div>

        <h1>Welcome, {user.name}!</h1>

        <p className="dashboard-description">
          You have successfully logged in to your NovaAuth
          dashboard. Your authentication flow is working.
        </p>

        <div className="dashboard-card">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          <span className="account-status">Active</span>
        </div>

        <button
          className="login-button dashboard-logout"
          onClick={handleLogout}
        >
          Sign out
        </button>

      </section>
    </main>
  );
}

// Application routing
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}