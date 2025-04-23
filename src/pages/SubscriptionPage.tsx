
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/usePlans";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@supabase/supabase-js";

// Utility - get supabase client with anon/public key from environment
function getSupabaseClient() {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

export default function SubscriptionPage() {
  const { authState } = useAuth();
  const { data: plans, isLoading: loadingPlans } = usePlans();
  const { data: subscription, refetch } = useUserSubscription();
  const [isProcessing, setIsProcessing] = useState("");
  const [confirmPlanId, setConfirmPlanId] = useState<string | null>(null);

  const currentPlanId = subscription?.plan_id;
  
  // Function to open confirmation dialog
  const handleChoosePlan = (planId: string) => {
    setConfirmPlanId(planId);
  };

  // Function that actually processes the subscription after confirmation
  const handleSubscribe = async (planId: string) => {
    if (!authState.user) return toast.error("Please login first.");
    
    // Special handling for free plan
    if (planId === 'free_plan') {
      setIsProcessing(planId);
      setTimeout(async () => {
        toast.success("Switched to Free plan");
        await refetch();
        setIsProcessing("");
      }, 500);
      return;
    }

    setIsProcessing(planId);

    // NEW: Real payment gateway integration for paid plans
    try {
      toast.info("Contacting payment gateway...");
      const supabase = getSupabaseClient();

      // Call the "create-checkout" edge function to get real Stripe session
      let priceCents = plans?.find(p => p.id === planId)?.price_cents || 0;

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          plan_id: planId,
          amount: priceCents,
        },
      });

      if (error || !data?.url) {
        throw new Error(error?.message || "Failed to start payment session.");
      }

      window.location.href = data.url; // Redirect to Stripe checkout
    } catch (e: any) {
      toast.error(e.message || "Could not start payment process.");
      setIsProcessing("");
    }
  };

  // Get the selected plan details for confirmation dialog
  const selectedPlan = plans?.find(plan => plan.id === confirmPlanId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-14 px-4">
        <h1 className="text-2xl font-bold mb-6">Choose Your ShiftBox Plan</h1>
        {loadingPlans ? (
          <div>Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans?.map((plan: any) => (
              <div
                key={plan.id}
                className={`rounded-xl border-2 p-6 shadow-sm transition-all ${
                  currentPlanId === plan.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                } ${plan.price_cents === 0 ? "border-green-500" : ""}`}
              >
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="mb-2 text-muted-foreground">{plan.description}</p>
                <div className="text-3xl font-extrabold mb-2">
                  {plan.price_cents === 0 
                    ? "Free" 
                    : `$${(plan.price_cents / 100).toFixed(2)}`}
                </div>
                <div className="mb-6 text-xs text-muted-foreground">
                  Upload up to <span className="font-semibold">{plan.file_limit}</span> files
                </div>
                {currentPlanId === plan.id ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleChoosePlan(plan.id)}
                    disabled={!!isProcessing && isProcessing !== plan.id}
                  >
                    {isProcessing === plan.id ? "Processing..." : "Choose Plan"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        {currentPlanId && (
          <div className="mt-12 text-center text-muted-foreground">
            You are currently subscribed to:{" "}
            <span className="font-bold">{subscription?.plan?.name}</span>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmPlanId} onOpenChange={() => setConfirmPlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {currentPlanId ? "switch to" : "subscribe to"} the {selectedPlan?.name} plan
              {selectedPlan?.price_cents > 0 ? ` for $${(selectedPlan.price_cents / 100).toFixed(2)}` : ""}?
              {selectedPlan?.price_cents > 0 && <div className="mt-2 font-medium">You will proceed to a secure payment gateway.</div>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                const planId = confirmPlanId as string;
                setConfirmPlanId(null);
                handleSubscribe(planId);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
