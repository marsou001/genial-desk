import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { TOAST_FLASH_MESSAGES } from "@/lib/toast-flash-keys";

export function useToastFlash() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    console.log("toastKey", toastKey);
    if (!toastKey) return;

    const toastMessage = TOAST_FLASH_MESSAGES[toastKey];
    console.log("toastMessage", toastMessage);
    if (!toastMessage) return;

    toast.error(toastMessage);

    // Remove only the "toast" param
    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");

    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");

    window.history.replaceState({}, "", newUrl);
  }, [searchParams]);
}
