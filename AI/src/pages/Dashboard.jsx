
import { Link } from "react-router-dom";
import {
  FileText,
  FolderKanban,
  Sparkles,
  Users,
  ArrowUpRight,
} from "lucide-react";
import "./Dashboard.css";

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const briefs = readStorage("cs-briefs", []);
  const projects = readStorage("cs-projects", []);
  const user = readStorage("creatorSphereUser", {});

  const name = user?.name || "Creator";
  const email = user?.email || "";
  const role = user?.role || "user";

  const stats = [
    {
      label: "Saved briefs",
      value: briefs.length,
      icon: FileText,
      path: "/create",
    },
    {
      label: "Tracked projects",
      value: projects.length,
      icon: FolderKanban,
      path: "/projects",
    },
    {
      label: "Creator directory",
      value: "Explore",
      icon: Users,
      path: "/marketplace",
    },
  ];

  return (
    <section className="section-block">
      <span className="eyebrow">YOUR WORKSPACE</span>

      <h1 className="page-title">
        Welcome, {name}!
      </h1>

      <p className="page-description">
        Here is your CreatorSphere AI workspace at a glance.
      </p>

      <article className="stat-card" style={{ marginBottom: 24 }}>
        <Sparkles size={22} />
        <h3>Your account</h3>
        <p>{email || "Your registered email"}</p>
        <p>
          Account type:{" "}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </p>
      </article>

      <div className="dashboard-stats">
        {stats.map(({ label, value, icon: Icon, path }) => (
          <Link
            to={path}
            className="stat-card-link"
            key={label}
            aria-label={`${label}: ${value}. Open section`}
          >
            <article className="stat-card">
              <Icon size={22} />
              <span>{label}</span>
              <strong>{value}</strong>
              <ArrowUpRight
                size={17}
                className="stat-card-arrow"
                aria-hidden="true"
              />
            </article>
          </Link>
        ))}
      </div>

      <h2 className="subheading">Quick actions</h2>

      <div className="dashboard-actions">
        <Link className="action-card" to="/marketplace">
          <Users size={23} />
          <h3>Discover creators</h3>
          <p>Explore creator portfolios and creative tools.</p>
        </Link>

        <Link className="action-card" to="/create">
          <FileText size={23} />
          <h3>Build a brief</h3>
          <p>Capture campaign requirements and licensing.</p>
        </Link>

        <Link className="action-card" to="/ai-studio">
          <Sparkles size={23} />
          <h3>AI Studio</h3>
          <p>Explore creative ideas and templates.</p>
        </Link>
      </div>

      <h2 className="subheading">Recent briefs</h2>

      {briefs.length === 0 ? (
        <p className="muted">No briefs saved yet.</p>
      ) : (
        briefs.map((brief, index) => (
          <article
            className="list-row"
            key={brief.id ?? index}
          >
            <div>
              <strong>{brief.title || "Untitled brief"}</strong>
              <p>
                {brief.type || "General"} ·{" "}
                {brief.ratio || "Not specified"} ·{" "}
                {brief.status || "Draft"}
              </p>
            </div>
            <span>{brief.id ?? index + 1}</span>
          </article>
        ))
      )}
    </section>
  );
}
