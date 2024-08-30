import { useQuery } from "@core/hooks/useQuery";
import { hasAccess } from "@features/auth/hasAccess";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export const withUserEnabled = <T extends {}>(
  WrappedComponent: React.FC<T>,
) => {
  // eslint-disable-next-line react/display-name
  return (props: T) => {
    const { data: enabled } = useQuery({
      queryFn: hasAccess,
      defaultValue: undefined,
    });

    useEffect(() => {
      if (enabled === false) redirect("/user-not-enabled");
    }, [enabled]);

    if (!enabled) return null;
    else return <WrappedComponent {...props} />;
  };
};
