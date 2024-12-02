import { useSelected } from "@features/editor/hooks/useSelected";
import { useEffect, useState } from "react";

export default function useSelectedSubmodelCount() {
  const selected = useSelected();

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let newCount = 0;
    selected.forEach((submodels) => {
      newCount += submodels.size;
    });
    setCount(newCount);
  }, [selected]);

  return count;
}
