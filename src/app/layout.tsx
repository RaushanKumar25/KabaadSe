import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationTransitionProvider } from "@/context/NavigationTransitionContext";
import GlobalSplashLoader from "@/components/GlobalSplashLoader";

export const metadata: Metadata = {
  title: "KabaadSe | Sell Scrap Online - Doorstep Pickup & Live Rates",
  description:
    "Sell your scrap easily from home with KabaadSe. Transparent digital weighing, instant UPI / Cash payout, and live scrap market rates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased font-sans"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kabaadse_theme')||'dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100 transition-colors duration-200 selection:bg-emerald-600 selection:text-white"
      >
        <ThemeProvider>
          <NavigationTransitionProvider>
            <GlobalSplashLoader />
            {children}
          </NavigationTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
