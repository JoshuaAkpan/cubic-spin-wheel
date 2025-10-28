import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";

const musticaPro = localFont({
  src: [
    { path: "../../public/fonts/MusticaPro-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/MusticaPro-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/MusticaPro-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/MusticaPro-SemiBold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-musticapro",
});

export const metadata: Metadata = {
  title: "Cubic - Spin The Wheel",
  description: "Cubic Customer Service Week 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${musticaPro.className} antialiased`}>{children}</body>
    </html>
  );
}
