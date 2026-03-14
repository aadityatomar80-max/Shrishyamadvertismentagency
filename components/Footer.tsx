export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 dark:border-slate-200 dark:bg-white/90">
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between dark:text-slate-600">
        <p>
          © {new Date().getFullYear()} Shree Shyam Advertising & Marketing Agency,
          Jaipur. All rights reserved.
        </p>
        <p className="space-x-3">
          <span>Pratap Nagar · Jagatpura · Sitapura · Sanganer · Tonk Road</span>
        </p>
      </div>
    </footer>
  );
}

