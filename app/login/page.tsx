"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role, useAuth } from "../../components/AuthContext";

export default function LoginPage() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [role, setRole] = useState<Role>("admin");
  const [mobile, setMobile] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  return (
    <div className="container-page flex max-w-md flex-col gap-6 pb-16">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-100">Login</h1>
        <p className="text-sm text-slate-300">
          Partners and Admin can sign in with mobile + OTP. This page is wired for UI;
          you can connect it to your preferred OTP / SMS provider.
        </p>
      </header>
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            className={`rounded-lg border px-2 py-2 ${
              role === "admin"
                ? "border-primary bg-primary/20 text-primary"
                : "border-slate-700 text-slate-200"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
          <button
            className={`rounded-lg border px-2 py-2 ${
              role === "team-boy"
                ? "border-primary bg-primary/20 text-primary"
                : "border-slate-700 text-slate-200"
            }`}
            onClick={() => setRole("team-boy")}
          >
            Team Boy
          </button>
          <button
            className={`rounded-lg border px-2 py-2 ${
              role === "printing-shop"
                ? "border-primary bg-primary/20 text-primary"
                : "border-slate-700 text-slate-200"
            }`}
            onClick={() => setRole("printing-shop")}
          >
            Printing Shop
          </button>
        </div>
        {step === "mobile" ? (
          <form
            className="space-y-4 text-xs"
            onSubmit={(e) => {
              e.preventDefault();
              if (!mobile.trim()) return;
              setStep("otp");
            }}
          >
            <div>
              <label className="mb-1 block text-slate-300">Mobile Number</label>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-primary"
                placeholder="+91-XXXXXXXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-3 py-2 font-semibold text-white hover:bg-primary-dark"
            >
              Send OTP
            </button>
            <p className="text-[11px] text-slate-400">
              This will call your backend API to send an SMS OTP. You can also add
              WhatsApp OTP support.
            </p>
          </form>
        ) : (
          <form
            className="space-y-4 text-xs"
            onSubmit={(e) => {
              e.preventDefault();
              // Mock OTP success – in real app, verify via backend
              if (!mobile.trim()) return;
              login({ role, mobile });
              router.push("/dashboard");
            }}
          >
            <div>
              <label className="mb-1 block text-slate-300">Enter OTP</label>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-primary"
                placeholder="6-digit code"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-3 py-2 font-semibold text-white hover:bg-primary-dark"
            >
              Verify & Login
            </button>
            <button
              type="button"
              onClick={() => setStep("mobile")}
              className="w-full rounded-lg border border-slate-700 px-3 py-2 font-semibold text-slate-200 hover:border-primary hover:text-primary"
            >
              Change Mobile Number
            </button>
            <p className="text-[11px] text-slate-400">
              On success, route Admin to full dashboard and Partners to their respective
              panels with wallet, orders and reports.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

