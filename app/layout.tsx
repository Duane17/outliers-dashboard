import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedShell } from "@/components/auth/ProtectedShell";

export const metadata: Metadata = {
  title: "Outliers Dashboard",
  description:
    "Outliers helps organizations unlock insights using encrypted data collaboration powered by SMPC.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body>
        <AuthProvider>
          <ProtectedShell>{children}</ProtectedShell>
        </AuthProvider>
      </body>
    </html>
  );
}
