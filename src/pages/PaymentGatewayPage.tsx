
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserSubscription } from "@/hooks/useUserSubscription";

export default function PaymentGatewayPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get("plan");
  const priceCents = Number(searchParams.get("price") || "0");
  const { refetch } = useUserSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!planId) {
      toast.error("No plan selected");
      navigate("/subscription");
    }
  }, [planId, navigate]);

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(async () => {
      toast.success("Payment successful!");
      await refetch(); // Refresh subscription data
      navigate("/subscription");
    }, 1500);
  };

  const handleCancel = () => {
    toast.info("Payment cancelled");
    navigate("/subscription");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-lg bg-card">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Gateway</h1>
        <div className="mb-8 p-4 bg-muted rounded-md">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between mb-1">
            <span>Plan ID:</span>
            <span className="font-medium">{planId}</span>
          </div>
          <div className="flex justify-between mb-4 text-lg">
            <span>Amount:</span>
            <span className="font-bold">${(priceCents / 100).toFixed(2)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            This is a simulated payment page. In a real application, you would be redirected to Stripe or another payment processor.
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePaymentSuccess} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
