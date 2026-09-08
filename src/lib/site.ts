import type { Metadata } from "next";

export const SITE_URL = "https://vinagrwl.app";
export const SITE_NAME = "Vinay Agarwal";
export const SITE_TITLE = "Vinay Agarwal - Software Development Engineer";
export const SITE_DESCRIPTION =
  "I'm a software engineer working on chatbots, RAG systems and agentic tooling. I like building backends that hold up under load — real-time feeds, queues, caching and the infrastructure around them. Explore my work, experience, and technical expertise.";

export const SITE_KEYWORDS = [
  "portfolio",
  "developer",
  "backend",
  "full-stack",
  "software engineer",
  "typescript",
  "nextjs",
  "react",
  "nodejs",
  "postgresql",
  "aws",
  "rag",
  "langchain",
  "system design",
  "vinay",
  "vinay agarwal",
  "vinagrwl",
  "vinay360",
  "projects",
  "personal website",
  "developer portfolio",
];

type PageMeta = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image = "/meta/hero.png",
}: PageMeta = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    keywords: SITE_KEYWORDS,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: { canonical: url, languages: { "en-US": url, "x-default": url } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@vinagrwl",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}
