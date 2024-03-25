import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Music Player",
  description: "This is a rendered App made by Next.js, Convex, and Clerk",
};

/**
 * Generates the root layout for the application.
 *
 * @param {Readonly<{ children: React.ReactNode; }>} children - The React nodes to be rendered inside the layout.
 * @return {React.ReactNode} The root layout HTML structure with the provided children.
 */
export default function RootLayout(
  { children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider> {children} </ConvexClientProvider>
      </body>
    </html>
  );
}
