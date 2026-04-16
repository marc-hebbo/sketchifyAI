import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/theme/provider";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/convex/provider";
import ReduxProvider from "@/redux/provider";
import Preloader from "@/components/preloader";
import AuthSessionSync from "@/components/auth/session-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sketch to UI",
  description: "Convert sketches into UI-ready design systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider preloadedState={{}}>
              <AuthSessionSync>
                <Preloader>
                  {children}
                </Preloader>
              </AuthSessionSync>
            </ReduxProvider>
            <Toaster />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
