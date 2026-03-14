"use client";

import { FormEvent, useState } from "react";

const services = [
  {
    name: "Pamphlet Distribution",
    key: "PAMPHLET_DISTRIBUTION",
    description:
      "Door-to-door leaflet distribution with route planning, society mapping and photo proof.",
    sample: "Ideal for coaching institutes, hospitals, retail stores and new launches.",
    combos: ["Pamphlet + Wall Posters", "Pamphlet + Society Standee"]
  },
  {
    name: "Flex Banners",
    key: "FLEX_BANNER",
    description:
      "High-visibility flex banners at key junctions, markets and residential entry points.",
    sample: "Best for brand awareness and festival / seasonal offers.",
    combos: ["Flex + Electric Pole Ads", "Flex + Pamphlet Distribution"]
  },
  {
    name: "Electric Pole Ads",
    key: "ELECTRIC_POLE_AD",
    description:
      "Pole-mounted boards across main roads and in front of target societies.",
    sample: "Great for continuous visibility on routes like Tonk Road and Jagatpura.",
    combos: ["Pole Ads + Sunpack Sheets", "Pole Ads + Wall Posters"]
  },
  {
    name: "Sunpack Sheets",
    key: "SUNPACK_SHEET",
    description:
      "Durable sunpack boards for longer campaigns around colleges, markets and societies.",
    sample: "Perfect for coaching, political and institutional branding.",
    combos: ["Sunpack + Wall Posters", "Sunpack + Pamphlet Distribution"]
  },
  {
    name: "Wall Posters",
    key: "WALL_POSTER",
    description:
      "Strategic wall posters in high-footfall lanes, markets and outside institutes.",
    sample: "Excellent for events, admissions, and short-term offers.",
    combos: ["Wall Posters + Pamphlets", "Wall Posters + Flex Banners"]
  },
  {
    name: "Local Promotion Packages",
    key: "LOCAL_PROMOTION_PACKAGE",
    description:
      "End-to-end campaign planning with a mix of media, manpower and reporting.",
    sample:
      "Share your budget and area, and we will design the best combination for you.",
    combos: ["Budget-based Mix", "Area-focused Campaign"]
  }
];

type ServiceKey =
  | "PAMPHLET_DISTRIBUTION"
  | "FLEX_BANNER"
  | "ELECTRIC_POLE_AD"
  | "SUNPACK_SHEET"
  | "WALL_POSTER"
  | "LOCAL_PROMOTION_PACKAGE";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<{
    name: string;
    key: ServiceKey;
  } | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientMobile, setClientMobile] = useState("");
  const [clientArea, setClientArea] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedService) return;
    setError(null);
    setMessage(null);

    if (!clientName.trim() || !clientMobile.trim() || !clientArea.trim()) {
      setError("Please fill in name, mobile and area.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientMobile,
          clientArea,
          serviceType: selectedService.key,
          budget: budget ? Number(budget) : undefined
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not create order. Please try again.");
      }

      setMessage(
        "Thank you! Your service request has been submitted. Our team will contact you with confirmation and recommendations."
      );
      setClientName("");
      setClientMobile("");
      setClientArea("");
      setBudget("");
      setSelectedService(null);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page space-y-6 pb-16">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-100">Services</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Choose from focused services or curated packages. Our recommendation engine
          (to be connected in backend) will help you pick the right mix based on{" "}
          <span className="font-semibold">location, audience and budget</span>.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-100">
                {service.name}
              </h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] text-primary">
                Jaipur · Local
              </span>
            </div>
            <p className="text-xs">{service.description}</p>
            <p className="text-[11px] text-slate-400">{service.sample}</p>
            <div className="space-y-1 text-[11px]">
              <p className="font-semibold text-slate-200">
                Suggested Combos (Recommendation Engine):
              </p>
              <ul className="list-inside list-disc space-y-1">
                {service.combos.map((combo) => (
                  <li key={combo}>{combo}</li>
                ))}
              </ul>
            </div>
            <button
              className="mt-2 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
              onClick={() =>
                setSelectedService({ name: service.name, key: service.key as ServiceKey })
              }
            >
              Request this Service
            </button>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-dashed border-primary/60 bg-slate-900/60 p-5 text-xs text-slate-300">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">
          Smart Suggestions (Coming Soon)
        </h2>
        <p>
          Once the backend is fully wired, you will be able to enter your{" "}
          <span className="font-semibold">target area, audience and budget</span>, and
          our recommendation engine will propose:
        </p>
        <ul className="mt-2 grid gap-1 md:grid-cols-3">
          <li>Best media mix for your budget</li>
          <li>Location-based routes & hotspots</li>
          <li>Festive / seasonal add-on suggestions</li>
        </ul>
      </section>

      {selectedService && (
        <section className="rounded-2xl border border-primary/60 bg-slate-900/80 p-5 text-xs text-slate-300">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            Request: {selectedService.name}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
                placeholder="Your name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
                placeholder="Mobile / WhatsApp"
                value={clientMobile}
                onChange={(e) => setClientMobile(e.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
                placeholder="Area (e.g. Pratap Nagar)"
                value={clientArea}
                onChange={(e) => setClientArea(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
                placeholder="Approx. budget (optional)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            {message && <p className="text-[11px] text-emerald-400">{message}</p>}
            {error && <p className="text-[11px] text-rose-400">{error}</p>}
          </form>
        </section>
      )}
    </div>
  );
}

