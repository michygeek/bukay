import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bukay Global Services Limited | Building · Construction · Engineering",
  description:
    "Bukay Global Services Limited — an indigenous engineering construction company specializing in Civil, Highway, Mechanical, Electrical and Telecommunications engineering across Nigeria.",
  keywords: "construction Nigeria, civil engineering, road construction, building construction, electrical engineering, telecom sites, Bukay Global Services",
  openGraph: {
    title: "Bukay Global Services Limited",
    description: "Indigenous Engineering Construction Company — Building Nigeria's Infrastructure",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
