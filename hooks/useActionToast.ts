import { useActionState, useEffect } from "react";
import { toast } from "sonner";

type ActionState = {
  error: string | null;
  [k: string]: any;
};

export function useActionToast<T extends ActionState>(
  action: (_: T, formData: FormData) => T | Promise<T>,
  initState: T,
  successMessage: string,
) {
  const [state, formAction, isPending] = useActionState<T, FormData>(
    action,
    initState,
  );

  useEffect(() => {
    if (isPending) return;
    if (state.error !== null) {
      toast.error(state.error);
    } else {
      toast.success(successMessage);
    }
  }, [isPending, state]);

  return { formAction };
}
