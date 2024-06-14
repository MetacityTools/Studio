import { instanceToPlain } from "class-transformer";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

export function toPlain<T>(obj: T): T {
  return instanceToPlain(obj) as T;
}
