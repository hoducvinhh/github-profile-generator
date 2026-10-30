import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
