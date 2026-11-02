import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Bebas_Neue } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProfileForge — The Developer Identity Foundry",
  description:
    "Forge high-impact GitHub profile READMEs in cold code and verified metrics. Visual drag-and-drop builder, real GitHub Octokit pipeline, and deterministic Markdown.",
  keywords: [
    "github profile",
    "github readme generator",
    "developer portfolio",
    "markdown builder",
    "github stats",
    "shields.io",
  ],
  authors: [{ name: "ProfileForge Team" }],
  openGraph: {
    title: "ProfileForge — The Developer Identity Foundry",
    description:
      "Forge your GitHub profile in cold code and verified metrics. Visual builder, real stats, and deterministic Markdown.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jetbrainsMono.variable} ${bebasNeue.variable}`}
    >
      <body className={`${outfit.className} font-sans antialiased bg-[#07080a] text-[#f2f4f8] selection:bg-amber-500/20 selection:text-amber-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
