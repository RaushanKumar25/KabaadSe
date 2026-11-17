import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationTransitionProvider } from "@/context/NavigationTransitionContext";
import GlobalSplashLoader from "@/components/GlobalSplashLoader";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kabaadse_theme')||'dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100 transition-colors duration-200 selection:bg-emerald-600 selection:text-white`}
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
