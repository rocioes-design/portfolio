// Mock data for the Daywell prototype. Same story as the Figma file: Olivia Bennett asks for
// Dec 22–26, 2025 off (Christmas falls inside, so it costs 4 working days) and her manager,
// Hannah Lee, approves it. "Today" in the prototype is Wednesday, Dec 10, 2025.

export type LeaveType = "annual" | "sick" | "unpaid" | "maternity";
export type Status = "pending" | "approved" | "declined";

export interface Request {
  id: string;
  person: string;
  type: LeaveType;
  start: string; // ISO date, inclusive
  end: string;
  status: Status;
  note?: string; // from the employee
  reason?: string; // from the manager
}

export interface Person {
  name: string;
  id: string;
  team: string;
  photo?: string;
}

export const TODAY = "2025-12-10";
export const ME = "olivia";

export const PEOPLE: Record<string, Person> = {
  olivia: { name: "Olivia Bennett", id: "265989741", team: "Marketing - Content", photo: "/media/daywell/prototype/olivia.jpg" },
  lucas: { name: "Lucas Fernandez", id: "265989742", team: "Marketing - Growth" },
  sofia: { name: "Sofia Martinez", id: "265989743", team: "Marketing - Design" },
  mateo: { name: "Mateo Rodriguez", id: "265989744", team: "Marketing - Content" },
  isabella: { name: "Isabella Chen", id: "265989745", team: "Marketing - Content" },
  emma: { name: "Emma Wilson", id: "265989746", team: "Marketing - Content" },
  scott: { name: "Scott Cooper", id: "265989748", team: "Marketing - Growth" },
};

export const LEAVE: Record<LeaveType, { label: string; emoji: string; kind: string; balance: number }> = {
  annual: { label: "Annual leave", emoji: "🌴", kind: "Paid time off", balance: 18 },
  sick: { label: "Sick leave", emoji: "💊", kind: "Paid time off", balance: 15 },
  unpaid: { label: "Without pay", emoji: "💵", kind: "Unpaid time off", balance: 1 },
  maternity: { label: "Maternity leave", emoji: "🤰", kind: "Paid time off", balance: 92 },
};

export const HOLIDAYS: Record<string, string> = {
  "2025-12-25": "Christmas Day",
  "2026-01-01": "New Year's Day",
};

// Olivia's own Dec 22–26 request is not here: she creates it in the "Request time off" flow.
export const SEED: Request[] = [
  { id: "r-lucas", person: "lucas", type: "annual", start: "2025-12-29", end: "2025-12-31", status: "pending" },
  { id: "r-sofia", person: "sofia", type: "annual", start: "2025-12-15", end: "2025-12-19", status: "pending" },
  { id: "r-emma", person: "emma", type: "annual", start: "2025-12-22", end: "2025-12-24", status: "approved", note: "Visiting family." },
  { id: "r-scott", person: "scott", type: "sick", start: "2025-12-11", end: "2025-12-11", status: "approved" },
  { id: "r-mateo", person: "mateo", type: "annual", start: "2025-12-22", end: "2025-12-24", status: "declined", reason: "Doesn't fit team coverage" },
  { id: "r-isabella", person: "isabella", type: "annual", start: "2025-12-23", end: "2025-12-24", status: "declined", reason: "Doesn't fit team coverage" },
  { id: "r-o1", person: "olivia", type: "sick", start: "2025-12-01", end: "2025-12-02", status: "approved" },
  { id: "r-o2", person: "olivia", type: "unpaid", start: "2025-09-30", end: "2025-09-30", status: "approved" },
  { id: "r-o3", person: "olivia", type: "unpaid", start: "2025-09-08", end: "2025-09-11", status: "declined", reason: "Not enough unpaid leave balance" },
  { id: "r-o4", person: "olivia", type: "annual", start: "2025-04-07", end: "2025-04-10", status: "approved" },
];

// The request the flows revolve around, used by the demos that start on the manager side.
export const OLIVIA_REQUEST: Request = {
  id: "r-olivia", person: "olivia", type: "annual", start: "2025-12-22", end: "2025-12-26", status: "pending", note: "Family trip for the holidays.",
};

/* Dates. Everything works on ISO strings at noon UTC so time zones never shift a day. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`);
export const toIso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d); };
export const weekday = (iso: string) => DAYS[toDate(iso).getUTCDay()];
export const isWeekend = (iso: string) => [0, 6].includes(toDate(iso).getUTCDay());
export const monthLabel = (iso: string) => { const d = toDate(iso); return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

/** "22 Dec 25" */
export const shortDate = (iso: string) => { const d = toDate(iso); return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`; };
/** "Mon, Dec 22, 2025" */
export const longDate = (iso: string) => { const d = toDate(iso); return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };
/** "Dec 25, 2025" */
export const mediumDate = (iso: string) => { const d = toDate(iso); return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

export function eachDay(start: string, end: string) {
  const out: string[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Working days only: weekends and public holidays don't count. */
export const workingDays = (start: string, end: string) => eachDay(start, end).filter((d) => !isWeekend(d) && !HOLIDAYS[d]).length;
export const holidaysIn = (start: string, end: string) => eachDay(start, end).filter((d) => HOLIDAYS[d]);
export const overlaps = (a: Request, b: Request) => a.start <= b.end && b.start <= a.end;
export const dayCount = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

/** Monday of the week that contains the date. */
export const mondayOf = (iso: string) => addDays(iso, -((toDate(iso).getUTCDay() + 6) % 7));

/** Approved leave of other people that overlaps this request. */
export const conflictsFor = (req: Request, all: Request[]) =>
  all.filter((r) => r.person !== req.person && r.status === "approved" && overlaps(r, req));

/** Days left after approved requests of this type. */
export const available = (type: LeaveType, all: Request[]) =>
  LEAVE[type].balance - all.filter((r) => r.person === ME && r.type === type && r.status === "approved" && r.start >= "2025-12-10").reduce((sum, r) => sum + workingDays(r.start, r.end), 0);
