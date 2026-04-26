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

const themeBootstrap = `(function(){try{var t=localStorage.getItem("vellum-theme")||"system";var dark=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(dark)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontLabel.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Apply theme class before paint to avoid a white flash.
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen bg-surface">
            <NavBar />
            <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-10 sm:pb-24 sm:pt-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
