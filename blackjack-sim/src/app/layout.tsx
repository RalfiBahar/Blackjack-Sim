import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import "../chartDeafults";
import { Chart } from "chart.js";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });
Chart.defaults.color = "#00000";

export const metadata: Metadata = {
  title: "Blackjack Simulator",
  description:
    "Simulate your blackjack strategies. Customize betting strategies and see relevant statistics and graphs.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Simulate your blackjack strategies. Customize betting strategies and see relevant statistics and graphs."
        />
        <meta
          name="keywords"
          content="Blackjack, Blackjack simulator, Blackjack strategies, Card game, Casino, Online blackjack, Blackjack tactics, Blackjack tips, Card counting, Blackjack rules, Casino games, Blackjack training, Blackjack practice, Gambling, Blackjack betting, Blackjack tutorial, Casino strategy, Blackjack app, Blackjack game, Virtual blackjack, Math, Probability, Statistics, Simulation, Mathematical modeling, Probability theory, Statistical analysis, Monte Carlo simulation, Game theory, Predictive modeling, Risk assessment, Statistical simulation, Probability simulation, Decision analysis, Random variables, Data analysis, Stochastic processes, Mathematical probability, Statistical modeling, Simulation software"
        />
        <meta name="author" content="Your Name" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://www.blackjack-sim.com/",
            name: "Blackjack Simulator",
            description: "Simulate blackjack strategies.",
            author: {
              "@type": "Person",
              name: "Ralfi Bahar",
            },
          })}
        </script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
