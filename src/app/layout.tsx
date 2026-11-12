import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,600,500,400&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-[#2e8b20] selection:text-white">
        {children}
      </body>
    </html>
  );
}
