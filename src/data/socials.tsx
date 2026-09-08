import {
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export const EMAIL = "vvagrwl@gmail.com";

export const socialLinks: SocialLink[] = [
  { name: "X", href: "https://x.com/vinagrwl", icon: <XLogoIcon weight="duotone" className="size-5" /> },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/vinagrwl/",
    icon: <LinkedinLogoIcon weight="duotone" className="size-5" />,
  },
  {
    name: "Github",
    href: "https://github.com/vinay360",
    icon: <GithubLogoIcon weight="duotone" className="size-5" />,
  },
  {
    name: "Email",
    href: `mailto:${EMAIL}`,
    icon: <EnvelopeSimpleIcon weight="duotone" className="size-5" />,
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
];

export const footerLinks = [
  ...navLinks,
  { href: "/projects", label: "Projects" },
  { href: "/gears", label: "Gears" },
  { href: "/setup", label: "Setup" },
  { href: "/terminal", label: "Terminal" },
  { href: "/books", label: "Books" },
  { href: "/movies", label: "Movies" },
  { href: "/blog/feed.xml", label: "RSS FEED" },
];
