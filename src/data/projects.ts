export interface Project {
  slug: string;
  title: string;
  description: string;
  link: string;
}

// TODO: `link` points at the GitHub profile for now — swap each one for its
// actual repo or live demo URL.
export const projects: Project[] = [
  {
    slug: "spendora",
    title: "Spendora",
    description:
      "AI-powered personal finance tracker that lets you manage expenses in natural language, with conversational spending insights and interactive dashboards. Next.js, TypeScript, PostgreSQL, Vercel AI SDK.",
    link: "https://github.com/vinay360",
  },
  {
    slug: "forkrypt",
    title: "Forkrypt",
    description:
      "Multithreaded C++ system that encodes files into valid chess PGNs — 50+ MB in under 30s — using an adaptive variable-bit-length mapping of file bits to legal moves, with a React frontend to visualize and export the games.",
    link: "https://github.com/vinay360",
  },
];
