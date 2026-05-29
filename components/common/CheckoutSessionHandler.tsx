"use client";

import { useFetchCheckoutSession } from "@/lib/api/checkout-session";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CheckoutSessionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, getSessionStatus } = useFetchCheckoutSession();
  const pathname = usePathname();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    async function checkSession() {
      try {
        await getSessionStatus(sessionId!);
        if (session?.payment_status === "paid") {
          toast.success("Subscription active! Your plan is ready.");
        } else if (session?.payment_status === "unpaid") {
          toast.error("Payment was not completed. Please try again.");
        }
      } catch {
        // silently fail
      }

      const params = new URLSearchParams(searchParams.toString());
      params.delete("session_id");

      const newUrl =
        pathname + (params.toString() ? `?${params.toString()}` : "");
      router.replace(newUrl);
    }

    const timer = setTimeout(checkSession, 500);
    return () => clearTimeout(timer);
  }, [sessionId, searchParams, router, pathname]);

  return null;
}
