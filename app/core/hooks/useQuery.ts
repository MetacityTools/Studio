//this is our implementaiton of useQuery to facilitate the use of server-side funcitons with client-side hooks

import { useCallback, useEffect, useState } from "react";

type useQueryProps<T> = {
  queryFn: () => Promise<T>;
  defaultValue: T;
};

type useQueryResult<T> = {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useQuery = <T>(props: useQueryProps<T>): useQueryResult<T> => {
  const { queryFn, defaultValue } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T>(defaultValue);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await queryFn();
      if (result === undefined)
        setError(new Error("Query function returned undefined"));
      else setData(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { isLoading, data, error, refetch: fetch };
};
