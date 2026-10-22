"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Login } from "./login";
import { BulkDialog, RequestSheet, ReviewSheet } from "./sheets";
import { Drawer, Modal, useLast, usePresence } from "./ui";
import { EmployeeDashboard, ManagerRequests, Shell, type Role } from "./views";
import { DEMOS, playDemo, type Preset } from "./demo";
import { ME, OLIVIA_REQUEST, PEOPLE, SEED, conflictsFor, type LeaveType, type Request } from "./data";

type Sheet = { kind: "request"; type: LeaveType | null } | { kind: "review"; id: string; decision: "approve" | "decline" };

interface State {
  screen: "login" | "app";
  role: Role;
  requests: Request[];
  sheet: Sheet | null;
  bulk: "approve" | "decline" | null;
  selected: string[];
  toast: string | null;
  flash: string[];
  version: number; // bumps on reset so every screen starts fresh
}

const initial = (preset: Preset, version = 0): State => ({
  screen: preset === "login" ? "login" : "app",
  role: preset === "manager" ? "manager" : "employee",
  requests: preset === "manager" ? [OLIVIA_REQUEST, ...SEED] : SEED,
  sheet: null,
  bulk: null,
  selected: [],
  toast: null,
  flash: [],
  version,
});

export function DaywellPrototype() {
  const [s, setS] = useState<State>(() => initial("login"));
  const [demo, setDemo] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [recording, setRecording] = useState(false);
  const sheetKey = useRef(0);

  const patch = useCallback((p: Partial<State> | ((s: State) => Partial<State>)) => setS((prev) => ({ ...prev, ...(typeof p === "function" ? p(prev) : p) })), []);
  const reset = useCallback((preset: Preset) => setS((prev) => initial(preset, prev.version + 1)), []);

  const flash = useCallback((ids: string[]) => {
    patch((p) => ({ flash: [...p.flash, ...ids] }));
    setTimeout(() => patch((p) => ({ flash: p.flash.filter((id) => !ids.includes(id)) })), 1800);
  }, [patch]);

  const toast = useCallback((text: string) => patch({ toast: text }), [patch]);
  useEffect(() => {
    if (!s.toast) return;
    const t = setTimeout(() => patch({ toast: null }), 3600);
    return () => clearTimeout(t);
  }, [s.toast, patch]);

  const start = useCallback((name: string) => {
    setMenu(false);
    setDemo(name);
    playDemo(name, { reset }, () => setDemo(null));
  }, [reset]);

  // ?demo=request plays a flow on load and hides the demo menu, for clean recordings.
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("demo");
    if (name && DEMOS[name]) { setRecording(true); const t = setTimeout(() => start(name), 600); return () => clearTimeout(t); }
  }, [start]);

  const openSheet = (sheet: Sheet) => { sheetKey.current += 1; patch({ sheet }); };
  const closeSheet = useCallback(() => patch({ sheet: null }), [patch]);
  const lastSheet = useLast(s.sheet);

  // The row a finished sheet changed, so closing it can highlight that row (and only after a real change).
  const changed = useRef<string | null>(null);

  const submitRequest = (r: Omit<Request, "id" | "status" | "person">) => {
    const id = s.requests.some((x) => x.id === "r-olivia") ? `r-olivia-${s.requests.length}` : "r-olivia";
    changed.current = id;
    patch((p) => ({ requests: [{ ...r, id, person: ME, status: "pending" }, ...p.requests] }));
  };

  const review = (id: string, decision: "approve" | "decline", message: string) => {
    changed.current = id;
    patch((p) => ({
      requests: p.requests.map((r) => (r.id === id ? { ...r, status: decision === "approve" ? "approved" : "declined", reason: decision === "decline" ? message : r.reason } : r)),
      selected: p.selected.filter((x) => x !== id),
    }));
  };

  const finishSheet = () => {
    closeSheet();
    const id = changed.current;
    changed.current = null;
    const r = id && s.requests.find((x) => x.id === id);
    if (!r) return;
    flash([r.id]);
    toast(r.status === "pending" ? "Request sent to Hannah Lee" : `${PEOPLE[r.person].name.split(" ")[0]}’s request was ${r.status}`);
  };

  const confirmBulk = (reason: string) => {
    const ids = s.selected;
    const kind = s.bulk;
    patch((p) => ({
      requests: p.requests.map((r) => (ids.includes(r.id) ? { ...r, status: kind === "approve" ? "approved" : "declined", reason: kind === "decline" ? reason : r.reason } : r)),
      selected: [],
      bulk: null,
    }));
    flash(ids);
    toast(`${ids.length} ${ids.length === 1 ? "request" : "requests"} ${kind === "approve" ? "approved" : "declined"}`);
  };

  const reviewing = lastSheet?.kind === "review" ? s.requests.find((r) => r.id === lastSheet.id) : undefined;
  const bulkConflicts = s.selected.filter((id) => { const r = s.requests.find((x) => x.id === id); return r && conflictsFor(r, s.requests).length > 0; }).length;
  const lastBulk = useLast(s.bulk);
  const toastP = usePresence(Boolean(s.toast), 200);
  const lastToast = useLast(s.toast);

  return (
    <div className={`dw ${demo ? "is-demo" : ""}`} data-no-magic-cursor>
      {s.screen === "login" ? (
        <Login key={s.version} onDone={() => patch({ screen: "app" })} />
      ) : (
        <Shell
          key={s.version} role={s.role}
          onRole={(role) => patch({ role, sheet: null, selected: [], bulk: null })}
          breadcrumb={s.role === "employee" ? ["Dashboard"] : ["Time & attendance", "Time-off requests"]}
        >
          {s.role === "employee" ? (
            <EmployeeDashboard all={s.requests} flash={s.flash} onRequest={(type) => openSheet({ kind: "request", type })} />
          ) : (
            <ManagerRequests
              all={s.requests} selected={s.selected} flash={s.flash}
              onToggle={(id) => patch((p) => ({ selected: p.selected.includes(id) ? p.selected.filter((x) => x !== id) : [...p.selected, id] }))}
              onToggleAll={(ids) => patch((p) => ({ selected: ids.every((id) => p.selected.includes(id)) ? [] : ids }))}
              onClear={() => patch({ selected: [] })}
              onReview={(id, decision) => openSheet({ kind: "review", id, decision })}
              onBulk={(bulk) => patch({ bulk })}
            />
          )}
        </Shell>
      )}

      <Drawer open={s.sheet !== null} onClose={finishSheet} label={lastSheet?.kind === "review" ? "Review request" : "Request time off"}>
        {lastSheet?.kind === "request" && (
          <RequestSheet key={sheetKey.current} initialType={lastSheet.type} all={s.requests} onClose={finishSheet} onSubmit={submitRequest} />
        )}
        {lastSheet?.kind === "review" && reviewing && (
          <ReviewSheet
            key={sheetKey.current} request={reviewing} decision={lastSheet.decision} all={s.requests}
            onClose={finishSheet} onConfirm={(m) => review(reviewing.id, lastSheet.decision, m)}
          />
        )}
      </Drawer>

      <Modal open={s.bulk !== null} onClose={() => patch({ bulk: null })} label="Confirm">
        {lastBulk && <BulkDialog key={`${lastBulk}-${s.version}`} kind={lastBulk} count={s.selected.length} conflicts={bulkConflicts} onCancel={() => patch({ bulk: null })} onConfirm={confirmBulk} />}
      </Modal>

      {toastP.mounted && <div className={`dw-toast ${toastP.shown ? "is-open" : ""}`} role="status">{lastToast}</div>}

      {!recording && !demo && (
        <div className="dw-demo">
          {menu && (
            <div className="dw-demo__menu" role="menu">
              <p>Play a flow</p>
              {Object.entries(DEMOS).map(([key, d], i) => (
                <button key={key} type="button" role="menuitem" onClick={() => start(key)}><span>{i + 1}</span>{d.label}</button>
              ))}
              <hr />
              <button type="button" role="menuitem" onClick={() => { reset("login"); setMenu(false); }}>Restart prototype</button>
              <button type="button" role="menuitem" onClick={() => { reset("employee"); setMenu(false); }}>Skip to employee view</button>
              <button type="button" role="menuitem" onClick={() => { reset("manager"); setMenu(false); }}>Skip to manager view</button>
            </div>
          )}
          <button type="button" className="dw-demo__toggle" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>Demo
          </button>
        </div>
      )}
    </div>
  );
}
