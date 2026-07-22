import { useState } from "react";
import { Lock } from "lucide-react";

export default function PinLock({ T, expected, onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (value === expected) onUnlock();
    else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div
      style={{ background: T.bg, color: T.text, fontFamily: T.bodyFont }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
    >
      <div
        style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }}
        className="w-full max-w-xs p-6 text-center"
      >
        <div
          style={{ background: T.surface2, color: T.accent }}
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <Lock size={20} />
        </div>
        <h1 style={{ color: T.text }} className="text-base font-bold mb-1">Iman</h1>
        <p style={{ color: T.muted }} className="text-xs mb-4">Введите PIN-код</p>
        <form onSubmit={submit}>
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            style={{
              background: T.surface2,
              color: T.text,
              border: `1px solid ${error ? T.accent2 : T.border}`,
              borderRadius: T.radius,
              letterSpacing: "0.4em",
            }}
            className="w-full text-center text-lg px-3 py-2.5 outline-none mb-3"
            placeholder="••••"
          />
          {error && <p style={{ color: T.accent2 }} className="text-xs mb-3">Неверный код</p>}
          <button
            type="submit"
            style={{ background: T.accent, color: T.bg, borderRadius: T.radius }}
            className="w-full py-2.5 text-sm font-bold"
          >
            Открыть
          </button>
        </form>
      </div>
    </div>
  );
}
