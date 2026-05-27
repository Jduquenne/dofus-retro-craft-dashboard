import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldCheck, LockKeyhole } from 'lucide-react';

interface AdminGateProps {
  isAdmin: boolean;
  hasAdminCodes: boolean;
  onUnlock: (code: string) => Promise<boolean>;
  onLock: () => void;
}

export const AdminGate: React.FC<AdminGateProps> = ({ isAdmin, hasAdminCodes, onUnlock, onLock }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setCode('');
        setError(false);
      }
    };
    const onMouse = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCode('');
        setError(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouse);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouse);
    };
  }, [open]);

  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 500);
    return () => clearTimeout(t);
  }, [shake]);

  if (!hasAdminCodes) return null;

  if (isAdmin) {
    return (
      <button
        onClick={onLock}
        title="Verrouiller l'accès"
        className="p-1.5 rounded transition-colors hover:bg-dofus-panel-dk/20"
      >
        <ShieldCheck size={15} className="text-dofus-success" />
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onUnlock(code);
    if (ok) {
      setOpen(false);
      setCode('');
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setCode('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => { setOpen(v => !v); setError(false); setCode(''); }}
        title="Accès restreint"
        className="p-1.5 rounded transition-colors hover:bg-dofus-panel-dk/20"
      >
        <Shield size={15} className="text-dofus-cream/25 hover:text-dofus-cream/60 transition-colors" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 panel rounded p-3 w-56 shadow-xl animate-popover-in"
        >
          <div className="flex items-center gap-2 mb-3">
            <LockKeyhole size={13} className="text-dofus-text-md shrink-0" />
            <span className="text-xs font-medium text-dofus-text-md uppercase tracking-wide">Accès restreint</span>
          </div>
          <form
            onSubmit={handleSubmit}
            className={`flex gap-2 ${shake ? 'animate-shake' : ''}`}
          >
            <input
              ref={inputRef}
              type="password"
              value={code}
              onChange={e => { setCode(e.target.value); setError(false); }}
              placeholder="Code d'accès…"
              autoComplete="off"
              className="input-dofus flex-1 text-sm py-1.5 px-2"
            />
            <button type="submit" className="btn-primary px-3 py-1.5 text-xs rounded shrink-0">
              OK
            </button>
          </form>
          {error && (
            <p className="mt-2 text-xs text-dofus-error flex items-center gap-1">
              <span>✕</span> Code incorrect
            </p>
          )}
        </div>
      )}
    </div>
  );
};
