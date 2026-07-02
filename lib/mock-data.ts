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

export type ClientProject = {
  client: string;
  contact: string;
  project: string;
  status: string;
  statusTone: BadgeTone;
  priority: string;
  priorityTone: BadgeTone;
  health: number;
  due: string;
  value: string;
};

export type PipelineStage = {
  title: string;
  count: number;
  value: string;
  tone: BadgeTone;
  projects: {
    name: string;
    client: string;
    progress: number;
  }[];
};

export type TaskColumn = {
  title: string;
  tasks: {
    title: string;
    owner: string;
    due: string;
    status: string;
    tone: BadgeTone;
  }[];
};

export type AutomationItem = {
  title: string;
  description: string;
  readiness: number;
  status: string;
  tone: BadgeTone;
  impact: string;
};

export type ActivityItem = {
  person: string;
  action: string;
  target: string;
  time: string;
  tone: BadgeTone;
};

export const navItems = [
  { label: "Overview", active: true },
  { label: "Clients", active: false },
  { label: "Projects", active: false },
  { label: "Tasks", active: false },
  { label: "Automation", active: false },
  { label: "Reports", active: false },
];

export const projectSummary = {
  eyebrow: "ClientOps Command Center",
  title: "ClientOps AI Dashboard",
  description:
    "Admin workspace for tracking client health, project delivery, task status, and automation opportunities.",
  owner: "Jazhem Hamid",
};

export const quickActions = ["New client", "Log update", "Review queue"];

export const overviewMetrics: Metric[] = [
  {
    label: "Active clients",
    value: "24",
    change: "+4 this month",
    detail: "8 accounts need follow-up",
    tone: "cyan",
  },
  {
    label: "Open projects",
    value: "18",
    change: "6 in delivery",
    detail: "3 launches due this week",
    tone: "emerald",
  },
  {
    label: "Pending tasks",
    value: "47",
    change: "12 high priority",
    detail: "Team load is balanced",
    tone: "amber",
  },
  {
    label: "Automation fit",
    value: "76%",
    change: "+9 readiness",
    detail: "Best gains in intake and reporting",
    tone: "violet",
  },
];

export const clientProjects: ClientProject[] = [
  {
    client: "Northstar Studio",
    contact: "Maya R.",
    project: "Client portal rebuild",
    status: "In progress",
    statusTone: "cyan",
    priority: "High",
    priorityTone: "rose",
    health: 86,
    due: "Jul 12",
    value: "$18.4k",
  },
  {
    client: "BrightPath Dental",
    contact: "Andre T.",
    project: "Ops dashboard MVP",
    status: "Review",
    statusTone: "amber",
    priority: "Medium",
    priorityTone: "amber",
    health: 74,
    due: "Jul 18",
    value: "$11.2k",
  },
  {
    client: "UrbanLedger",
    contact: "Sam K.",
    project: "Workflow audit",
    status: "Discovery",
    statusTone: "violet",
    priority: "Medium",
    priorityTone: "amber",
    health: 68,
    due: "Jul 24",
    value: "$7.8k",
  },
  {
    client: "Harbor & Field",
    contact: "Nina P.",
    project: "Admin system cleanup",
    status: "Blocked",
    statusTone: "rose",
    priority: "High",
    priorityTone: "rose",
    health: 52,
    due: "Jul 09",
    value: "$14.6k",
  },
  {
    client: "Atlas Care Group",
    contact: "Theo L.",
    project: "Reporting automation",
    status: "Ready",
    statusTone: "emerald",
    priority: "Low",
    priorityTone: "zinc",
    health: 91,
    due: "Aug 02",
    value: "$9.5k",
  },
];

export const pipelineStages: PipelineStage[] = [
  {
    title: "Discovery",
    count: 5,
    value: "$32k",
    tone: "violet",
    projects: [
      { name: "Workflow audit", client: "UrbanLedger", progress: 35 },
      { name: "CRM intake map", client: "Cedar Ops", progress: 42 },
    ],
  },
  {
    title: "Build",
    count: 7,
    value: "$71k",
    tone: "cyan",
    projects: [
      { name: "Client portal rebuild", client: "Northstar Studio", progress: 64 },
      { name: "Ops dashboard MVP", client: "BrightPath Dental", progress: 58 },
    ],
  },
  {
    title: "Review",
    count: 4,
    value: "$26k",
    tone: "amber",
    projects: [
      { name: "QA handoff", client: "Mintlane", progress: 82 },
      { name: "Admin cleanup", client: "Harbor & Field", progress: 48 },
    ],
  },
  {
    title: "Launch",
    count: 2,
    value: "$19k",
    tone: "emerald",
    projects: [
      { name: "Reporting automation", client: "Atlas Care Group", progress: 91 },
      { name: "SOP library", client: "BluePeak", progress: 88 },
    ],
  },
];

export const taskColumns: TaskColumn[] = [
  {
    title: "Now",
    tasks: [
      {
        title: "Resolve Harbor permissions blocker",
        owner: "Jazhem",
        due: "Today",
        status: "Risk",
        tone: "rose",
      },
      {
        title: "Prepare Northstar homepage QA notes",
        owner: "Jazhem",
        due: "Today",
        status: "Active",
        tone: "cyan",
      },
    ],
  },
  {
    title: "Next",
    tasks: [
      {
        title: "Send BrightPath stakeholder summary",
        owner: "Client Ops",
        due: "Tomorrow",
        status: "Queued",
        tone: "amber",
      },
      {
        title: "Draft Atlas reporting workflow",
        owner: "Automation",
        due: "Jul 08",
        status: "Ready",
        tone: "emerald",
      },
    ],
  },
  {
    title: "Waiting",
    tasks: [
      {
        title: "UrbanLedger sample data approval",
        owner: "Client",
        due: "Jul 10",
        status: "Waiting",
        tone: "zinc",
      },
      {
        title: "Mintlane brand asset handoff",
        owner: "Client",
        due: "Jul 11",
        status: "Review",
        tone: "violet",
      },
    ],
  },
];

export const contextNotes = [
  {
    title: "Revenue focus",
    type: "Signal",
    tone: "emerald" as BadgeTone,
    detail:
      "Highest-value work is concentrated in rebuilds and reporting automation. Keep discovery calls pointed toward repeatable admin pain.",
    tags: ["Pipeline", "Positioning", "SaaS ops"],
  },
  {
    title: "Delivery risk",
    type: "Watch",
    tone: "amber" as BadgeTone,
    detail:
      "Harbor needs a decision on access ownership before the cleanup can move. Escalation is ready with a clear next step.",
    tags: ["Access", "Client dependency"],
  },
];

export const automationItems: AutomationItem[] = [
  {
    title: "Weekly client summary draft",
    description:
      "Turn project notes, blockers, and recent activity into an editable account update.",
    readiness: 86,
    status: "Ready soon",
    tone: "emerald",
    impact: "Saves 3 hrs/week",
  },
  {
    title: "Intake triage assistant",
    description:
      "Classify new requests by urgency, client value, and required follow-up owner.",
    readiness: 74,
    status: "Needs rules",
    tone: "cyan",
    impact: "Faster routing",
  },
  {
    title: "Risk detection monitor",
    description:
      "Flag aging tasks, blocked projects, and accounts with declining health scores.",
    readiness: 62,
    status: "Prototype",
    tone: "violet",
    impact: "Earlier saves",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    person: "Jazhem",
    action: "moved",
    target: "Atlas reporting automation to Launch",
    time: "12 min ago",
    tone: "emerald",
  },
  {
    person: "Client Ops",
    action: "added",
    target: "three QA notes for Northstar Studio",
    time: "36 min ago",
    tone: "cyan",
  },
  {
    person: "Automation",
    action: "flagged",
    target: "Harbor permissions as a delivery risk",
    time: "1 hr ago",
    tone: "rose",
  },
  {
    person: "BrightPath",
    action: "approved",
    target: "the dashboard KPI layout",
    time: "2 hrs ago",
    tone: "amber",
  },
];
