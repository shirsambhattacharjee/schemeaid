import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Layers,
  FileText,
  Bookmark,
  User,
  Sparkles,
  X
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Check Eligibility", path: "/onboarding", icon: Search },
    { name: "Schemes", path: "/schemes", icon: Layers },
    { name: "My Applications", path: "/applications", icon: FileText },
    { name: "Saved Schemes", path: "/saved", icon: Bookmark },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay - Click to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar ${isOpen ? "open mobile-open" : ""} md:translate-x-0`}>
        <div>
          <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="sidebar-logo">🌱</div>
              <div>
                <h1>SchemeAid</h1>
                <p>AI Scheme Assistant</p>
              </div>
            </div>
            
            {/* Close button for mobile sidebar */}
            <button 
              onClick={onClose} 
              className="md:hidden" 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: '4px' }}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <p className="sidebar-label">MENU</p>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose} // Auto close sidebar on clicking a link in mobile view
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
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
          <Sparkles size={18} className="sidebar-sparkle" />
          <p>Government schemes made simple</p>
          <span>Discover benefits that match your profile.</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;