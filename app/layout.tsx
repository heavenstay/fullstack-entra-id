"use client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/authConfig";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </MsalProvider>
  );
}
