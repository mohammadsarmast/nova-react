export function loadTableState(stateKey, storage = 'session') {
  if (typeof window === 'undefined' || !stateKey) return null;
  const store = storage === 'local' ? window.localStorage : window.sessionStorage;
  try {
    const raw = store.getItem(stateKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTableState(stateKey, state, storage = 'session') {
  if (typeof window === 'undefined' || !stateKey) return;
  const store = storage === 'local' ? window.localStorage : window.sessionStorage;
  try {
    store.setItem(stateKey, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
