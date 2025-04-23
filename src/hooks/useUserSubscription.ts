
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserSubscription() {
  const { authState } = useAuth();
  return useQuery({
    enabled: !!authState.user,
    queryKey: ["user-subscription", authState.user?.id],
    queryFn: async () => {
      if (!authState.user) return null;
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*,plan:plan_id(*)")
        .eq("user_id", authState.user.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });
}
