import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "ProfileForge — Visual GitHub Profile README Builder",
  description:
    "Build beautiful, personalized GitHub Profile READMEs with a visual editor, real GitHub data import, reusable components, customizable themes, and one-click Markdown export.",
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
    title: "ProfileForge — Visual GitHub Profile README Builder",
    description:
      "Craft high-impact GitHub profile READMEs with real stats, drag-and-drop sections, and clean Markdown export.",
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
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className={`${outfit.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
