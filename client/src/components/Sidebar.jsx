import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Layers,
  FileText,
  Bookmark,
  User,
  Sparkles,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Check Eligibility",
      path: "/onboarding",
      icon: Search,
    },
    {
      name: "Schemes",
      path: "/schemes",
      icon: Layers,
    },
    {
      name: "My Applications",
      path: "/applications",
      icon: FileText,
    },
    {
      name: "Saved Schemes",
      path: "/saved",
      icon: Bookmark,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="sidebar">

      <div>

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            🌱
          </div>

          <div>
            <h1>SchemeAid</h1>
            <p>AI Scheme Assistant</p>
          </div>
        </div>

        <p className="sidebar-label">
          MENU
        </p>

        <nav className="sidebar-nav">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive
                      ? "sidebar-link-active"
                      : ""
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>
      </div>

      <div className="sidebar-bottom">

        <Sparkles
          size={18}
          className="sidebar-sparkle"
        />

        <p>
          Government schemes made simple
        </p>

        <span>
          Discover benefits that match your profile.
        </span>

      </div>

    </aside>
  );
};

export default Sidebar;