const CHECKINS_KEY = 'nofab_checkins';
const SETTINGS_KEY = 'nofab_user_settings';

const hasWindow = typeof window !== 'undefined';

const readJson = (key, fallback) => {
  if (!hasWindow) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read local storage key "${key}"`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!hasWindow) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write local storage key "${key}"`, error);
  }
};

const removeKey = (key) => {
  if (!hasWindow) return;
  window.localStorage.removeItem(key);
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const checkInStore = {
  list(order = '-date', limit) {
    const checkIns = [...readJson(CHECKINS_KEY, [])];
    const sorted = checkIns.sort((left, right) => {
      if (order === '-date') {
        return right.date.localeCompare(left.date);
      }

      return left.date.localeCompare(right.date);
    });

    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  },

  create(data) {
    const checkIns = readJson(CHECKINS_KEY, []);
    const nextCheckIn = { id: createId(), ...data };
    writeJson(CHECKINS_KEY, [...checkIns, nextCheckIn]);
    return nextCheckIn;
  },

  update(id, data) {
    const checkIns = readJson(CHECKINS_KEY, []);
    const updatedCheckIns = checkIns.map((item) => (
      item.id === id ? { ...item, ...data, id } : item
    ));

    const updated = updatedCheckIns.find((item) => item.id === id) || null;
    writeJson(CHECKINS_KEY, updatedCheckIns);
    return updated;
  },

  delete(id) {
    const checkIns = readJson(CHECKINS_KEY, []);
    writeJson(CHECKINS_KEY, checkIns.filter((item) => item.id !== id));
    return { success: true };
  },
};

const userSettingsStore = {
  list() {
    const settings = readJson(SETTINGS_KEY, null);
    return settings ? [settings] : [];
  },

  create(data) {
    const settings = { id: createId(), ...data };
    writeJson(SETTINGS_KEY, settings);
    return settings;
  },

  update(id, data) {
    const current = readJson(SETTINGS_KEY, null);
    if (!current) {
      const created = { id, ...data };
      writeJson(SETTINGS_KEY, created);
      return created;
    }

    const updated = { ...current, ...data, id: current.id || id };
    writeJson(SETTINGS_KEY, updated);
    return updated;
  },

  delete() {
    removeKey(SETTINGS_KEY);
    return { success: true };
  },
};

const clearAppStorage = () => {
  removeKey(CHECKINS_KEY);
  removeKey(SETTINGS_KEY);
};

export const base44 = {
  entities: {
    CheckIn: checkInStore,
    UserSettings: userSettingsStore,
  },
  auth: {
    async me() {
      return { id: 'local-user', role: 'user', provider: 'local-storage' };
    },
    logout(redirectUrl = '/') {
      clearAppStorage();
      if (hasWindow) {
        window.location.href = redirectUrl;
      }
    },
    redirectToLogin(redirectUrl = '/') {
      if (hasWindow) {
        window.location.href = redirectUrl;
      }
    },
  },
};

export const localStorageKeys = {
  checkIns: CHECKINS_KEY,
  userSettings: SETTINGS_KEY,
};
