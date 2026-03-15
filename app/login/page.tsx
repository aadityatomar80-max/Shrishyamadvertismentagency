"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role, useAuth } from "../../components/AuthContext";
import { useNotification } from "../../components/NotificationContext";

export default function LoginPage() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [role, setRole] = useState<Role>("admin");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!mobile.trim()) {
      setError("Please enter your mobile number");
      return;
    }

    // Validate mobile number
    const mobileRegex = /^[0-9]{10}$/;
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!mobileRegex.test(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleanMobile })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep("otp");
      
      // Show success notification
      showNotification({
        type: "info",
        title: "OTP Sent",
        message: `Verification code sent to ${cleanMobile}`,
        duration: 5000
      });
      
      // For demo, show the OTP
      if (data.demoOtp) {
        setError(`Demo OTP: ${data.demoOtp} (In production, this will be sent via SMS)`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      
      // Show error notification
      showNotification({
        type: "error",
        title: "Failed to Send OTP",
        message: err.message || "Please check your mobile number and try again",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      const cleanMobile = mobile.replace(/\D/g, '');
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mobile: cleanMobile, 
          password: otp, // Using OTP as password for simplicity
          role 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Login successful
      login({ role: data.user.role.toLowerCase().replace('_', '-') as Role, mobile: data.user.mobile });
      
      // Show success notification
      showNotification({
        type: "success",
        title: "Login Successful",
        message: `Welcome back, ${data.user.name || data.user.mobile}!`,
        duration: 3000
      });
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
      
      // Show error notification
      showNotification({
        type: "error",
        title: "Login Failed",
        message: err.message || "Invalid credentials. Please try again.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex max-w-md flex-col gap-6 pb-16">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="text-sm text-slate-600">
          Partners and Admin can sign in with mobile + OTP.
        </p>
      </header>
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-secondary p-6 text-sm">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            className={`rounded-lg border px-2 py-2 ${
              role === "admin"
                ? "border-primary bg-primary/20 text-primary"
                : "border-slate-300 text-slate-700"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
          <button
            className={`rounded-lg border px-2 py-2 ${
              role === "team-boy"
                ? "border-primary bg-primary/20 text-primary"
                : "border-slate-300 text-slate-700"
            }`}
            onClick={() => setRole("team-boy")}
          >
            Team Boy
          </button>
          <button
            className={`rounded-lg border px-2 py-2 ${
              role === "printing-shop"
                ? "border-primary bg-primary/20 text-primary"
                : "border-slate-300 text-slate-700"
            }`}
            onClick={() => setRole("printing-shop")}
          >
            Printing Shop
          </button>
        </div>
        
        {error && (
          <div className={`rounded-lg p-3 text-xs ${error.includes("Demo OTP") ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
            {error}
          </div>
        )}
        
        {step === "mobile" ? (
          <form className="space-y-4 text-xs" onSubmit={handleSendOTP}>
            <div>
              <label className="mb-1 block text-slate-700 font-medium">Mobile Number</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-3 py-2 font-semibold text-white hover:bg-primary-dark disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p className="text-[11px] text-slate-500">
              Demo: Use mobile <strong>9999999999</strong> with OTP <strong>123456</strong>
            </p>
          </form>
        ) : (
          <form className="space-y-4 text-xs" onSubmit={handleVerifyOTP}>
            <div>
              <label className="mb-1 block text-slate-700 font-medium">Enter OTP</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-3 py-2 font-semibold text-white hover:bg-primary-dark disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("mobile");
                setOtp("");
                setError(null);
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:border-primary hover:text-primary"
            >
              Change Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

