"use client";

import Link from "next/link";
import { useAuth } from "../../components/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user.role ?? "admin";

  return (
    <div className="container-page space-y-6 pb-16">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Partner Portal</h1>
          <p className="text-sm text-slate-300">
            Role-based dashboard. You are currently signed in as{" "}
            <span className="font-semibold text-primary">
              {user.role ? user.role.replace("-", " ") : "guest"}
            </span>
            .
          </p>
        </div>
        {!user.role && (
          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-primary hover:text-primary"
          >
            Go to Login
          </Link>
        )}
      </header>

      {role === "admin" && <AdminView />}
      {role === "team-boy" && <TeamBoyView />}
      {role === "printing-shop" && <PrintingShopView />}
    </div>
  );
}

function StatCard(props: { label: string; value: string; accent?: "primary" | "green" }) {
  const accentClass =
    props.accent === "green"
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-primary/10 text-primary";
  return (
    <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
      <p className="text-slate-300">{props.label}</p>
      <p className={`inline-flex rounded-full px-2 py-1 text-[11px] ${accentClass}`}>
        {props.value}
      </p>
    </div>
  );
}

function AdminView() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Orders (Month)" value="128" />
        <StatCard label="Completed" value="96" accent="green" />
        <StatCard label="Pending Approvals" value="12" />
        <StatCard label="Payouts Due" value="₹48,500" />
      </section>
      <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">Assign Work</h2>
          <p>
            Select an order, assign a Team Boy and printing partner. This will trigger
            auto-notifications and update their dashboards.
          </p>
          <form className="space-y-3">
            <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary">
              <option>Order #SSA-1023 · Pamphlets · Pratap Nagar</option>
              <option>Order #SSA-1024 · Flex · Tonk Road</option>
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary">
                <option>Assign Team Boy</option>
                <option>Rohit · Zone A</option>
                <option>Amit · Zone B</option>
              </select>
              <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary">
                <option>Assign Printing Partner</option>
                <option>XYZ Prints · Jagatpura</option>
                <option>ABC Flex House · Sanganer</option>
              </select>
            </div>
            <button className="w-full rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark">
              Assign & Notify
            </button>
          </form>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">
            Recent Orders & Audit Log
          </h2>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <div>
                <p className="font-semibold text-slate-100">
                  SSA-1023 · Pamphlets · Pratap Nagar
                </p>
                <p className="text-slate-400">
                  Assigned to Rohit · Printed at XYZ Prints
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-400">
                Completed
              </span>
            </div>
            <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <p className="font-semibold text-slate-100">Audit Log</p>
              <ul className="space-y-1 text-slate-400">
                <li>10:32 · Admin approved completion for SSA-1023</li>
                <li>10:10 · Team Boy Rohit uploaded 12 photos</li>
                <li>09:45 · Printing partner XYZ marked order as printed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamBoyView() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Today&apos;s Tasks" value="4 routes" />
        <StatCard label="Completed this week" value="22 routes" accent="green" />
        <StatCard label="Wallet Balance" value="₹7,250" />
      </section>
      <section className="grid gap-6 md:grid-cols-[3fr,2fr]">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">
            Accept & Update Work
          </h2>
          <div className="space-y-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="font-semibold text-slate-100">
                Route #A12 · Pamphlets · Pratap Nagar
              </p>
              <p className="text-[11px] text-slate-400">
                3 societies · 1200 flats · Start between 9-11 AM
              </p>
              <div className="mt-2 flex gap-2">
                <button className="rounded-lg bg-primary px-3 py-1 text-[11px] font-semibold text-white hover:bg-primary-dark">
                  Accept
                </button>
                <button className="rounded-lg border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-primary hover:text-primary">
                  View Details
                </button>
              </div>
            </div>
          </div>
          <form className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-200">
              Upload Completion Photos
            </p>
            <input
              type="file"
              multiple
              className="w-full rounded-lg border border-dashed border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none file:mr-3 file:rounded-md file:border-none file:bg-primary file:px-3 file:py-1 file:text-[11px] file:font-semibold file:text-white"
            />
            <button className="w-full rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark">
              Submit for Approval
            </button>
          </form>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">
            Earnings & Wallet (Auto)
          </h2>
          <ul className="space-y-1 text-[11px]">
            <li>+ ₹350 · Route #A10 · Approved yesterday</li>
            <li>+ ₹420 · Route #A09 · Approved 2 days ago</li>
            <li>Pending · 3 routes · Awaiting admin approval</li>
          </ul>
          <button className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:border-primary hover:text-primary">
            Download Monthly Report
          </button>
        </div>
      </section>
    </div>
  );
}

function PrintingShopView() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Orders this Month" value="38" />
        <StatCard label="Completed" value="31" accent="green" />
        <StatCard label="Commission Wallet" value="₹18,900" />
      </section>
      <section className="grid gap-6 md:grid-cols-[3fr,2fr]">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">
            Add Client Print Job
          </h2>
          <form className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
                placeholder="Client Name"
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
                placeholder="Mobile"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary">
                <option>Service Type</option>
                <option>Pamphlet Printing</option>
                <option>Flex Banner</option>
                <option>Sunpack</option>
              </select>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
                placeholder="Quantity / Size"
              />
            </div>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none focus:border-primary"
              placeholder="Job details, material, deadlines…"
            />
            <input
              type="file"
              className="w-full rounded-lg border border-dashed border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none file:mr-3 file:rounded-md file:border-none file:bg-primary file:px-3 file:py-1 file:text-[11px] file:font-semibold file:text-white"
            />
            <button className="w-full rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark">
              Submit Job to Admin
            </button>
          </form>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">
            Commissions & Reports
          </h2>
          <ul className="space-y-1 text-[11px]">
            <li>+ ₹1,250 · Flex · Tonk Road · Paid</li>
            <li>+ ₹850 · Pamphlets · Pratap Nagar · Pending</li>
            <li>+ ₹1,600 · Sunpack · Jagatpura · Approved</li>
          </ul>
          <button className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:border-primary hover:text-primary">
            Download Monthly Statement
          </button>
        </div>
      </section>
    </div>
  );
}

