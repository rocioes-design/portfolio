export const LEVELS = ["None", "View", "Edit", "Manage"] as const;
export type Level = 0 | 1 | 2 | 3;

export type AreaId = "people" | "time" | "payroll" | "admin";

export interface Area {
  id: AreaId;
  name: string;
  noun: string; // how the summary sentence refers to it
  items: string[];
  sensitive?: boolean;
}

export const AREAS: Area[] = [
  { id: "people", name: "People", noun: "people", items: ["Directory", "Profiles", "Documents", "Onboarding"], sensitive: true },
  { id: "time", name: "Time & attendance", noun: "time & attendance", items: ["Leave requests", "Policies", "Calendar", "Attendance"] },
  { id: "payroll", name: "Payroll & compensation", noun: "payroll", items: ["Compensation", "Payslips", "Reports", "Analytics"] },
  { id: "admin", name: "Administration", noun: "administration", items: ["Roles & permissions", "Company settings", "Integrations", "Audit log"] },
];

export type Levels = Record<AreaId, Level>;

export interface Role {
  id: string;
  name: string;
  group: "built-in" | "custom";
  people: number;
  avatars: string[];
  levels: Levels;
  description: string | null; // null → the summary sentence is the description
  locked?: boolean;
}

const lv = (people: Level, time: Level, payroll: Level, admin: Level): Levels => ({ people, time, payroll, admin });

export const SEED: Role[] = [
  {
    id: "owner", name: "Owner", group: "built-in", people: 1, avatars: ["CT"], levels: lv(3, 3, 3, 3), locked: true,
    description: "Company owners or workspace administrators. Manage all settings, employees, permissions, and company-wide data.",
  },
  {
    id: "manager", name: "Manager", group: "built-in", people: 10, avatars: ["AE", "RO", "MR", "OB"], levels: lv(2, 3, 1, 0),
    description: "Team leads. Approve time off, keep their team's records up to date, and see payroll for their reports.",
  },
  {
    id: "supervisor", name: "Supervisor", group: "built-in", people: 20, avatars: ["AE", "RO", "MR", "OB"], levels: lv(1, 2, 0, 0),
    description: "Run day-to-day shifts. See the team directory and keep schedules and attendance current.",
  },
  {
    id: "hr-admin", name: "HR Admin", group: "built-in", people: 3, avatars: ["AE", "RO", "MR"], levels: lv(3, 3, 1, 3),
    description: "Manage employee records, time-off policies, approvals, onboarding, and HR reports.",
  },
  {
    id: "employee", name: "Employee", group: "built-in", people: 36, avatars: ["AE", "RO", "MR", "OB"], levels: lv(1, 2, 1, 0),
    description: "Everyone at the company. Browse the directory, request time off, and see their own payslips.",
  },
  {
    id: "finance", name: "Finance", group: "custom", people: 3, avatars: ["AE", "RO", "MR"], levels: lv(1, 1, 3, 0),
    description: "Run payroll and compensation reviews.",
  },
  {
    id: "marketing", name: "Marketing", group: "custom", people: 3, avatars: ["AE", "RO", "MR"], levels: lv(1, 1, 0, 0),
    description: "See who's who and who's out this week.",
  },
];

export const reach = (l: Levels) => AREAS.reduce((sum, a) => sum + l[a.id], 0);
export const MAX_REACH = AREAS.length * 3;
export const sameLevels = (a: Levels, b: Levels) => AREAS.every((x) => a[x.id] === b[x.id]);

const list = (words: string[]) =>
  words.length <= 1 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;

// The sentence that rewrites itself as the rails move.
export function summarize(l: Levels): string {
  const at = (level: Level) => AREAS.filter((a) => l[a.id] === level).map((a) => a.noun);
  if (at(3).length === AREAS.length) return "Can manage everything.";
  if (at(0).length === AREAS.length) return "No access yet. Move a rail to choose what this role can do.";
  const parts = ([3, 2, 1] as Level[])
    .filter((level) => at(level).length)
    .map((level) => `${LEVELS[level].toLowerCase()} ${list(at(level))}`);
  const none = at(0);
  return `Can ${list(parts)}.${none.length ? ` No access to ${list(none)}.` : ""}`;
}
