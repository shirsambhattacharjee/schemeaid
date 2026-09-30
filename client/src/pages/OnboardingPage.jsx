import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  User,
  Users,
  GraduationCap,
  BriefcaseBusiness,
  IndianRupee,
  MapPin,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    state: "",
    gender: "",
    category: "",
    income: "",
    education: "",
    occupation: "",
    familyMembers: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch(`${API}/api/eligibility/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: {
            ...formData,
            income: Number(formData.income || 0),
            familyMembers: Number(formData.familyMembers || 0),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to check eligibility."
        );
      }

      setResults(data.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Something went wrong while checking eligibility."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* BACK */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-7">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
            Eligibility Checker
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Check Your Eligibility
          </h1>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Enter your basic information and SchemeAid will
            match your profile with available government schemes.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSearch}
          className="glass-card rounded-[24px] p-6 md:p-8"
        >
          <div className="grid md:grid-cols-2 gap-5">
            {/* STATE */}
            <SelectField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              icon={MapPin}
              required
              options={[
                "West Bengal",
                "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttar Pradesh",
                "Uttarakhand",
              ]}
              placeholder="Select your state"
            />

            {/* GENDER */}
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              icon={User}
              required
              options={["Male", "Female", "Other"]}
              placeholder="Select gender"
            />

            {/* CATEGORY */}
            <SelectField
              label="Social Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              icon={Users}
              required
              options={[
                "General",
                "OBC",
                "SC",
                "ST",
                "EWS",
                "Minority",
              ]}
              placeholder="Select category"
            />

            {/* INCOME */}
            <Field
              label="Annual Family Income"
              name="income"
              type="number"
              value={formData.income}
              onChange={handleChange}
              placeholder="Example: 150000"
              icon={IndianRupee}
              required
            />

            {/* EDUCATION */}
            <SelectField
              label="Education Level"
              name="education"
              value={formData.education}
              onChange={handleChange}
              icon={GraduationCap}
              required
              options={[
                "No Formal Education",
                "Primary",
                "Secondary",
                "Higher Secondary",
                "Diploma",
                "Graduate",
                "Post Graduate",
                "Other",
              ]}
              placeholder="Select education level"
            />

            {/* OCCUPATION */}
            <SelectField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              icon={BriefcaseBusiness}
              required
              options={[
                "Farmer",
                "Student",
                "Daily Wage Worker",
                "Self Employed",
                "Government Employee",
                "Private Employee",
                "Business Owner",
                "Unemployed",
                "Homemaker",
                "Other",
              ]}
              placeholder="Select occupation"
            />

            {/* FAMILY MEMBERS */}
            <Field
              label="Family Members"
              name="familyMembers"
              type="number"
              value={formData.familyMembers}
              onChange={handleChange}
              placeholder="Example: 4"
              icon={Users}
              required
              min="1"
            />
          </div>

          {/* INFO */}
          <div className="mt-6 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-semibold">
                Tip:
              </span>{" "}
              Provide accurate information. Some schemes have
              gender, income, occupation, age, state and category
              specific eligibility requirements.
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full flex items-center justify-center gap-2
            bg-emerald-500 hover:bg-emerald-400
            disabled:opacity-50 disabled:cursor-not-allowed
            text-slate-950 font-bold py-3.5 rounded-xl transition"
          >
            <Search className="w-4 h-4" />

            {loading
              ? "Checking eligibility..."
              : "Find Eligible Schemes"}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* RESULTS */}
        {results.length > 0 && (
          <section className="mt-8 pb-10">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">
                Eligibility Results
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {results.length} schemes evaluated against your
                profile.
              </p>
            </div>

            <div className="space-y-4">
              {results.map(({ scheme, evaluation }) => (
                <div
                  key={scheme._id || scheme.slug}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-white">
                          {scheme.name || scheme.title}
                        </h3>

                        <StatusBadge
                          status={evaluation.status}
                        />
                      </div>

                      <p className="text-sm text-slate-500 mt-2">
                        {scheme.description ||
                          "Government welfare scheme and benefits."}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {scheme.category && (
                          <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400">
                            {scheme.category}
                          </span>
                        )}

                        {scheme.state && (
                          <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400">
                            {scheme.state}
                          </span>
                        )}

                        {scheme.level && (
                          <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400">
                            {scheme.level}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* MATCH */}
                    <div className="md:text-right shrink-0">
                      <p className="text-2xl font-bold text-emerald-400">
                        {evaluation.matchPercentage}%
                      </p>

                      <p className="text-[11px] text-slate-600">
                        Profile Match
                      </p>
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        evaluation.status === "Eligible"
                          ? "bg-emerald-500"
                          : evaluation.status ===
                            "Partially Eligible"
                          ? "bg-amber-400"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${evaluation.matchPercentage}%`,
                      }}
                    />
                  </div>

                  {/* PASSED CRITERIA */}
                  {evaluation.criteriaResults?.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs text-slate-500 mb-2">
                        Criteria evaluation
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {evaluation.criteriaResults
                          .filter((x) => x.passed)
                          .slice(0, 5)
                          .map((x, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 text-[11px]
                              bg-emerald-500/10
                              text-emerald-400
                              px-2.5 py-1.5 rounded-lg"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              {formatFieldName(x.field)}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW */}
                  <Link
                    to={`/schemes/${scheme.slug}`}
                    className="inline-flex items-center gap-2 mt-5 text-sm text-emerald-400 hover:text-emerald-300 transition"
                  >
                    View scheme details →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/* =========================
   TEXT INPUT FIELD
========================= */

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  required = false,
  min,
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-2">
      {label}
      {required && (
        <span className="text-emerald-400 ml-1">*</span>
      )}
    </label>

    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
      )}

      <input
        required={required}
        min={min}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          bg-[#0b1724]
          border border-slate-800
          rounded-xl
          ${Icon ? "pl-11" : "px-4"}
          pr-4
          py-3
          text-sm
          text-slate-200
          placeholder:text-slate-600
          outline-none
          focus:border-emerald-500/50
          focus:ring-2
          focus:ring-emerald-500/10
          transition
        `}
      />
    </div>
  </div>
);

/* =========================
   SELECT FIELD
========================= */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  required = false,
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-2">
      {label}
      {required && (
        <span className="text-emerald-400 ml-1">*</span>
      )}
    </label>

    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none z-10" />
      )}

      <select
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full
          appearance-none
          bg-[#0b1724]
          border border-slate-800
          rounded-xl
          ${Icon ? "pl-11" : "px-4"}
          pr-10
          py-3
          text-sm
          ${
            value
              ? "text-slate-200"
              : "text-slate-600"
          }
          outline-none
          focus:border-emerald-500/50
          focus:ring-2
          focus:ring-emerald-500/10
          transition
          cursor-pointer
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#0b1724] text-slate-200"
          >
            {option}
          </option>
        ))}
      </select>

      {/* Arrow */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.5 7.5L10 12l4.5-4.5" />
        </svg>
      </div>
    </div>
  </div>
);

/* =========================
   STATUS BADGE
========================= */

const StatusBadge = ({ status }) => {
  if (status === "Eligible") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
        <CheckCircle2 className="w-3 h-3" />
        Eligible
      </span>
    );
  }

  if (status === "Partially Eligible") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">
        <Clock3 className="w-3 h-3" />
        Partial Match
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
      <XCircle className="w-3 h-3" />
      Ineligible
    </span>
  );
};

/* =========================
   FIELD NAME FORMATTER
========================= */

const formatFieldName = (field) => {
  if (!field) return "Criterion";

  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
};

export default OnboardingPage;