import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merry Christmas you filthy animal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
