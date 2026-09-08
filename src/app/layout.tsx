import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { BottomFade } from "@/components/common/BottomFade";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { Quote } from "@/components/common/Quote";
import { Toaster } from "@/components/common/Toaster";
import { HapticsProvider } from "@/components/providers/HapticsProvider";
import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSearchTags } from "@/lib/blog";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, buildMetadata } from "@/lib/site";

import "./globals.css";

const hankenGrotesk = localFont({
  src: "../../public/fonts/HankenGrotesk-Variable.ttf",
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata(),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/assets/avatar.png`,
  jobTitle: "Software Development Engineer",
  description: SITE_DESCRIPTION.split(" Explore")[0],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Netaji Subhas University of Technology",
  },
  worksFor: { "@type": "Organization", name: "Shorthills AI" },
  sameAs: [
    "https://x.com/vinagrwl",
    "https://www.linkedin.com/in/vinagrwl/",
    "https://github.com/vinay360",
    "mailto:vvagrwl@gmail.com",
  ],
  knowsAbout: [
    "Backend Development",
    "Distributed Systems",
    "Retrieval-Augmented Generation",
    "LangChain",
    "Node.js",
    "Express.js",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "AWS",
    "Docker",
    "System Design",
    "Data Structures & Algorithms",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchTags = getSearchTags();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${hankenGrotesk.className} ${hankenGrotesk.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      >
        <script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <HapticsProvider>
              <KeyboardShortcutsProvider searchTags={searchTags}>
                <Navbar />
                <main>{children}</main>
                <BottomFade />
                <Quote />
                <Footer />
                <Toaster />
              </KeyboardShortcutsProvider>
            </HapticsProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
