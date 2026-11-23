import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans, Fredoka } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { StyleApplier } from "@/components/style-applier";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const pixel = Pixelify_Sans({ variable: "--font-pixel", subsets: ["latin"] });
const toon = Fredoka({ variable: "--font-toon", subsets: ["latin"] });

// Applies saved style/palette before first paint to avoid a flash.
const NO_FLASH = `try{var s=JSON.parse(localStorage.getItem("team-tracker-settings-v1")||"null");if(s&&s.state){var d=document.documentElement;if(s.state.style)d.dataset.style=s.state.style;if(s.state.palette&&s.state.palette!=="default")d.dataset.palette=s.state.palette}}catch(e){}`;

export const metadata: Metadata = {
  title: "Team Tracker",
  description: "Track work you've assigned to your team on a Kanban board.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${pixel.variable} ${toon.variable} h-full antialiased`}>
      <head><script dangerouslySetInnerHTML={{ __html: NO_FLASH }} /></head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          <StyleApplier />
        </ThemeProvider>
      </body>
    </html>
  );
}
