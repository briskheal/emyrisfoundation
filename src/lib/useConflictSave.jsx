import { useState, useCallback } from 'react';

/**
 * useConflictSave — wraps a save API call with conflict detection.
 *
 * Usage:
 *   const { saving, conflictInfo, save, dismissConflict } = useConflictSave();
 *   await save(url, method, payload, loadedAt, token);
 */
export function useConflictSave() {
  const [saving, setSaving] = useState(false);
  const [conflictInfo, setConflictInfo] = useState(null); // { updatedBy, updatedAt }
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);

  const save = useCallback(async (url, method, payload, loadedAt, token, onSuccess) => {
    setSaving(true);
    setSaveError(null);
    setConflictInfo(null);
    try {
      const body = { ...payload };
      if (loadedAt) body.lastKnownUpdatedAt = loadedAt;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.status === 409) {
        const data = await res.json();
        setConflictInfo(data); // { conflict, updatedBy, updatedAt }
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setSaveError(data.error || 'Save failed');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSuccess) onSuccess();

    } catch (err) {
      setSaveError('Network error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }, []);

  const dismissConflict = useCallback(() => setConflictInfo(null), []);

  return { saving, saved, conflictInfo, saveError, save, dismissConflict };
}

/**
 * ConflictBanner — shows a warning when a 409 conflict is detected.
 * Props: conflictInfo { updatedBy, updatedAt }, onDismiss, onReload
 */
export function ConflictBanner({ conflictInfo, onDismiss, onReload }) {
  if (!conflictInfo) return null;
  const time = conflictInfo.updatedAt
    ? new Date(conflictInfo.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '';
  return (
    <div style={{
      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: '10px', padding: '14px 18px', marginBottom: '16px',
      display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap'
    }}>
      <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444', fontSize: '1.2rem', marginTop: '2px' }}></i>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#ef4444', fontWeight: 700, margin: '0 0 4px' }}>⚠️ Edit Conflict Detected</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.88rem' }}>
          This record was modified by <strong style={{ color: '#f97316' }}>{conflictInfo.updatedBy}</strong>
          {time && <> at <strong style={{ color: '#f97316' }}>{time}</strong></>} while you were editing.
          <br />Your changes were <strong>NOT saved</strong>. Reload to see the latest version.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button onClick={onReload} style={{
          padding: '6px 14px', background: 'rgba(249,115,22,0.2)',
          border: '1px solid #f97316', color: '#f97316', borderRadius: '6px',
          cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
        }}>
          <i className="fa-solid fa-rotate-right"></i> Reload
        </button>
        <button onClick={onDismiss} style={{
          padding: '6px 14px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)',
          borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem'
        }}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

/**
 * LastEditedBadge — shows who last edited a record and when.
 */
export function LastEditedBadge({ updatedBy, updatedAt }) {
  if (!updatedBy || updatedBy === 'system') return null;
  const time = updatedAt
    ? new Date(updatedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';
  return (
    <span style={{
      fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
      display: 'inline-flex', alignItems: 'center', gap: '5px', marginLeft: '10px'
    }}>
      <i className="fa-solid fa-user-pen" style={{ color: '#15F5BA' }}></i>
      Last edited by <strong style={{ color: '#15F5BA' }}>{updatedBy}</strong>
      {time && <> · {time}</>}
    </span>
  );
}
