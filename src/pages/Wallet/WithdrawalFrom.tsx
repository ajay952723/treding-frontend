import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/State/Store";
import { createWithdrawal } from "@/State/withdrawal/withdrawalSlice";
import { fetchPaymentDetails } from "@/State/payment/paymentDetailsSlice";
import { toast } from "react-toastify";

const WithdrawalForm = () => {
  const [amount, setAmount] = useState('');
  const dispatch = useAppDispatch();

  const wallet = useAppSelector((state) => state.wallet.wallet);
  const { details: paymentDetails, loading } = useAppSelector(
    (state) => state.paymentDetails
  );

  // Fetch bank details on component mount
  useEffect(() => {
    dispatch(fetchPaymentDetails());
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (parsedAmount > (wallet?.balance || 0)) {
      toast.error("Insufficient balance.");
      return;
    }

    if (!paymentDetails) {
      toast.error("No bank details found.");
      return;
    }

    try {
      const result = await dispatch(createWithdrawal(parsedAmount));

      if (createWithdrawal.fulfilled.match(result)) {
        toast.success("Withdrawal request submitted!");
      } else {
        toast.error(
          typeof result.payload === "string"
            ? result.payload
            : "Withdrawal failed."
        );
      }
    } catch (error) {
      toast.error("Unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-10 space-y-5">
      {/* Available Balance */}
      <div className="flex justify-between items-center rounded-md bg-slate-900 text-xl font-bold px-5 py-4 text-white">
        <p>Available balance</p>
        <p>${wallet?.balance?.toFixed(2) || "0.00"}</p>
      </div>

      {/* Withdrawal Amount Input */}
      <div className="flex flex-col items-center">
        <h1 className="text-lg font-semibold mb-2">Enter Withdrawal Amount</h1>
        <Input
          onChange={handleChange}
          value={amount}
          className="withdrawalInput py-7 border-none outline-none px-0 text-2xl text-center"
          placeholder="$9999"
          type="number"
        />
      </div>

      {/* Bank Info (Dynamic) */}
      <div>
        <p className="pb-2 font-medium">Transfer to</p>

        {loading ? (
          <p>Loading bank details...</p>
        ) : paymentDetails ? (
          <div className="flex items-center gap-4 border px-5 py-3 rounded-md">
            <img
              className="h-8 w-8"
              src="https://cdn.pixabay.com/photo/2020/02/18/11/03/bank-4859142_1280.png"
              alt="Bank Logo"
            />
            <div>
              <p className="text-xl font-bold">{paymentDetails.bankName}</p>
              <p className="text-xs text-gray-500">
                ********{paymentDetails.accountNumber.slice(-4)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-sm">
            No payment details found. Please add your bank details first.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <DialogClose className="w-full">
        <Button type="submit" className="w-full py-7 text-xl">
          Withdraw
        </Button>
      </DialogClose>
    </form>
  );
};

export default WithdrawalForm;
