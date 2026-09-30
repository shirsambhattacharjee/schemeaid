import { useEffect, useState } from "react";
import {
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [state, setState] = useState("All");
  const [category, setCategory] = useState("All");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // LOAD FILTERS
  // --------------------------------
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await fetch(
          `${API}/api/schemes/filters`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load filters"
          );
        }

        setStates(result.data?.states || []);
        setCategories(
          result.data?.categories || []
        );
      } catch (error) {
        console.error("Filter error:", error);
      }
    };

    loadFilters();
  }, []);

  // --------------------------------
  // SEARCH DEBOUNCE
  // --------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // --------------------------------
  // LOAD SCHEMES
  // --------------------------------
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", 24);

        if (search) {
          params.set("search", search);
        }

        if (state !== "All") {
          params.set("state", state);
        }

        if (category !== "All") {
          params.set("category", category);
        }

        const url =
          `${API}/api/schemes?${params.toString()}`;

        console.log("Fetching:", url);

        const response = await fetch(url);

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load schemes"
          );
        }

        setSchemes(result.data || []);
        setTotal(result.total || 0);
        setPages(result.pages || 1);
      } catch (error) {
        console.error(
          "Scheme loading error:",
          error
        );

        setError(
          error.message ||
            "Unable to load schemes."
        );

        setSchemes([]);
        setTotal(0);
        setPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, [page, state, category, search]);

  // --------------------------------
  // HANDLERS
  // --------------------------------
  const handleState = (e) => {
    setState(e.target.value);
    setPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-white">
          Government Schemes
        </h1>

        <p className="text-slate-400 mt-2">
          Explore government schemes
          across India.
        </p>

        <p className="text-emerald-400 text-sm mt-2">
          {total.toLocaleString()} schemes
          available
        </p>
      </div>

      {/* FILTERS */}
      <div className="glass-card rounded-2xl p-4 mb-6">

        <div className="grid md:grid-cols-3 gap-3">

          {/* SEARCH */}
          <div className="relative">

            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-slate-500
              "
            />

            <input
              type="text"
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              placeholder="Search schemes..."
              className="
                w-full
                bg-slate-900
                border
                border-slate-700
                rounded-xl
                pl-10
                pr-10
                py-3
                text-sm
                text-slate-200
                placeholder:text-slate-500
                outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-500/10
              "
            />

            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                  hover:text-white
                "
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>

          {/* STATE */}
          <select
            value={state}
            onChange={handleState}
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-sm
              text-slate-200
              outline-none
              focus:border-emerald-500
            "
          >
            <option value="All">
              All States / UTs
            </option>

            {states.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={handleCategory}
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-sm
              text-slate-200
              outline-none
              focus:border-emerald-500
            "
          >
            <option value="All">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* SEARCH STATUS */}
      {search && !loading && (
        <div className="mb-5 text-sm text-slate-400">
          Search results for{" "}
          <span className="text-emerald-400 font-semibold">
            "{search}"
          </span>
          {" "}— {total.toLocaleString()} found
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="
          mb-6
          rounded-xl
          border
          border-red-500/20
          bg-red-500/10
          p-4
          text-sm
          text-red-300
        ">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="
              w-7
              h-7
              text-emerald-400
              animate-spin
            "
          />
        </div>
      ) : schemes.length === 0 ? (

        /* NO RESULTS */
        <div className="
          glass-card
          rounded-2xl
          p-10
          text-center
        ">
          <Search
            className="
              w-10
              h-10
              mx-auto
              text-slate-600
              mb-4
            "
          />

          <p className="text-slate-300">
            No schemes found.
          </p>

          {search && (
            <p className="
              text-xs
              text-slate-500
              mt-2
            ">
              Try another scheme name,
              category or keyword.
            </p>
          )}
        </div>

      ) : (

        <>
          {/* SCHEME GRID */}
          <div className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">

            {schemes.map((scheme) => (

              <div
                key={
                  scheme._id ||
                  scheme.slug
                }
                className="
                  glass-card
                  rounded-2xl
                  p-5
                  hover:border-emerald-500/40
                  hover:-translate-y-0.5
                  transition
                "
              >

                {/* TOP */}
                <div className="
                  flex
                  justify-between
                  gap-3
                ">

                  <span className="
                    px-2.5
                    py-1
                    rounded-lg
                    bg-emerald-500/10
                    text-emerald-400
                    text-xs
                  ">
                    {scheme.category ||
                      "General"}
                  </span>

                  <span className="
                    text-xs
                    text-slate-500
                  ">
                    {scheme.level ||
                      "Government"}
                  </span>

                </div>

                {/* NAME */}
                <h2 className="
                  text-lg
                  font-semibold
                  text-white
                  mt-4
                ">
                  {scheme.name ||
                    scheme.title ||
                    "Government Scheme"}
                </h2>

                {/* TITLE */}
                {scheme.title &&
                  scheme.title !==
                    scheme.name && (

                    <p className="
                      text-sm
                      text-slate-400
                      mt-1
                    ">
                      {scheme.title}
                    </p>

                  )}

                {/* DESCRIPTION */}
                <p className="
                  text-sm
                  text-slate-500
                  mt-3
                  line-clamp-3
                ">
                  {scheme.description ||
                    "Government welfare scheme."}
                </p>

                {/* BOTTOM */}
                <div className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  mt-5
                ">

                  <span className="
                    text-xs
                    text-slate-500
                  ">
                    {scheme.state ||
                      "All India"}
                  </span>

                  {scheme.officialUrl && (

                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-emerald-400
                        text-xs
                        font-semibold
                        hover:text-emerald-300
                      "
                    >
                      Official Portal

                      <ExternalLink
                        className="w-3.5 h-3.5"
                      />
                    </a>

                  )}

                </div>

              </div>

            ))}

          </div>

          {/* PAGINATION */}
          <div className="
            flex
            items-center
            justify-center
            gap-4
            mt-8
            pb-8
          ">

            <button
              disabled={page <= 1}
              onClick={() =>
                setPage((p) => p - 1)
              }
              className="
                p-2
                rounded-lg
                bg-slate-800
                border
                border-slate-700
                text-slate-300
                hover:bg-slate-700
                disabled:opacity-30
                disabled:cursor-not-allowed
              "
            >
              <ChevronLeft
                className="w-5 h-5"
              />
            </button>

            <span className="
              text-sm
              text-slate-400
            ">
              Page {page} of {pages}
            </span>

            <button
              disabled={page >= pages}
              onClick={() =>
                setPage((p) => p + 1)
              }
              className="
                p-2
                rounded-lg
                bg-slate-800
                border
                border-slate-700
                text-slate-300
                hover:bg-slate-700
                disabled:opacity-30
                disabled:cursor-not-allowed
              "
            >
              <ChevronRight
                className="w-5 h-5"
              />
            </button>

          </div>
        </>
      )}

    </div>
  );
};

export default Schemes;