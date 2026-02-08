import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { TripProvider } from "@/components/TripProvider";
import { Preloader } from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Sawariya | Sri Lanka Trip Planner",
  description:
    "Plan Sri Lankan trips with smart routing, local travel buffers, and AI guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=manrope@400,500,600,700&display=swap"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <TripProvider>
          <Preloader />
          {children}
        </TripProvider>
      </body>
    </html>
  );
}
