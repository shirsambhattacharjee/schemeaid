import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Layers,
  MapPin,
  Building2,
  RefreshCw,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [state, setState] = useState("All");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------
  // Load categories + states
  // ---------------------------------------------

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoryResponse, stateResponse] =
          await Promise.all([
            fetch(`${API}/api/schemes/categories`),
            fetch(`${API}/api/schemes/states`),
          ]);

        const categoryResult =
          await categoryResponse.json();

        const stateResult =
          await stateResponse.json();

        if (categoryResult.success) {
          setCategories(categoryResult.data || []);
        }

        if (stateResult.success) {
          setStates(stateResult.data || []);
        }
      } catch (err) {
        console.error(
          "Failed to load filters:",
          err
        );
      }
    };

    loadFilters();
  }, []);

  // ---------------------------------------------
  // Load schemes
  // ---------------------------------------------

  useEffect(() => {
    const loadSchemes = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", 12);

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "All") {
          params.set("category", category);
        }

        if (level !== "All") {
          params.set("level", level);
        }

        if (state !== "All") {
          params.set("state", state);
        }

        const response = await fetch(
          `${API}/api/schemes?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load schemes."
          );
        }

        setSchemes(result.data || []);

        setPagination(
          result.pagination || {
            total: 0,
            totalPages: 1,
          }
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load schemes. Please check whether the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, [
    search,
    category,
    level,
    state,
    page,
  ]);

  // ---------------------------------------------
  // Filter change
  // ---------------------------------------------

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleLevelChange = (value) => {
    setLevel(value);
    setPage(1);
  };

  const handleStateChange = (value) => {
    setState(value);
    setPage(1);
  };

  // ---------------------------------------------
  // Reset
  // ---------------------------------------------

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
    setState("All");
    setPage(1);
  };

  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Government Schemes
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Discover schemes and benefits that may
              match your needs.
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}

      <div className="glass-card rounded-2xl p-5 mb-7">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-emerald-500" />

          <h2 className="font-semibold text-slate-900 dark:text-white">
            Find a Scheme
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}

          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search schemes..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-10 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category */}

          <select
            value={category}
            onChange={(e) =>
              handleCategoryChange(e.target.value)
            }
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="All">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Level */}

          <select
            value={level}
            onChange={(e) =>
              handleLevelChange(e.target.value)
            }
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="All">
              All Levels
            </option>

            <option value="Central">
              Central
            </option>

            <option value="State">
              State
            </option>

            <option value="UT">
              Union Territory
            </option>
          </select>

          {/* State */}

          <select
            value={state}
            onChange={(e) =>
              handleStateChange(e.target.value)
            }
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="All">
              All States
            </option>

            {states.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Reset */}

          <button
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* RESULT COUNT */}

      {!loading && !error && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              {pagination.total}
            </span>{" "}
            schemes found
          </p>

          <p className="text-xs text-slate-500">
            Page {pagination.page || page} of{" "}
            {pagination.totalPages || 1}
          </p>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-5 mb-6">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-5 animate-pulse"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 mb-5" />

                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3" />

                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />

                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              </div>
            )
          )}
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        schemes.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Layers className="w-10 h-10 mx-auto text-slate-400 mb-4" />

            <h3 className="font-semibold text-slate-900 dark:text-white">
              No schemes found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

      {/* SCHEME CARDS */}

      {!loading && !error && schemes.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {schemes.map((scheme) => (
            <div
              key={scheme._id || scheme.slug}
              className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>

                <span className="text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {scheme.level ||
                    "Government"}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                {scheme.name}
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                {scheme.shortDescription ||
                  scheme.description ||
                  "Government welfare scheme and benefits."}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {scheme.category && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Layers className="w-3 h-3" />
                    {scheme.category}
                  </span>
                )}

                {scheme.state && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />
                    {scheme.state}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                  to={`/schemes/${scheme.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2.5 text-sm font-semibold transition"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {scheme.officialUrl && (
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 transition"
                    title="Official website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}

      {!loading &&
        !error &&
        pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={page <= 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(current - 1, 1)
                )
              }
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
              {page} / {pagination.totalPages}
            </span>

            <button
              disabled={
                page >= pagination.totalPages
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    current + 1,
                    pagination.totalPages
                  )
                )
              }
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
};

export default SchemesPage;