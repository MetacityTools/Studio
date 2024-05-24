//this is our implementaiton of useQuery to facilitate the use of server-side funcitons with client-side hooks

import { useCallback, useEffect, useState } from "react";

type useQueryProps<T> = {
  queryFn: () => Promise<T>;
};

export const useQuery = <T>(props: useQueryProps<T>) => {
  const { queryFn } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await queryFn();
      setData(result);
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
