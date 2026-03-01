import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenialDesk - AI-Powered Customer Feedback Intelligence",
  description: "Collect feedback everywhere. Tell us what actually matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          theme="system"
          position="top-center"
          toastOptions={{
            unstyled: true,
            className: "text-sm flex items-center gap-x-3 w-full p-3 rounded-md",
            classNames: {
              error: 'bg-red-600',
              success: 'bg-green-600',
              warning: 'bg-yellow-400',
              info: 'bg-blue-400',
            },
          }}
        />
      </body>
    </html>
  );
}
