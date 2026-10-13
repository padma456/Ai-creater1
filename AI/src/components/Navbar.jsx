
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { label: "Home", path: "/", end: true },
    { label: "AI Studio", path: "/ai-studio" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Discover Creators", path: "/discover-creators" },
    
    { label: "Create Content", path: "/create" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <header className="cs-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="cs-brand" onClick={closeMenu}>
          <span className="brand-symbol">
            <Sparkles size={22} />
          </span>

          <span className="brand-name">
            CreatorSphere<span className="brand-ai">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `cs-nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Login and signup */}
        <div className="navbar-actions">
          <Link to="/login" className="nav-login">
            <LogIn size={16} />
            <span>Log in</span>
          </Link>

          <Link to="/register" className="nav-signup">
            <UserPlus size={16} />
            <span>Get started</span>
            <ChevronDown size={14} className="signup-arrow" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="mobile-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="mobile-nav-actions">
            <Link to="/login" onClick={closeMenu}>
              Log in
            </Link>

            <Link
              to="/register"
              className="nav-signup"
              onClick={closeMenu}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
