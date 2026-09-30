import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";

const MyApplications = () => {
  const [applications, setApplications] = useState(() =>
    JSON.parse(
      localStorage.getItem("applications") || "[]"
    )
  );

  const addApplication = () => {
    const name = window.prompt(
      "Enter scheme name:"
    );

    if (!name) return;

    const application = {
      id: Date.now(),
      schemeName: name,
      status: "Applied",
      date: new Date().toLocaleDateString(),
    };

    const updated = [
      ...applications,
      application,
    ];

    setApplications(updated);

    localStorage.setItem(
      "applications",
      JSON.stringify(updated)
    );
  };

  const removeApplication = (id) => {
    const updated = applications.filter(
      (item) => item.id !== id
    );

    setApplications(updated);

    localStorage.setItem(
      "applications",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="page-container">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">

        <div>
          <p className="text-emerald-400 text-xs uppercase tracking-widest font-semibold">
            Tracking
          </p>

          <h1 className="text-3xl font-bold text-white mt-2">
            My Applications
          </h1>

          <p className="text-slate-500 mt-2">
            Keep track of schemes you have applied for.
          </p>
        </div>

        <button
          onClick={addApplication}
          className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <FileText className="w-10 h-10 text-slate-700 mx-auto" />

          <h2 className="text-white font-semibold mt-4">
            No applications yet
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Your application tracking information will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <div
              key={application.id}
              className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h2 className="font-semibold text-white">
                  {application.schemeName}
                </h2>

                <p className="text-xs text-slate-600 mt-1">
                  Applied on {application.date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                  {application.status}
                </span>

                <button
                  onClick={() =>
                    removeApplication(application.id)
                  }
                  className="p-2 text-slate-600 hover:text-red-400"
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

export default MyApplications;