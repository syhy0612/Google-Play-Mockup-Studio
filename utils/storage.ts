import { SavedScheme } from '../types';

const LEGACY_STORAGE_KEY = 'mockup_schemes';
const LIST_KEY = 'mockup_scheme_ids';
const SCHEME_PREFIX = 'scheme_';

export type StorageErrorReason = 'quota' | 'unknown';

export class StorageError extends Error {
  reason: StorageErrorReason;
  constructor(reason: StorageErrorReason, message: string) {
    super(message);
    this.name = 'StorageError';
    this.reason = reason;
  }
}

const isQuotaError = (e: unknown): boolean => {
  if (!(e instanceof DOMException)) return false;
  return (
    e.name === 'QuotaExceededError' ||
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    e.code === 22 ||
    e.code === 1014
  );
};

const safeWrite = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (isQuotaError(e)) {
      throw new StorageError('quota', '本地存储空间已满，请删除部分方案或截图后重试。');
    }
    throw new StorageError('unknown', `存储失败: ${(e as Error).message ?? String(e)}`);
  }
};

const readIds = (): string[] => {
  const raw = localStorage.getItem(LIST_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
};

export const getSchemes = (): SavedScheme[] => {
  try {
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyData) {
      try {
        const legacy: SavedScheme[] = JSON.parse(legacyData);
        if (Array.isArray(legacy) && legacy.length > 0) {
          safeWrite(LIST_KEY, JSON.stringify(legacy.map((s) => s.id)));
          legacy.forEach((s) => safeWrite(SCHEME_PREFIX + s.id, JSON.stringify(s)));
          localStorage.removeItem(LEGACY_STORAGE_KEY);
          return legacy;
        }
      } catch (e) {
        console.error('Migration failed', e);
      }
    }

    return readIds()
      .map((id) => {
        const data = localStorage.getItem(SCHEME_PREFIX + id);
        return data ? (JSON.parse(data) as SavedScheme) : null;
      })
      .filter((s): s is SavedScheme => s !== null);
  } catch (e) {
    console.error('Failed to load schemes', e);
    return [];
  }
};

export const addScheme = (scheme: SavedScheme): void => {
  safeWrite(SCHEME_PREFIX + scheme.id, JSON.stringify(scheme));
  const ids = readIds();
  if (!ids.includes(scheme.id)) {
    safeWrite(LIST_KEY, JSON.stringify([scheme.id, ...ids]));
  }
};

export const updateScheme = (scheme: SavedScheme): void => {
  const existing = localStorage.getItem(SCHEME_PREFIX + scheme.id);
  const next = JSON.stringify(scheme);
  if (existing !== next) {
    safeWrite(SCHEME_PREFIX + scheme.id, next);
  }
};

export const deleteScheme = (id: string): void => {
  localStorage.removeItem(SCHEME_PREFIX + id);
  safeWrite(LIST_KEY, JSON.stringify(readIds().filter((i) => i !== id)));
};
