export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getInitialTheme() {
              const stored = localStorage.getItem('ssa-portal-theme');
              if (stored === 'light' || stored === 'dark') {
                return stored;
              }
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            
            const theme = getInitialTheme();
            const root = document.documentElement;
            
            if (theme === 'dark') {
              root.classList.add('dark');
              document.body.classList.add('bg-slate-950', 'text-slate-50');
              document.body.classList.remove('bg-white', 'text-slate-900');
            } else {
              root.classList.remove('dark');
              document.body.classList.add('bg-white', 'text-slate-900');
              document.body.classList.remove('bg-slate-950', 'text-slate-50');
            }
          })();
        `,
      }}
    />
  );
}
