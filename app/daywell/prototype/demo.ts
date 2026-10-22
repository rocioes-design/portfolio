// Demo mode: plays each flow by itself with a visible cursor, at a steady pace, for screen recordings.
// It drives the real UI (real clicks and real typing), so what's recorded is what a visitor can do.

export type Preset = "login" | "employee" | "manager";

export interface DemoContext {
  reset: (preset: Preset) => void;
}

interface Demo {
  label: string;
  preset: Preset;
  run: (d: Driver) => Promise<void>;
}

class Stopped extends Error {}

class Driver {
  private stopped = false;
  private cursor: HTMLDivElement;
  private x = window.innerWidth * 0.62;
  private y = window.innerHeight * 0.7;

  constructor() {
    this.cursor = document.createElement("div");
    this.cursor.className = "dw-cursor";
    this.cursor.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M5 3l14 7.5-6.2 1.6L10 18.5z" fill="#1d1d1b" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="dw-cursor__ring"></span>';
    document.body.appendChild(this.cursor);
    this.place(0);
  }

  stop() { this.stopped = true; }
  dispose() { this.cursor.remove(); }

  async wait(ms: number) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (this.stopped) throw new Stopped();
      await new Promise((r) => setTimeout(r, Math.min(40, end - Date.now())));
    }
    if (this.stopped) throw new Stopped();
  }

  private place(ms: number) {
    this.cursor.style.transition = ms ? `transform ${ms}ms cubic-bezier(.45,.05,.25,1)` : "none";
    this.cursor.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  async find(name: string, timeout = 4000) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const el = document.querySelector<HTMLElement>(`[data-demo="${name}"]`);
      if (el && el.getClientRects().length) return el;
      await this.wait(50);
    }
    throw new Error(`Demo: couldn't find "${name}"`);
  }

  /** Glide the cursor to an element, scrolling it into view first if needed.
   *  `fx` picks a spot across its width (0–1); by default it's the middle, capped at 120px in. */
  async move(name: string, fx?: number) {
    const el = await this.find(name);
    let r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight - 40) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      await this.wait(550);
      r = el.getBoundingClientRect();
    }
    const tx = r.left + (fx === undefined ? Math.min(r.width / 2, 120) : r.width * fx);
    const ty = r.top + r.height / 2;
    const ms = Math.round(Math.min(900, Math.max(380, Math.hypot(tx - this.x, ty - this.y) * 0.9)));
    this.x = tx;
    this.y = ty;
    this.place(ms);
    await this.wait(ms + 60);
    return el;
  }

  /** Slide the cursor a little out of the way (e.g. so it doesn't cover what's being typed). */
  async nudge(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    this.place(450);
    await this.wait(500);
  }

  async click(name: string, after = 350) {
    const el = await this.move(name);
    this.cursor.classList.add("is-pressing");
    await this.wait(110);
    this.cursor.classList.remove("is-pressing");
    // Fire a mousedown first so "click outside" listeners behave like a real click.
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    el.focus({ preventScroll: true });
    el.click();
    await this.wait(after);
  }

  /** Types into an input or textarea the way React expects (native setter + input event). */
  async type(name: string, text: string, { move = true, delay = 55 } = {}) {
    const el = (move ? await this.move(name) : await this.find(name)) as HTMLInputElement | HTMLTextAreaElement;
    el.focus({ preventScroll: true });
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const set = Object.getOwnPropertyDescriptor(proto, "value")!.set!;
    for (const ch of text) {
      set.call(el, el.value + ch);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      await this.wait(delay + Math.random() * 35);
    }
  }
}

export const DEMOS: Record<string, Demo> = {
  login: {
    label: "Sign in",
    preset: "login",
    run: async (d) => {
      await d.wait(800);
      await d.type("email", "olivia.bennett@acme.com");
      await d.wait(350);
      await d.click("send-code", 900);
      await d.click("code-0", 150);
      await d.nudge(40, 90);
      for (const [i, ch] of [..."482913"].entries()) await d.type(`code-${i}`, ch, { move: false, delay: 140 });
      await d.wait(3200);
    },
  },
  request: {
    label: "Request time off",
    preset: "employee",
    run: async (d) => {
      await d.wait(900);
      await d.click("request-open", 700);
      await d.click("type", 400);
      await d.click("type-annual", 500);
      await d.click("date-start", 500);
      await d.click("day-2025-12-22", 300);
      await d.click("day-2025-12-26", 1300);
      await d.type("request-note", "Family trip for the holidays.");
      await d.wait(500);
      await d.click("request-submit", 1700);
      await d.click("success-done", 900);
      await d.move("row-r-olivia", 0.88);
      await d.wait(2200);
    },
  },
  approve: {
    label: "Approve a request",
    preset: "manager",
    run: async (d) => {
      await d.wait(900);
      await d.move("row-r-olivia");
      await d.wait(300);
      await d.click("approve-r-olivia", 1800);
      await d.type("review-message", "Enjoy the holidays, Olivia!");
      await d.wait(500);
      await d.click("review-confirm", 1700);
      await d.click("success-done", 900);
      await d.move("row-r-olivia", 0.88);
      await d.wait(2200);
    },
  },
  bulk: {
    label: "Bulk approve",
    preset: "manager",
    run: async (d) => {
      await d.wait(900);
      await d.click("select-r-olivia", 300);
      await d.click("select-r-sofia", 300);
      await d.click("select-r-lucas", 700);
      await d.click("bulk-approve", 1500);
      await d.click("bulk-confirm", 2600);
    },
  },
};

let current: Driver | null = null;

export async function playDemo(name: string, ctx: DemoContext, onEnd: () => void) {
  const demo = DEMOS[name];
  if (!demo) return;
  current?.stop();
  const driver = new Driver();
  current = driver;
  const esc = (e: KeyboardEvent) => { if (e.key === "Escape") driver.stop(); };
  window.addEventListener("keydown", esc);
  try {
    ctx.reset(demo.preset);
    window.scrollTo({ top: 0 });
    await driver.wait(300);
    await demo.run(driver);
  } catch (err) {
    if (!(err instanceof Stopped)) console.error(err);
  } finally {
    window.removeEventListener("keydown", esc);
    driver.dispose();
    if (current === driver) current = null;
    onEnd();
  }
}
