type Validator<T> = (value: unknown) => value is T;

const isBrowser = typeof window !== 'undefined';

const safeParseJson = <T>(value: string | null, validator?: Validator<T>): T | undefined => {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (validator && !validator(parsed)) {
      console.warn('Storage parse failed validation');
      return undefined;
    }
    return parsed as T;
  } catch (err) {
    console.warn('Storage parse error', err);
    return undefined;
  }
};

const load = <T>(key: string, validator?: Validator<T>): T | undefined => {
  if (!isBrowser) return undefined;
  return safeParseJson<T>(localStorage.getItem(key), validator);
};

const save = <T>(key: string, value: T) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage save error', err);
  }
};

const remove = (key: string) => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Storage remove error', err);
  }
};

const createDebouncedSaver = <T>(key: string, delay: number, validator?: Validator<T>) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (value: T | null) => {
    if (!isBrowser) return;
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      if (value === null) {
        remove(key);
        return;
      }
      if (validator && !validator(value)) {
        console.warn('Storage save blocked by validation');
        return;
      }
      save<T>(key, value);
    }, delay);
  };
};

export const storage = {
  load,
  save,
  remove,
  createDebouncedSaver,
};

export type { Validator };
