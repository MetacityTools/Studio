import { instanceToPlain } from "class-transformer";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Pick<T, K>,
  );
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (!keys.includes(key as K)) {
        acc[<keyof Omit<T, K>>key] = obj[<keyof Omit<T, K>>key];
      }
      return acc;
    },
    {} as Omit<T, K>,
  );
}

export function toPlain<T>(obj: T): T {
  return instanceToPlain(obj) as T;
}
