import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "January 2026" -> "Jan 26" (used on small screens). */
export function formatShortDate(date?: string) {
  if (!date || date === "Present") return date;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/** "Hyderabad, India (On-Site)" -> "Hyd, IN" (used on small screens). */
export function formatShortLocation(location?: string) {
  if (!location) return "";
  const l = location.toLowerCase();
  if (l.includes("united states") || l.includes("united state")) return "USA";
  if (l.includes("uae") || l.includes("dubai")) return "UAE";
  if (l.includes("hyderabad") && l.includes("india")) return "Hyd, IN";
  if (l.includes("india") && l.includes("bangalore")) return "Bangalore, IN";
  if (l.includes("india") && l.includes("indore")) return "Indore, IN";
  if (l.includes("india")) return "India";
  return location;
}
