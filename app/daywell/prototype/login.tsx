"use client";

import { useEffect, useRef, useState } from "react";

const ART = "/media/daywell/prototype";
const WRONG_CODE = "000000"; // lets the error state be shown on purpose

/** Passwordless sign-in: email → 6-digit code → verified. */
export function Login({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"email" | "code" | "verified">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [wrong, setWrong] = useState(false);
  const [tries, setTries] = useState(3);
  const [resendIn, setResendIn] = useState(20);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown while on the code step.
  useEffect(() => {
    if (step !== "code" || resendIn === 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  useEffect(() => { if (step === "code") boxes.current[0]?.focus(); }, [step]);

  // Check the code once all six digits are in.
  useEffect(() => {
    const code = digits.join("");
    if (code.length < 6) return;
    const t = setTimeout(() => {
      if (code === WRONG_CODE) {
        setWrong(true);
        setTries((n) => n - 1);
        setDigits(Array(6).fill(""));
        boxes.current[0]?.focus();
      } else {
        setStep("verified");
      }
    }, 350);
    return () => clearTimeout(t);
  }, [digits]);

  useEffect(() => {
    if (step !== "verified") return;
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [step, onDone]);

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError(true); return; }
    setDigits(Array(6).fill(""));
    setResendIn(20);
    setStep("code");
  };

  const setDigit = (i: number, raw: string) => {
    let value = raw.replace(/\D/g, "");
    if (value.length === 2 && digits[i]) value = value.replace(digits[i], "") || value[1]; // typed over a filled box
    if (value.length > 1) { // pasted the whole code
      const next = value.slice(0, 6).split("");
      setDigits([...next, ...Array(6 - next.length).fill("")]);
      boxes.current[Math.min(next.length, 5)]?.focus();
      return;
    }
    setWrong(false);
    setDigits((d) => d.map((x, j) => (j === i ? value : x)));
    if (value && i < 5) boxes.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) boxes.current[i - 1]?.focus();
  };

  return (
    <div className="dw-login">
      <div className="dw-login__card">
        <div className="dw-login__brand"><img src={`${ART}/daywell-logomark.svg`} alt="" width={24} height={26} />Daywell</div>

        {step === "email" && (
          <form className="dw-login__step" onSubmit={sendCode} noValidate key="email">
            <img className="dw-login__art" src={`${ART}/signin-envelope.svg`} alt="" />
            <h1>Sign in with your email</h1>
            <label className="dw-field">
              <span className="dw-field__label">Email</span>
              <input
                className={`dw-input ${emailError ? "is-invalid" : ""}`}
                type="email" placeholder="name@company.com" value={email} autoComplete="off" data-demo="email"
                onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
              />
              <span className={`dw-field__hint ${emailError ? "is-error" : ""}`}>
                {emailError ? "Enter a valid email address, like name@company.com" : "Enter the email address associated with Daywell"}
              </span>
            </label>
            <button type="submit" className="dw-btn dw-btn--primary dw-btn--wide dw-btn--lg" data-demo="send-code">Send code</button>
          </form>
        )}

        {step !== "email" && (
          <div className="dw-login__step" key={step === "code" ? "code" : "verified"}>
            <img className="dw-login__art" src={`${ART}/${step === "code" ? "inbox-code" : "verified"}-envelope.svg`} alt="" />
            <h1>Check your inbox</h1>
            <p className="dw-login__lead">Enter the 6-digit code we sent to <b>{email}</b></p>
            {step === "code" ? (
              <>
                <div className={`dw-otp ${wrong ? "is-wrong" : ""}`} role="group" aria-label="6-digit code">
                  {digits.map((d, i) => (
                    <input
                      key={i} ref={(el) => { boxes.current[i] = el; }} className="dw-otp__box" inputMode="numeric" autoComplete="one-time-code"
                      maxLength={6} value={d} aria-label={`Digit ${i + 1}`} data-demo={`code-${i}`}
                      onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onKey(i, e)}
                    />
                  ))}
                </div>
                {wrong && <p className="dw-otp__error" role="alert">Wrong code · {tries} {tries === 1 ? "try" : "tries"} left</p>}
                <div className="dw-login__links">
                  <button type="button" className="dw-link" onClick={() => setStep("email")}>Change email</button>
                  {resendIn > 0
                    ? <span className="dw-login__muted">Resend in {resendIn}s</span>
                    : <button type="button" className="dw-link dw-link--blue" onClick={() => setResendIn(20)}>Resend code</button>}
                </div>
              </>
            ) : (
              <div className="dw-verified" role="status"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>Email verified</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
