import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const SchemeDetails = () => {
  const { slug } = useParams();

  const [scheme, setScheme] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(
          `${API}/api/schemes/${slug}`
        );

        const data = await response.json();

        if (data.success) {
          setScheme(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, [slug]);

  if (!scheme) {
    return (
      <div className="page-container text-center text-slate-500">
        Loading scheme...
      </div>
    );
  }

  const saveScheme = () => {
    const existing = JSON.parse(
      localStorage.getItem("savedSchemes") || "[]"
    );

    const exists = existing.some(
      (item) => item.slug === scheme.slug
    );

    let updated;

    if (exists) {
      updated = existing.filter(
        (item) => item.slug !== scheme.slug
      );
      setSaved(false);
    } else {
      updated = [...existing, scheme];
      setSaved(true);
    }

    localStorage.setItem(
      "savedSchemes",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="page-container">

      <Link
        to="/schemes"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to schemes
      </Link>

      <div className="max-w-4xl mx-auto">

        <div className="glass-card rounded-[28px] p-7 md:p-10">

          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs">
              {scheme.category || "General"}
            </span>

            <span className="bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full text-xs">
              {scheme.level || "Government"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mt-6">
            {scheme.name || scheme.title}
          </h1>

          <p className="text-slate-400 mt-4 leading-relaxed">
            {scheme.description}
          </p>

          {scheme.benefits?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-white">
                Benefits
              </h2>

              <div className="mt-4 space-y-2">
                {scheme.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex gap-2 text-sm text-slate-400"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {benefit}
                  </div>
                ))}
              </div>
            </section>
          )}

          {scheme.eligibility && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-white">
                Eligibility
              </h2>

              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                {scheme.eligibility}
              </p>
            </section>
          )}

          <div className="flex flex-wrap gap-3 mt-9 pt-7 border-t border-slate-800">

            <button
              onClick={saveScheme}
              className="inline-flex items-center gap-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3 rounded-xl text-sm font-semibold"
            >
              <Bookmark className="w-4 h-4" />
              {saved ? "Saved" : "Save Scheme"}
            </button>

            {scheme.officialUrl && (
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 rounded-xl text-sm font-bold"
              >
                Apply on Official Portal
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;