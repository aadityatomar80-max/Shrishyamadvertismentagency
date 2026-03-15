"use client";

import { FormEvent, useState } from "react";
import { useNotification } from "../../components/NotificationContext";

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

interface Recommendation {
  mediaMix: Array<{
    service: string;
    share: number;
    estimatedCost: number;
    comment: string;
  }>;
  routes: string[];
  suggestedAddons: string[];
  estimatedReach: number;
  campaignDuration: string;
  notes: string;
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<{
    name: string;
    key: ServiceKey;
  } | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientMobile, setClientMobile] = useState("");
  const [clientArea, setClientArea] = useState("");
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [showSmartForm, setShowSmartForm] = useState(false);
  const { showNotification } = useNotification();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedService) return;
    setError(null);
    setMessage(null);

    if (!clientName.trim() || !clientMobile.trim() || !clientArea.trim()) {
      setError("Please fill in name, mobile and area.");
      return;
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    const cleanMobile = clientMobile.replace(/\D/g, '');
    if (!mobileRegex.test(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientMobile: cleanMobile,
          clientArea,
          serviceType: selectedService.key,
          budget: budget ? Number(budget) : undefined
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not create order. Please try again.");
      }

      const data = await res.json();
      
      // Show order notification with details
      showNotification({
        type: "order",
        title: "New Order Received!",
        details: {
          "Order Name": selectedService.name,
          "Order ID": data.order.publicId,
          "Location": clientArea,
          "Amount": `₹${budget || "TBD"}`,
          "Status": "Pending Confirmation"
        },
        actionLabel: "View Details",
        onAction: () => {
          // Could navigate to order details page
          console.log("View order details:", data.order.publicId);
        },
        duration: 8000
      });
      
      setMessage(
        `Thank you! Your service request has been submitted. Order ID: ${data.order.publicId}. Our team will contact you shortly.`
      );
      
      // Clear form after success
      setTimeout(() => {
        setClientName("");
        setClientMobile("");
        setClientArea("");
        setBudget("");
        setGoal("");
        setAudience("");
        setSelectedService(null);
        setRecommendation(null);
        setMessage(null);
      }, 5000);
      
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      
      // Show error notification
      showNotification({
        type: "error",
        title: "Order Submission Failed",
        message: err.message || "Please check your details and try again",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  async function getSmartRecommendation() {
    if (!clientArea.trim() || !budget) {
      setError("Please enter area and budget to get recommendations.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: clientArea,
          budget: Number(budget),
          goal: goal || undefined,
          audience: audience || undefined
        })
      });

      if (!res.ok) {
        throw new Error("Could not get recommendations.");
      }

      const data = await res.json();
      setRecommendation(data.recommendation.suggestion);
    } catch (err: any) {
      setError(err.message ?? "Failed to get recommendations.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page space-y-6 pb-16">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Services</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Choose from focused services or curated packages. Our recommendation engine
          (to be connected in backend) will help you pick the right mix based on{" "}
          <span className="font-semibold">location, audience and budget</span>.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="space-y-3 rounded-2xl border border-slate-200 bg-secondary p-5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {service.name}
              </h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] text-primary">
                Jaipur · Local
              </span>
            </div>
            <p className="text-xs">{service.description}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{service.sample}</p>
            <div className="space-y-1 text-[11px]">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
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
      <section className="rounded-2xl border border-dashed border-primary/60 bg-secondary p-5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
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
        <section className="rounded-2xl border border-primary/60 bg-secondary p-5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Request: {selectedService.name}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Your name *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Mobile / WhatsApp (10 digits) *"
                value={clientMobile}
                onChange={(e) => setClientMobile(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Area (e.g. Pratap Nagar) *"
                value={clientArea}
                onChange={(e) => setClientArea(e.target.value)}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Approx. budget (INR) *"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
            
            {/* Smart Recommendation Section */}
            <div className="border-t border-slate-300 pt-3 dark:border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Smart Recommendation Engine
                </span>
                <button
                  type="button"
                  onClick={() => setShowSmartForm(!showSmartForm)}
                  className="text-[10px] text-primary hover:underline"
                >
                  {showSmartForm ? "Hide Options" : "Get AI Recommendations"}
                </button>
              </div>
              
              {showSmartForm && (
                <div className="space-y-3 mb-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                      placeholder="Campaign Goal (e.g. brand awareness, launch, admissions)"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                    <input
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-900 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                      placeholder="Target Audience (e.g. students, families, professionals)"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={getSmartRecommendation}
                    disabled={loading || !clientArea || !budget}
                    className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Analyzing..." : "Get Smart Media Mix Recommendation"}
                  </button>
                </div>
              )}
              
              {/* Display Recommendations */}
              {recommendation && (
                <div className="rounded-lg bg-white p-3 dark:bg-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Recommended Media Mix for ₹{budget}
                  </h3>
                  
                  <div className="space-y-2 mb-3">
                    {recommendation.mediaMix.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px]">
                        <span className="font-medium">{item.service.replace(/_/g, ' ')}</span>
                        <div className="text-right">
                          <span className="text-primary font-semibold">₹{item.estimatedCost}</span>
                          <span className="text-slate-500 ml-1">({Math.round(item.share * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-slate-200 pt-2 dark:border-slate-600">
                    <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">Suggested Routes:</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">{recommendation.routes.join(", ")}</p>
                  </div>
                  
                  {recommendation.suggestedAddons.length > 0 && (
                    <div className="border-t border-slate-200 pt-2 mt-2 dark:border-slate-600">
                      <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">Festive/Seasonal Add-ons:</p>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-400 list-disc list-inside">
                        {recommendation.suggestedAddons.map((addon, idx) => (
                          <li key={idx}>{addon}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="border-t border-slate-200 pt-2 mt-2 dark:border-slate-600 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">Est. Reach:</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{recommendation.estimatedReach.toLocaleString()} people</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">Duration:</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">{recommendation.campaignDuration}</p>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 mt-2 italic">{recommendation.notes}</p>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Service Request"}
            </button>
            {message && <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{message}</p>}
            {error && <p className="text-[11px] text-red-600 dark:text-rose-400">{error}</p>}
          </form>
        </section>
      )}
    </div>
  );
}

