export default function AboutPage() {
  return (
    <div className="container-page space-y-6 pb-16">
      <h1 className="text-2xl font-semibold text-slate-100">About Shree Shyam Advertising</h1>
      <p className="max-w-3xl text-sm text-slate-300">
        Shree Shyam Advertising & Marketing Agency is a Jaipur-focused offline marketing
        specialist, led by{" "}
        <span className="font-semibold text-primary">Mr. Manjeet Gour</span>. We help
        brands, institutes and businesses reach customers across Pratap Nagar, Jagatpura,
        Sitapura, Sanganer and Tonk Road with highly targeted local campaigns.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">Our Mission</h2>
          <p>
            To make offline advertising as measurable, transparent and automated as
            digital marketing – with clear reporting, live tracking and fair payouts for
            every partner involved.
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs">
            <li>Transparent reporting for every client order</li>
            <li>Fair, on-time payouts for team boys and print partners</li>
            <li>Smart planning based on areas, budgets and seasons</li>
          </ul>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">Areas We Serve</h2>
          <p className="text-xs">
            Our team is active on-ground every day in:
          </p>
          <ul className="mt-1 grid grid-cols-2 gap-1 text-xs">
            <li>Pratap Nagar</li>
            <li>Jagatpura</li>
            <li>Sitapura</li>
            <li>Sanganer</li>
            <li>Tonk Road</li>
            <li>Nearby societies & markets</li>
          </ul>
          <p className="mt-2 text-xs">
            For large campaigns, we can extend to nearby areas with dedicated teams and
            special routing.
          </p>
        </div>
      </div>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">Founder&apos;s Note</h2>
        <p className="text-xs">
          &quot;I started Shree Shyam Advertising to bring structure and honesty into
          local promotion work. Every leaflet, flex and poster should be accounted for –
          with proper proof of work. This portal is our step towards complete
          transparency and automation for clients and partners.&quot; –{" "}
          <span className="font-semibold text-primary">Manjeet Gour</span>
        </p>
      </section>
    </div>
  );
}

