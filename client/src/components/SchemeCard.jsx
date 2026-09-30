import React from "react";
import { ExternalLink, Bookmark } from "lucide-react";

export default function SchemeCard({ scheme, isSaved, onToggleSave }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 group">
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                scheme.badge === "State Govt"
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              {scheme.state}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
              {scheme.category}
            </span>
          </div>

          <button
            onClick={() => onToggleSave(scheme.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title={isSaved ? "Saved" : "Save Scheme"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-cyan-400" : ""}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
          {scheme.title}
        </h3>

        {/* Target Group */}
        <p className="text-xs text-slate-400 font-medium mb-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Target: <span className="text-slate-300">{scheme.targetGroup}</span>
        </p>

        {/* Benefits & Eligibility details */}
        <div className="space-y-3 mb-6 text-xs border-t border-slate-800/60 pt-3">
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">Key Benefit:</span>
            <p className="text-slate-300 leading-relaxed">{scheme.benefit}</p>
          </div>

          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">Eligibility Criteria:</span>
            <p className="text-slate-400 leading-relaxed">{scheme.eligibility}</p>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Official Portal
        </span>
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition"
        >
          Apply Now <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}