
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/usePlans";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

export default function SubscriptionPage() {
  const { authState } = useAuth();
  const { data: plans, isLoading: loadingPlans } = usePlans();
  const { data: subscription, refetch } = useUserSubscription();
  const [isProcessing, setIsProcessing] = useState("");

  const currentPlanId = subscription?.plan_id;

  const handleSubscribe = async (planId: string) => {
    if (!authState.user) return toast.error("Please login first.");
    setIsProcessing(planId);
    // This is where Polar Payments integration would happen (pseudo, since not real API)
    // You would open the payment modal, get Stripe token/session, etc. We'll simulate for now.
    setTimeout(async () => {
      toast.success(`Subscribed to plan: ${planId}!`);
      // Refetch subscription info
      await refetch();
      setIsProcessing("");
    }, 1200);
  };

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
                }`}
              >
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="mb-2 text-muted-foreground">{plan.description}</p>
                <div className="text-3xl font-extrabold mb-2">
                  ${ (plan.price_cents / 100).toFixed(2) }
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
                    onClick={() => handleSubscribe(plan.id)}
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
    </div>
  );
}
