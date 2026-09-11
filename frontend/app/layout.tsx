import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIS Saathi | Bureau of Indian Standards Official AI Assistant | Government of India",
  description:
    "Statutory AI Assistant grounded in official Bureau of Indian Standards (BIS) publications, Indian Standards, QCOs, Hallmarking (HUID), and LRS Laboratory testing networks.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans selection:bg-orange-100 selection:text-orange-900 relative">
        {/* Ambient Aurora Background Glow */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-orb-1"></div>
          <div className="aurora-orb-2"></div>
          <div className="aurora-orb-3"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
