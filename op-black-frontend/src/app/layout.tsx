import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import "../chartDeafults";
import { Chart } from "chart.js";
const inter = Inter({ subsets: ["latin"] });
Chart.defaults.color = "#00000";

export const metadata: Metadata = {
  title: "Blackjack Simulator",
  description: "Simulate blackjack strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
