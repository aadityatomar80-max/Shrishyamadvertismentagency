import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AuthProvider } from "../components/AuthContext";
import { LanguageProvider } from "../components/LanguageContext";
import { ThemeProvider } from "../components/ThemeContext";
import { LiveChat } from "../components/LiveChat";
import { NotificationProvider } from "../components/NotificationContext";
import { NotificationContainer } from "../components/Notification";

export const metadata: Metadata = {
  title: "Shree Shyam Advertising & Marketing Agency",
  description:
    "Professional advertising & marketing services in Jaipur – Pratap Nagar, Jagatpura, Sitapura, Sanganer, Tonk Road."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ThemeScript removed - site uses white theme only */}
      </head>
      <body className="flex min-h-screen flex-col bg-white text-slate-900">
        <NotificationProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <NotificationContainer />
                <Navbar />
                <main className="flex-1">{children}</main>
                {/* Floating WhatsApp / Live chat placeholder */}
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-6 right-6 hidden rounded-full bg-emerald-500 px-4 py-3 text-xs font-semibold text-white shadow-xl shadow-emerald-500/40 hover:bg-emerald-600 md:inline-flex"
                >
                  Chat on WhatsApp
                </a>
                <Footer />
                <LiveChat provider="tawk" />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

