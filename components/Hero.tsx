import Link from "next/link";

export function Hero() {
  return (
    <section className="container-page grid gap-10 py-12 md:grid-cols-[3fr,2fr] md:items-center">
      <div className="space-y-6">
        <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Jaipur · Offline Advertising Experts
        </p>
        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-50">
          Reach every{" "}
          <span className="text-primary">
            street & society
          </span>{" "}
          in Jaipur with Shree Shyam Advertising.
        </h1>
        <p className="max-w-xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
          Smart pamphlet distribution, flex & pole ads, sunpack sheets, wall posters
          and hyper-local promotion for Pratap Nagar, Jagatpura, Sitapura, Sanganer
          and Tonk Road – all managed in one simple portal.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/services"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-primary-dark"
          >
            View Services & Pricing
          </Link>
          <Link
            href="/partner-join"
            className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-slate-600 dark:text-slate-300"
          >
            Become a Partner
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            ✅ Live order tracking for clients & partners
          </div>
          <div>✅ Automated invoices, payouts & reports</div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-secondary p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Quick Enquiry (Direct Clients)
        </h2>
        <form className="space-y-3 text-xs">
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            placeholder="Name"
          />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            placeholder="Mobile / WhatsApp"
          />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            placeholder="Location (e.g. Pratap Nagar)"
          />
          <textarea
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            rows={3}
            placeholder="Tell us about your promotion requirement…"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-primary px-3 py-2 font-semibold text-white hover:bg-primary-dark"
          >
            Submit Enquiry
          </button>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            You will get an auto-reply email / WhatsApp once full backend is
            connected.
          </p>
        </form>
      </div>
    </section>
  );
}

