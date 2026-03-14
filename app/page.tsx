import { Hero } from "../components/Hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <Hero />

      <section className="container-page grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 dark:border-slate-200 dark:bg-white/60">
          <h2 className="mb-2 text-sm font-semibold text-slate-100 dark:text-slate-900">
            For Direct Clients
          </h2>
          <p className="mb-4 text-xs text-slate-300 dark:text-slate-600">
            Plan and track your local promotions – from pamphlet drops to flex
            banners – in real-time.
          </p>
          <Link href="/services" className="text-xs font-semibold text-primary">
            Explore services →
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 dark:border-slate-200 dark:bg-white/60">
          <h2 className="mb-2 text-sm font-semibold text-slate-100 dark:text-slate-900">
            For Team Boys
          </h2>
          <p className="mb-4 text-xs text-slate-300 dark:text-slate-600">
            Accept work, upload completion photos and see your earnings wallet in
            one simple app.
          </p>
          <Link href="/login" className="text-xs font-semibold text-primary">
            Login to portal →
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 dark:border-slate-200 dark:bg-white/60">
          <h2 className="mb-2 text-sm font-semibold text-slate-100 dark:text-slate-900">
            For Printing Partners
          </h2>
          <p className="mb-4 text-xs text-slate-300 dark:text-slate-600">
            Get regular printing jobs with transparent commissions, invoices and
            payouts.
          </p>
          <Link href="/partner-join" className="text-xs font-semibold text-primary">
            Join as partner →
          </Link>
        </div>
      </section>

      <section className="container-page">
        <h2 className="mb-4 text-sm font-semibold text-slate-100 dark:text-slate-900">
          Recent Work Highlights
        </h2>
        <div className="grid gap-4 text-xs text-slate-300 md:grid-cols-3 dark:text-slate-600">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 dark:border-slate-200 dark:bg-white/60">
            Pamphlet distribution for coaching institute in Pratap Nagar – 10,000
            leaflets, 3 days, 100% coverage report.
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 dark:border-slate-200 dark:bg-white/60">
            Flex & pole campaign on Tonk Road for retail brand – 35 locations with
            geo-tagged photos.
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 dark:border-slate-200 dark:bg-white/60">
            Sunpack & wall posters around Jagatpura & Sitapura for college festival
            promotions.
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:flex-row md:items-center dark:border-slate-200 dark:bg-white/60">
        <div className="space-y-1 text-xs text-slate-300 dark:text-slate-600">
          <h2 className="text-sm font-semibold text-slate-100 dark:text-slate-900">
            Need help deciding the right package?
          </h2>
          <p>
            Our recommendation engine (coming in backend) will suggest the best
            media mix based on your area, budget and audience.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Tell us your budget
        </Link>
      </section>
    </div>
  );
}

