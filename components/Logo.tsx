export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            श्री श्याम
          </div>
        </div>
      </div>
      <div>
        <div className="text-lg font-bold text-primary">
          Shree Shyam
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Advertising & Marketing Agency – Jaipur
        </div>
      </div>
    </div>
  );
}
