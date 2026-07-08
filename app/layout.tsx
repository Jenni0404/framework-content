import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Framework Content",
  description: "Générateur de gabarits IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
