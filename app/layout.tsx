import type { Metadata } from "next";
import "./globals.css";
import { initializeDb } from "./lib/dbInit";

export const metadata: Metadata = {
  title: "Car Calendar",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Call the async database initialization
  // await initializeDb();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
