import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch } from "@/State/Store";
import { createPaymentOrder } from "@/State/payment/paymentSlice";

const TopUpForm = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "STRIPE">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(
        createPaymentOrder({
          amount: Number(amount),
          paymentMethod,
        })
      ).unwrap();

      console.log("Payment link:", res.payment_url);
      window.open(res.payment_url, "_blank");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to create payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="bg-[#0b1320] p-6 rounded-lg w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 text-white">
        {/* Amount Input */}
        <div>
          <Label htmlFor="amount" className="text-sm mb-1 block">Enter Amount</Label>
          <Input
            id="amount"
            placeholder="$999"
            className="text-base py-4"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={handleChange}
          />
        </div>

        {/* Payment Method */}
        <div>
          <Label className="text-sm mb-1 block">Select Payment Method</Label>
          <RadioGroup
            className="flex gap-4"
            value={paymentMethod}
            onValueChange={(val) => setPaymentMethod(val as "RAZORPAY" | "STRIPE")}
          >
            {/* Razorpay */}
            <div
              className={`relative flex items-center space-x-2 border p-3 rounded-md cursor-pointer w-fit transition ${paymentMethod === 'RAZORPAY'
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white text-black border-gray-300'
                }`}
            >
              <RadioGroupItem id="razorpay" value="RAZORPAY" />
              <Label htmlFor="razorpay" className="cursor-pointer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png"
                  alt="Razorpay"
                  className="h-6"
                />
              </Label>
              {paymentMethod === 'RAZORPAY' && (
                <Check className="absolute top-1 right-1 h-4 w-4 text-green-500" />
              )}
            </div>

            {/* Stripe */}
            <div
              className={`relative flex items-center space-x-2 border p-3 rounded-md cursor-pointer w-fit transition ${paymentMethod === 'STRIPE'
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white text-black border-gray-300'
                }`}
            >
              <RadioGroupItem id="stripe" value="STRIPE" />
              <Label htmlFor="stripe" className="cursor-pointer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/768px-Stripe_Logo%2C_revised_2016.svg.png"
                  alt="Stripe"
                  className="h-6"
                />
              </Label>
              {paymentMethod === 'STRIPE' && (
                <Check className="absolute top-1 right-1 h-4 w-4 text-green-500" />
              )}
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full py-6 text-base" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default TopUpForm;
