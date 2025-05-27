import "../app/globals.css";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube Search",
  description: "Search and analyze YouTube videos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="stylesheet" href="/app/globals.css" />
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
