import { FileMagnifyingGlassIcon, ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";

import AWS from '@/components/technologies/AWS';
import Datadog from '@/components/technologies/Datadog';
import Docker from '@/components/technologies/Docker';
import ExpressJs from '@/components/technologies/ExpressJs';
import LangChain from '@/components/technologies/LangChain';
import NextJs from '@/components/technologies/NextJs';
import OpenAI from '@/components/technologies/OpenAI';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Pinecone from '@/components/technologies/Pinecone';
import Python from '@/components/technologies/Python';
import RabbitMQ from '@/components/technologies/RabbitMQ';
import ReactIcon from '@/components/technologies/ReactIcon';
import Redis from '@/components/technologies/Redis';
import SocketIo from '@/components/technologies/SocketIo';
import Trpc from '@/components/technologies/Trpc';
import TypeScript from '@/components/technologies/TypeScript';
import Webpack from '@/components/technologies/Webpack';

export interface Technology {
  name: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  description: string[];
  startDate: string;
  endDate: string;
  technologies: Technology[];
  isCurrent: boolean;
  isBlur?: boolean;
}

const tech = (name: string, icon: React.ReactNode): Technology => ({ name, icon });

/** RAG and RBAC are techniques, not products, so they have no brand mark. */
const icon = {
  rag: <FileMagnifyingGlassIcon className="size-4" />,
  rbac: <ShieldCheckIcon className="size-4" />,
};

export const experiences: Experience[] = [
  {
    company: "Shorthills AI",
    position: "SDE-1",
    location: "Gurgaon, India",
    startDate: "June 2026",
    endDate: "Present",
    isCurrent: true,
    isBlur: false,
    technologies: [
      tech("Python", <Python />),
      tech("LangChain", <LangChain />),
      tech("RAG", icon.rag),
      tech("RBAC", icon.rbac),
      tech("OpenAI", <OpenAI />),
      tech("PostgreSQL", <PostgreSQL />),
      tech("TypeScript", <TypeScript />),
      tech("Next.js", <NextJs />),
      tech("AWS", <AWS />),
    ],
    description: [
      "Build chatbots backed by retrieval-augmented generation over internal knowledge bases.",
      "Design RBAC-aware retrieval so results respect per-user permissions and never surface documents a user cannot access.",
      "Develop agentic BI migration tooling that translates legacy dashboards and reports onto new analytics stacks.",
      "Work across retrieval quality, prompt orchestration, and the service layer that exposes these systems to clients.",
    ],
  },
  {
    company: "Crowwd Network India Private Limited",
    position: "Software Development Intern",
    location: "Remote",
    startDate: "January 2025",
    endDate: "May 2025",
    isCurrent: false,
    isBlur: false,
    technologies: [
      tech("Express.js", <ExpressJs />),
      tech("tRPC", <Trpc />),
      tech("PostgreSQL", <PostgreSQL />),
      tech("Socket.IO", <SocketIo />),
      tech("Pinecone", <Pinecone />),
      tech("OpenAI", <OpenAI />),
      tech("LangChain", <LangChain />),
      tech("AWS", <AWS />),
    ],
    description: [
      "Architected a production-ready backend using Express.js, scaling efficiently to support 5,000+ daily active users.",
      "Engineered a real-time stock feed using WebSockets, delivering updates with less than 200ms latency.",
      "Devised an AI chatbot powered by LangChain, boosting user engagement time by 22% through contextual insights.",
      "Integrated vector embeddings to power article summarization, increasing article click-through by 18%.",
      "Deployed and managed the entire infrastructure on AWS with CI/CD pipelines, ensuring 99.9% uptime.",
    ],
  },
  {
    company: "Tech Designworks Private Limited",
    position: "Backend Intern",
    location: "Remote",
    startDate: "July 2024",
    endDate: "November 2024",
    isCurrent: false,
    isBlur: false,
    technologies: [
      tech("AWS", <AWS />),
      tech("Docker", <Docker />),
      tech("Redis", <Redis />),
      tech("RabbitMQ", <RabbitMQ />),
      tech("PostgreSQL", <PostgreSQL />),
      tech("React", <ReactIcon />),
      tech("Webpack", <Webpack />),
      tech("Datadog", <Datadog />),
    ],
    description: [
      "Consolidated 20+ AWS tenant accounts into a unified architecture, reducing cloud spend by 40%.",
      "Orchestrated Docker-based containerization and deployment on AWS ECS, increasing deployment speed by 3x.",
      "Refactored heavy SQL queries and introduced Redis caching, cutting API median latency from 900ms to 120ms.",
      "Implemented RabbitMQ task queues for emails and image processing, reducing request blocking time by 85%.",
      "Utilized webpack code-splitting and lazy loading, cutting the initial React bundle from 12 MB to 2 MB.",
      "Set up a Datadog dashboard, enabling timely alerts and lowering MTTR from 2 hrs to 30 min.",
    ],
  },
];
