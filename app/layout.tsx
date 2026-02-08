import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TripProvider } from "@/components/TripProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

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
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${playfair.variable} antialiased`}
      >
        <TripProvider>{children}</TripProvider>
      </body>
    </html>
  );
}
