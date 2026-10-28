"use client";

import { useEffect, useRef, useState } from "react";
import { AREAS, LEVELS, MAX_REACH, SEED, reach, sameLevels, summarize, type AreaId, type Level, type Levels, type Role } from "./data";
import { Icon, type IconName } from "./icons";

const AREA_ICON: Record<AreaId, IconName> = { people: "users", time: "calendar", payroll: "chart", admin: "sliders" };
const MEANING = ["No access", "Can view", "Can view and edit", "Full control"];
const pos = (level: number) => `${(level / 3) * 100}%`;
const FALLBACK_ID = "employee";

function uniqueName(roles: Role[], base: string) {
  const taken = new Set(roles.map((r) => r.name));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base} ${n}`)) n++;
  return `${base} ${n}`;
}

export function RolesPrototype() {
  const [roles, setRoles] = useState<Role[]>(SEED);
  const [drafts, setDrafts] = useState<Record<string, Levels>>({});
  const [selectedId, setSelectedId] = useState("hr-admin");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [open, setOpen] = useState<AreaId[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [focusName, setFocusName] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const role = roles.find((r) => r.id === selectedId)!;
  const levelsOf = (r: Role) => drafts[r.id] ?? r.levels;
  const isDirty = (r: Role) => !!drafts[r.id] && !sameLevels(drafts[r.id], r.levels);
  const levels = levelsOf(role);
  const dirtyRoles = roles.filter(isDirty);
  const hovered = hoverId && hoverId !== selectedId ? roles.find((r) => r.id === hoverId) : undefined;
  const compare = hovered ? levelsOf(hovered) : null;
  const total = reach(levels);
  const description = isDirty(role) || role.description === null ? summarize(levels) : role.description;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (focusName) nameRef.current?.select();
  }, [focusName]);

  const setLevel = (area: AreaId, level: Level) => {
    if (role.locked || levels[area] === level) return;
    setDrafts((d) => ({ ...d, [role.id]: { ...levels, [area]: level } }));
  };

  const addRole = (base: string, from: Levels) => {
    const id = `custom-${Date.now()}`;
    setRoles((rs) => [...rs, { id, name: uniqueName(rs, base), group: "custom", people: 0, avatars: [], levels: { ...from }, description: null }]);
    setSelectedId(id);
    setFocusName((n) => n + 1);
  };

  const save = () => {
    if (!dirtyRoles.length) return;
    // Once the levels change, the hand-written description no longer holds, so the summary takes over.
    setRoles((rs) => rs.map((r) => (isDirty(r) ? { ...r, levels: drafts[r.id], description: null } : r)));
    setDrafts({});
    setToast(dirtyRoles.length === 1 ? `Saved changes to ${dirtyRoles[0].name}` : `Saved changes to ${dirtyRoles.length} roles`);
  };

  // Everyone falls back to Employee, so the owner and Employee can't be deleted.
  const deletable = !role.locked && role.id !== FALLBACK_ID;
  const deleteRole = () => {
    const index = roles.findIndex((r) => r.id === role.id);
    setRoles((rs) => rs.filter((r) => r.id !== role.id).map((r) => (r.id === FALLBACK_ID ? { ...r, people: r.people + role.people } : r)));
    setDrafts(({ [role.id]: _, ...rest }) => rest);
    setSelectedId(roles[index - 1]?.id ?? FALLBACK_ID);
    setConfirmId(null);
    setToast(`Deleted ${role.name}`);
  };

  const toggle = (area: AreaId) => setOpen((o) => (o.includes(area) ? o.filter((a) => a !== area) : [...o, area]));

  const renderRole = (r: Role) => {
    const extra = r.people - r.avatars.length;
    return (
      <li key={r.id}>
        <button
          type="button"
          className={`rp-role${r.id === selectedId ? " is-selected" : ""}`}
          aria-pressed={r.id === selectedId}
          onClick={() => setSelectedId(r.id)}
          onMouseEnter={() => setHoverId(r.id)}
          onMouseLeave={() => setHoverId(null)}
          onFocus={() => setHoverId(r.id)}
          onBlur={() => setHoverId(null)}
        >
          <span className="rp-role__text">
            <span className="rp-role__name">
              {r.name}
              {r.locked && <Icon name="lock" />}
              {isDirty(r) && <span className="rp-role__dot" aria-label="Unsaved changes" />}
            </span>
            <span className="rp-role__count">{r.people === 0 ? "No one yet" : r.people === 1 ? "1 person" : `${r.people} people`}</span>
          </span>
          <span className="rp-avatars" aria-hidden="true">
            {r.avatars.map((a, i) => <span key={a} className={`rp-avatar rp-avatar--${i % 2 ? "amber" : "blue"}`}>{a}</span>)}
            {extra > 0 && <span className="rp-avatar rp-avatar--more">+{extra}</span>}
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="rp-page" data-no-magic-cursor>
      <section className="rp-dialog" aria-labelledby="rp-title">
        <header className="rp-header">
          <div>
            <h1 id="rp-title" className="rp-title">Roles and permissions</h1>
            <p className="rp-subtitle">Decide what each role can see and change</p>
          </div>
          <button type="button" className="rp-btn rp-btn--primary rp-btn--icon" onClick={() => addRole("New role", { people: 0, time: 0, payroll: 0, admin: 0 })}>
            <Icon name="plus" size={18} />New role
          </button>
        </header>

        <div className="rp-body">
          <nav className="rp-list" aria-label="Roles">
            <div className="rp-group">
              <h2 className="rp-group__label">Built-in</h2>
              <ul>{roles.filter((r) => r.group === "built-in").map(renderRole)}</ul>
            </div>
            <div className="rp-group rp-group--custom">
              <h2 className="rp-group__label">Custom roles</h2>
              <ul>{roles.filter((r) => r.group === "custom").map(renderRole)}</ul>
            </div>
          </nav>

          <div className="rp-detail">
            <div className="rp-detail__head">
              <div className="rp-detail__name">
                {role.group === "custom" ? (
                  <input
                    ref={nameRef}
                    className="rp-name-input"
                    value={role.name}
                    aria-label="Role name"
                    onChange={(e) => setRoles((rs) => rs.map((r) => (r.id === role.id ? { ...r, name: e.target.value } : r)))}
                    onBlur={() => !role.name.trim() && setRoles((rs) => rs.map((r) => (r.id === role.id ? { ...r, name: uniqueName(rs, "Untitled role") } : r)))}
                  />
                ) : (
                  <h2 className="rp-detail__title">{role.name}</h2>
                )}
                {total === MAX_REACH && <span className="rp-tag rp-tag--green">Full access</span>}
              </div>
              <button type="button" className="rp-link" onClick={() => addRole(`${role.name} copy`, levels)}>
                <Icon name="copy" />Duplicate
              </button>
            </div>

            <p key={description} className="rp-description">{description}</p>

            <div className="rp-reach-row">
              <div className="rp-reach">
                <span className="rp-reach__label">Reach</span>
                <span className="rp-meter" role="img" aria-label={`Reach ${total} of ${MAX_REACH}`}>
                  {AREAS.map((a) => (
                    <span key={a.id} className={`rp-meter__seg${a.sensitive ? " is-sensitive" : ""}`}>
                      {[1, 2, 3].map((step) => <span key={step} className={`rp-meter__cell${levels[a.id] >= step ? " is-on" : ""}`} />)}
                    </span>
                  ))}
                </span>
                <span className="rp-reach__value">{total} of {MAX_REACH}</span>
              </div>
              {hovered ? (
                <span className="rp-note rp-note--compare" key="compare"><span className="rp-ring-icon" />Comparing with {hovered.name}</span>
              ) : role.locked ? (
                <span className="rp-note" key="lock"><Icon name="lock" />The owner can always do everything</span>
              ) : null}
            </div>

            <ul className="rp-areas">
              {AREAS.map((a) => {
                const expanded = open.includes(a.id);
                return (
                  <li key={a.id} className="rp-area">
                    <div className="rp-area__row">
                      <div className="rp-area__info">
                        <span className="rp-area__icon"><Icon name={AREA_ICON[a.id]} /></span>
                        <div>
                          <div className="rp-area__title">
                            <h3>{a.name}</h3>
                            {a.sensitive && <span className="rp-tag rp-tag--amber">Sensitive</span>}
                          </div>
                          <p className="rp-area__items">{a.items.join(" · ")}</p>
                        </div>
                      </div>
                      <div className="rp-area__controls">
                        <Rail
                          label={a.name}
                          level={levels[a.id]}
                          compare={compare ? compare[a.id] : null}
                          disabled={!!role.locked}
                          onChange={(l) => setLevel(a.id, l)}
                        />
                        <button
                          type="button"
                          className={`rp-chevron${expanded ? " is-open" : ""}`}
                          aria-expanded={expanded}
                          aria-label={`${expanded ? "Hide" : "Show"} ${a.name} details`}
                          onClick={() => toggle(a.id)}
                        >
                          <Icon name="chevronDown" />
                        </button>
                      </div>
                    </div>
                    <div className={`rp-area__more${expanded ? " is-open" : ""}`}>
                      <div>
                        <ul className="rp-items">
                          {a.items.map((item) => (
                            <li key={item}><span>{item}</span><span className="rp-items__level">{MEANING[levels[a.id]]}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="rp-danger">
              {confirmId === role.id ? (
                <>
                  <p className="rp-danger__question">
                    Delete <strong>{role.name}</strong>?{" "}
                    {role.people ? `${role.people === 1 ? "Its 1 person" : `Its ${role.people} people`} will move to Employee.` : "No one has this role yet."}
                  </p>
                  <div className="rp-danger__actions">
                    <button type="button" className="rp-btn rp-btn--secondary" autoFocus onClick={() => setConfirmId(null)}>Keep role</button>
                    <button type="button" className="rp-btn rp-btn--danger-solid" onClick={deleteRole}>Delete</button>
                  </div>
                </>
              ) : deletable ? (
                <button type="button" className="rp-link rp-link--danger" onClick={() => setConfirmId(role.id)}>
                  <Icon name="trash" />Delete role
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <footer className="rp-footer">
          <p className="rp-status" aria-live="polite">
            {toast ? (
              <span className="rp-status__saved" key={toast}><Icon name="check" />{toast}</span>
            ) : dirtyRoles.length ? (
              `Unsaved changes to ${dirtyRoles.length === 1 ? dirtyRoles[0].name : `${dirtyRoles.length} roles`}`
            ) : null}
          </p>
          <div className="rp-footer__actions">
            <button type="button" className="rp-btn rp-btn--secondary" disabled={!dirtyRoles.length} onClick={() => setDrafts({})}>Cancel</button>
            <button type="button" className="rp-btn rp-btn--primary" disabled={!dirtyRoles.length} onClick={save}>Save changes</button>
          </div>
        </footer>
      </section>
    </div>
  );
}

// Four-stop level rail: click a stop or its label, drag the knob, or use the arrow keys.
function Rail({ label, level, compare, disabled, onChange }: { label: string; level: Level; compare: Level | null; disabled: boolean; onChange: (l: Level) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const pick = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return Math.min(3, Math.max(0, Math.round(((clientX - r.left) / r.width) * 3))) as Level;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const next = { ArrowRight: level + 1, ArrowUp: level + 1, ArrowLeft: level - 1, ArrowDown: level - 1, Home: 0, End: 3 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    onChange(Math.min(3, Math.max(0, next)) as Level);
  };

  return (
    <div
      className={`rp-rail${disabled ? " is-disabled" : ""}`}
      role="slider"
      tabIndex={0}
      aria-label={`${label} access`}
      aria-valuemin={0}
      aria-valuemax={3}
      aria-valuenow={level}
      aria-valuetext={LEVELS[level]}
      aria-disabled={disabled || undefined}
      title={disabled ? "The owner's access can't be changed" : undefined}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        onChange(pick(e.clientX));
      }}
      onPointerMove={(e) => dragging.current && onChange(pick(e.clientX))}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="rp-rail__track" ref={track}>
        <span className="rp-rail__line" />
        <span className="rp-rail__fill" style={{ width: pos(level) }} />
        {[0, 1, 2, 3].map((i) => <span key={i} className={`rp-rail__stop${i === 0 ? " is-none" : i <= level ? " is-on" : ""}`} style={{ left: pos(i) }} />)}
        <span className={`rp-rail__compare${compare !== null ? " is-shown" : ""}`} style={{ left: pos(compare ?? level) }} />
        <span className="rp-rail__knob" style={{ left: pos(level) }} />
      </div>
      <div className="rp-rail__labels" aria-hidden="true">
        {LEVELS.map((name, i) => <span key={name} className={i === level ? "is-current" : ""} style={{ left: pos(i) }}>{name}</span>)}
      </div>
    </div>
  );
}
