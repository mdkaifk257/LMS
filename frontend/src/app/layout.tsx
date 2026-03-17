import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnFlow LMS",
  description: "Modern Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Sidebar />
        <div className="p-4 sm:ml-64 pt-20 h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
