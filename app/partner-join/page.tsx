"use client";

import { FormEvent, useState } from "react";
import { useNotification } from "../../components/NotificationContext";

export default function PartnerJoinPage() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState<"TEAM_BOY" | "PRINTING_SHOP" | "AGENCY">("TEAM_BOY");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!fullName.trim() || !mobile.trim() || !area.trim()) {
      setError("Please fill in name, mobile and area.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          mobile,
          area,
          type,
          extra
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong, please try again.");
      }

      const data = await res.json();

      // Show success notification
      showNotification({
        type: "success",
        title: "Partner Application Submitted!",
        message: "Your application has been received and is under review.",
        details: {
          "Partner Type": type.replace("_", " "),
          "Area": area,
          "Status": "Pending Approval"
        },
        duration: 6000
      });

      setMessage(
        "Thank you! Your partner application has been submitted. You will be contacted by our team shortly."
      );
      setFullName("");
      setMobile("");
      setArea("");
      setExtra("");
    } catch (err: any) {
      setError(err.message ?? "Could not submit application.");
      
      // Show error notification
      showNotification({
        type: "error",
        title: "Application Failed",
        message: err.message || "Please check your details and try again",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page space-y-6 pb-16">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Join as Partner</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Become a part of Shree Shyam Advertising network. We work with Team Boys,
          Printing Shops and Agencies across Jaipur.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-secondary p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
              Mobile Number (WhatsApp)
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              placeholder="+91-XXXXXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
              Area / Locality
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              placeholder="Pratap Nagar / Jagatpura / ..."
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
              Partner Type
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "TEAM_BOY" | "PRINTING_SHOP" | "AGENCY")
              }
            >
              <option value="TEAM_BOY">Team Boy</option>
              <option value="PRINTING_SHOP">Printing Shop</option>
              <option value="AGENCY">Agency / Sub-Partner</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
            ID Proof (Aadhaar / PAN / Shop Reg.)
          </label>
          <input
            type="file"
            className="w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none file:mr-3 file:rounded-md file:border-none file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
            Any Additional Details
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            placeholder="For example: experience, printing capacity, daily availability…"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Submitting..." : "Submit Partner Application"}
        </button>
        {message && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{message}</p>
        )}
        {error && (
          <p className="text-[11px] text-red-600 dark:text-rose-400">{error}</p>
        )}
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Once backend email/SMS is connected, this form will trigger an{" "}
          <span className="font-semibold">auto-confirmation email</span> to you and a{" "}
          <span className="font-semibold">notification for Admin</span>.
        </p>
      </form>
    </div>
  );
}

