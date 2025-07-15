import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog Summarizer - AI-Powered Content Analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-rose-900 via-fuchsia-800 to-purple-800 font-sans antialiased text-white">
          <header className="relative border-b border-pink-300/40">
            <div className="container relative mx-auto px-4 py-14"></div>
          </header>

          <main className="container mx-auto px-4 py-8">{children}</main>

          <footer className="border-t border-pink-300/40">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-white/70">
              <p>© 2025 Aimen Durrani Blog Summarizer</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
