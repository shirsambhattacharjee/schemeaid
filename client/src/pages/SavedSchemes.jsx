import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";

const SavedSchemes = () => {
  const [schemes, setSchemes] = useState([]);

  const load = () => {
    setSchemes(
      JSON.parse(
        localStorage.getItem("savedSchemes") || "[]"
      )
    );
  };

  useEffect(() => {
    load();
  }, []);

  const remove = (slug) => {
    const updated = schemes.filter(
      (scheme) => scheme.slug !== slug
    );

    localStorage.setItem(
      "savedSchemes",
      JSON.stringify(updated)
    );

    setSchemes(updated);
  };

  return (
    <div className="page-container">

      <div className="mb-7">
        <p className="text-emerald-400 text-xs uppercase tracking-widest font-semibold">
          Your collection
        </p>

        <h1 className="text-3xl font-bold text-white mt-2">
          Saved Schemes
        </h1>
      </div>

      {schemes.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Bookmark className="w-10 h-10 text-slate-700 mx-auto" />

          <h2 className="text-white font-semibold mt-4">
            No saved schemes
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Save schemes from their details page to find them here.
          </p>

          <Link
            to="/schemes"
            className="inline-block mt-5 bg-emerald-500 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-sm"
          >
            Browse Schemes
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <div
              key={scheme.slug}
              className="glass-card rounded-2xl p-5"
            >
              <h2 className="font-bold text-white">
                {scheme.name || scheme.title}
              </h2>

              <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                {scheme.description}
              </p>

              <div className="flex gap-2 mt-5">
                <Link
                  to={`/schemes/${scheme.slug}`}
                  className="flex-1 text-center bg-emerald-500 text-slate-950 font-semibold text-sm rounded-xl py-2.5"
                >
                  View
                </Link>

                <button
                  onClick={() => remove(scheme.slug)}
                  className="px-3 rounded-xl bg-red-500/10 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSchemes;