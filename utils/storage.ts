import { SavedScheme } from '../types';

const LEGACY_STORAGE_KEY = 'mockup_schemes';
const LIST_KEY = 'mockup_scheme_ids';
const SCHEME_PREFIX = 'scheme_';

// Helper to safely get local storage item
const get = (key: string) => localStorage.getItem(key);
// Helper to safely set local storage item
const set = (key: string, value: string) => localStorage.setItem(key, value);
// Helper to safely remove
const remove = (key: string) => localStorage.removeItem(key);

export const getSchemes = async (): Promise<SavedScheme[]> => {
    try {
        // 1. Check for legacy data and migrate
        const legacyData = get(LEGACY_STORAGE_KEY);
        if (legacyData) {
            try {
                const legacySchemes: SavedScheme[] = JSON.parse(legacyData);
                if (Array.isArray(legacySchemes) && legacySchemes.length > 0) {
                    // Migrate to new format
                    const ids = legacySchemes.map(s => s.id);
                    set(LIST_KEY, JSON.stringify(ids));
                    legacySchemes.forEach(s => {
                        set(SCHEME_PREFIX + s.id, JSON.stringify(s));
                    });
                    // Remove legacy
                    remove(LEGACY_STORAGE_KEY);
                    return legacySchemes;
                }
            } catch (e) {
                console.error("Migration failed", e);
            }
        }

        // 2. Load from new format
        const idsJSON = get(LIST_KEY);
        if (!idsJSON) return [];
        
        const ids: string[] = JSON.parse(idsJSON);
        const schemes = ids.map(id => {
            const data = get(SCHEME_PREFIX + id);
            return data ? JSON.parse(data) : null;
        }).filter((s): s is SavedScheme => s !== null);
        
        return schemes;
    } catch (e) {
        console.error("Failed to load schemes", e);
        return [];
    }
};

export const addScheme = async (scheme: SavedScheme): Promise<void> => {
    // 1. Save the scheme data
    // Optimization: If the scheme is identical to what's already saved, skip writing.
    // However, since this is 'add', it's likely new. 
    // But we should check if we are just re-saving an existing ID to be safe, 
    // though updateScheme is for that.
    set(SCHEME_PREFIX + scheme.id, JSON.stringify(scheme));
    
    // 2. Update the list (prepend)
    const idsJSON = get(LIST_KEY);
    const ids: string[] = idsJSON ? JSON.parse(idsJSON) : [];
    if (!ids.includes(scheme.id)) {
        set(LIST_KEY, JSON.stringify([scheme.id, ...ids]));
    }
};

export const updateScheme = async (scheme: SavedScheme): Promise<void> => {
    // Optimization: Check if data actually changed before writing
    const existingData = get(SCHEME_PREFIX + scheme.id);
    const newData = JSON.stringify(scheme);
    
    if (existingData !== newData) {
        set(SCHEME_PREFIX + scheme.id, newData);
    }
};

export const deleteScheme = async (id: string): Promise<void> => {
    // 1. Remove data
    remove(SCHEME_PREFIX + id);
    
    // 2. Update list
    const idsJSON = get(LIST_KEY);
    if (idsJSON) {
        const ids: string[] = JSON.parse(idsJSON);
        const newIds = ids.filter(i => i !== id);
        set(LIST_KEY, JSON.stringify(newIds));
    }
};

// Fallback for bulk save if needed (e.g. reordering)
export const saveSchemesOrder = async (schemes: SavedScheme[]): Promise<void> => {
    const ids = schemes.map(s => s.id);
    set(LIST_KEY, JSON.stringify(ids));
};
