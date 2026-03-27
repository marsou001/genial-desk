import { useState } from "react";

export function useIsDirty<T>(init: T, value: T) {
  const [initialValue, setInitialValue] = useState(init);
  return {
    isDirty: initialValue !== value,
    setInitialValue,
  };
}
