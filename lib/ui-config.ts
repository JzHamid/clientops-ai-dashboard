export type BadgeTone =
  | "cyan"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "zinc";

export type Metric = {
  label: string;
  value: string;
  change: string;
  detail: string;
  tone: BadgeTone;
};

export type HeaderAction = {
  label: string;
  href: string;
};

export const navItems = [
  { label: "Overview", href: "#overview", active: true },
  { label: "Clients", href: "#clients", active: false },
  { label: "Projects", href: "#projects", active: false },
  { label: "Tasks", href: "#tasks", active: false },
  { label: "Notes", href: "#notes", active: false },
  { label: "Automation", href: "#automation", active: false },
  { label: "Activity", href: "#activity", active: false },
];

export const projectSummary = {
  eyebrow: "ClientOps Command Center",
  title: "ClientOps AI Dashboard",
  description:
    "Authenticated workspace for managing clients, projects, tasks, notes, and AI summary previews.",
  owner: "Jazhem Hamid",
};

export const quickActions: HeaderAction[] = [
  { label: "Add client", href: "#clients" },
  { label: "Add note", href: "#notes" },
  { label: "Review tasks", href: "#tasks" },
];
