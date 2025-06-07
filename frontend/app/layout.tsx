import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { Auth0AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudentsAdda - A Student's Companion",
  description: "A platform for students to Find best Libraries",
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
        <Auth0Provider>
          <Auth0AuthProvider>
            <div className="flex flex-col justify-center items-center bg-[#ede3db] min-h-screen">
              <Navbar />
              <div className="min-h-[100vh]">
              {children}
              </div>
              <Toaster />
              <Footer />
            </div>
          </Auth0AuthProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
