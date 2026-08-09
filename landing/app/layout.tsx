import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "College Election Management System – AI-Powered Campus Elections",
  description:
    "A secure and intelligent SaaS platform for managing college elections, organizing campaign teams, collecting survey responses, and analyzing campaign progress through interactive dashboards.",
  keywords: [
    "college election",
    "campus election management",
    "student election system",
    "election analytics",
    "volunteer management",
    "survey collection",
    "campus campaign",
  ],
  authors: [{ name: "College Election Management System" }],
  openGraph: {
    title: "College Election Management System",
    description:
      "AI-Powered platform for managing college elections with real-time analytics, volunteer management, and campaign tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Election Management System",
    description:
      "AI-Powered platform for managing college elections with real-time analytics.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ background: "#030712", color: "#ffffff", fontFamily: "Inter, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
