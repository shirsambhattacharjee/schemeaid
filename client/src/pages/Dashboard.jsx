import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Bookmark,
  FileText,
  Sparkles,
  IndianRupee,
  Users,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const response = await fetch(`${API}/api/schemes`);

        if (!response.ok) {
          throw new Error(
            `Failed to load schemes: ${response.status}`
          );
        }

        const result = await response.json();

        if (result.success) {
          setSchemes(result.data || []);
        } else {
          setSchemes([]);
        }
      } catch (error) {
        console.error("Failed to load schemes:", error);
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, []);

  const popular = schemes.slice(0, 3);

  return (
    <div className="page-container">

      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="dashboard-hero mb-7">

        {/* Decorative glow */}
        <div className="dashboard-hero-glow" />

        <div className="relative max-w-3xl">

          {/* Badge */}
          <div className="dashboard-badge">
            <Sparkles className="w-3.5 h-3.5" />

            <span>
              AI-powered scheme discovery
            </span>
          </div>

          {/* Heading */}
          <h1 className="dashboard-title text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Find Government Schemes

            <span className="dashboard-title-accent block">
              You Are Eligible For
            </span>
          </h1>

          {/* Description */}
          <p className="dashboard-description mt-4 max-w-2xl leading-relaxed">
            Tell us a little about yourself and discover
            government schemes and benefits that match
            your profile.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-7">

            <Link
              to="/onboarding"
              className="
                inline-flex
                items-center
                gap-2
                bg-emerald-500
                hover:bg-emerald-400
                text-slate-950
                font-bold
                px-5
                py-3
                rounded-xl
                transition-all
                hover:-translate-y-0.5
                shadow-lg
                shadow-emerald-500/10
              "
            >
              <Search className="w-4 h-4" />

              <span>
                Check Eligibility
              </span>

              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/schemes"
              className="dashboard-secondary-button"
            >
              Browse Schemes
            </Link>

          </div>
        </div>
      </section>

      {/* =========================================
          QUICK STATS
      ========================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

        <StatCard
          icon={IndianRupee}
          title="Benefits"
          value="Government"
        />

        <StatCard
          icon={Users}
          title="Coverage"
          value="All India"
        />

        <StatCard
          icon={GraduationCap}
          title="Education"
          value="Multiple"
        />

        <StatCard
          icon={BriefcaseBusiness}
          title="Categories"
          value="Many"
        />

      </section>

      {/* =========================================
          QUICK LINKS
      ========================================= */}
      <section className="grid md:grid-cols-3 gap-4 mb-8">

        <QuickLink
          to="/onboarding"
          icon={Search}
          title="Check Eligibility"
          description="Find schemes matched to your profile."
        />

        <QuickLink
          to="/saved"
          icon={Bookmark}
          title="Saved Schemes"
          description="Access schemes you saved for later."
        />

        <QuickLink
          to="/applications"
          icon={FileText}
          title="My Applications"
          description="Track your scheme applications."
        />

      </section>

      {/* =========================================
          POPULAR SCHEMES
      ========================================= */}
      <section>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="dashboard-section-title text-xl font-bold">
              Popular Schemes
            </h2>

            <p className="dashboard-section-description text-sm mt-1">
              Explore available government schemes
            </p>
          </div>

          <Link
            to="/schemes"
            className="
              dashboard-view-all
              text-sm
              flex
              items-center
              gap-1
            "
          >
            View all

            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="dashboard-loading">
              <div className="loading-spinner" />

              <span>
                Loading schemes...
              </span>
            </div>
          </div>
        ) : popular.length === 0 ? (

          /* Empty State */
          <div className="glass-card rounded-2xl p-8 text-center">

            <div className="empty-state-icon">
              <FileText className="w-5 h-5" />
            </div>

            <p className="dashboard-empty-title">
              No schemes available yet.
            </p>

            <p className="dashboard-empty-description mt-2">
              Add scheme data to MongoDB to display
              government schemes here.
            </p>

          </div>

        ) : (

          /* Scheme Cards */
          <div className="grid md:grid-cols-3 gap-4">

            {popular.map((scheme) => (

              <Link
                key={scheme._id || scheme.slug}
                to={`/schemes/${scheme.slug}`}
                className="
                  glass-card
                  rounded-2xl
                  p-5
                  scheme-card
                  transition-all
                  hover:-translate-y-1
                "
              >

                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">

                  <div className="scheme-icon">
                    <LayersIcon />
                  </div>

                  <span className="scheme-level">
                    {scheme.level || "Government"}
                  </span>

                </div>

                {/* Scheme Name */}
                <h3 className="scheme-title mt-4">
                  {scheme.name || scheme.title}
                </h3>

                {/* Description */}
                <p className="scheme-description mt-2 line-clamp-2">
                  {scheme.description ||
                    "Government welfare scheme and benefits."}
                </p>

                {/* View Details */}
                <div className="scheme-details mt-4 flex items-center gap-1">

                  <span>
                    View details
                  </span>

                  <ArrowRight className="w-3 h-3" />

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};


/* =========================================
   STAT CARD
========================================= */

const StatCard = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 stat-card">

      <div className="stat-icon">
        <Icon className="w-4 h-4" />
      </div>

      <p className="stat-title text-xs mt-4">
        {title}
      </p>

      <p className="stat-value text-lg font-bold mt-1">
        {value}
      </p>

    </div>
  );
};


/* =========================================
   QUICK LINK
========================================= */

const QuickLink = ({
  to,
  icon: Icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="
        glass-card
        rounded-2xl
        p-5
        flex
        items-center
        gap-4
        quick-link
        transition-all
      "
    >

      <div className="quick-link-icon">
        <Icon className="w-5 h-5" />
      </div>

      <div className="min-w-0">

        <h3 className="quick-link-title text-sm font-semibold">
          {title}
        </h3>

        <p className="quick-link-description text-xs mt-1">
          {description}
        </p>

      </div>

    </Link>
  );
};


/* =========================================
   SCHEME ICON
========================================= */

const LayersIcon = () => (
  <span className="text-lg">
    ◈
  </span>
);


export default Dashboard;