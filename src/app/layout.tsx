import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { NavBar } from "@/components/NavBar";
import { fontBody, fontDisplay, fontLabel } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Vellum — Money Transfer Quotes",
  description:
    "An editorial workspace for international money transfer quotes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontLabel.variable}`}
    >
      <body>
        <Providers>
          <div className="min-h-screen bg-surface">
            <NavBar />
            <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10 sm:px-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
