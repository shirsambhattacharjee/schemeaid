import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  Moon,
  Sun,
  Menu,
} from "lucide-react";

const Header = () => {
  const { currentUser, logout } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.body.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  
  useEffect(() => {
    setImgError(false);
  }, [currentUser?.photoURL]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  const name =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const firstLetter = name
    .charAt(0)
    .toUpperCase();

  return (
    <header className="top-header">

      <div className="mobile-brand">
        <button className="mobile-menu">
          <Menu size={19} />
        </button>

        <span>SchemeAid</span>
      </div>

      <div className="header-right">

        {/* THEME SWITCH */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-switch"
          aria-label="Toggle light and dark mode"
          title={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          <span
            className={`theme-switch-thumb ${
              theme === "light"
                ? "theme-light"
                : ""
            }`}
          >
            {theme === "dark" ? (
              <Moon size={14} />
            ) : (
              <Sun size={14} />
            )}
          </span>

          <span className="theme-label">
            {theme === "dark"
              ? "Dark"
              : "Light"}
          </span>
        </button>

        {/* PROFILE */}
        {currentUser && (
          <div className="header-profile">

            {currentUser.photoURL && !imgError ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="header-avatar"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="header-avatar avatar-fallback">
                {firstLetter}
              </div>
            )}

            <div className="header-user-info">
              <span className="header-welcome">
                Welcome back
              </span>

              <span className="header-name">
                {name}
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="logout-button"
              title="Logout"
            >
              <LogOut size={16} />
            </button>

          </div>
        )}

      </div>
    </header>
  );
};

export default Header;