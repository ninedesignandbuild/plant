import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Caveat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const script = Caveat({ subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "NYNI Nursery — Grow Green. Live Beautiful.", template: "%s | NYNI Nursery" },
  description: "Fresh plants, beautiful planters and expert guidance for a greener, happier home in Hyderabad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body><CartProvider><Navbar /><main>{children}</main><Footer /></CartProvider></body>
    </html>
  );
}
