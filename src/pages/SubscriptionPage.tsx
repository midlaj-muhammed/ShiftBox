
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
    // This is where Polar Payments integration would happen (pseudo, since not real API)
    // You would open the payment modal, get Stripe token/session, etc. We'll simulate for now.
    setTimeout(async () => {
      toast.success(`Subscribed to plan: ${planId}!`);
      // Refetch subscription info
      await refetch();
      setIsProcessing("");
    }, 1200);
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
              {selectedPlan?.price_cents > 0 && <div className="mt-2 font-medium">Your payment information will be collected on the next screen.</div>}
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
