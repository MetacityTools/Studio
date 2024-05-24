//this is our implementaiton of useQuery to facilitate the use of server-side funcitons with client-side hooks

import { useCallback, useEffect, useState } from "react";

type Mutation<T, Args extends any[]> = (...args: Args) => Promise<T>;

type useMutationResult<T, Args extends any[]> = {
  call: (...args: Args) => Promise<void>;
  data: T | null;
  inProgress: boolean;
  error: Error | null;
};

export const useMutation = <T, Args extends any[]>(
  mutation: Mutation<T, Args>
): useMutationResult<T, Args> => {
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    async (...args: Args) => {
      setInProgress(true);
      try {
        const result = await mutation(...args);
        if (result === undefined)
          setError(new Error("Query function returned undefined"));
        else setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setInProgress(false);
      }
    },
    [mutation]
  );

  return { inProgress, data, error, call };
};
