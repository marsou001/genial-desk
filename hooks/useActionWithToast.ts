import { ActionStateBase } from "@/types/action-states";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function useActionWithToast<State extends ActionStateBase>(
  action: (state: Awaited<State>, formData: FormData) => State | Promise<State>,
  initState: Awaited<State>,
  successMessage: string,
) {
  const [state, formAction, isPending] = useActionState<State, FormData>(
    action,
    initState,
  );

  useEffect(() => {
    if (isPending) return;
    if (state.error !== null) {
      toast.error(state.error);
    } else if (state.isSuccess) {
      toast.success(successMessage);
    }
  }, [isPending, state]);

  return { state, formAction, isPending };
}
