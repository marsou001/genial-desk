import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export function useUserClient() {
  const router = useRouter();

  return async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      router.push("/sign-in");
    }

    return data.user;
  };
}
